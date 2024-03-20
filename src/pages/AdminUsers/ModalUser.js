import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import { createNewUser, updateCurrentUser, fetchAllRoleForAdmin } from '../../services/userServices'
import { fetchAllSchools } from '../../services/schoolServices';
import { toast } from 'react-toastify';
import _, { forEach } from 'lodash';
import Select from 'react-select';


const ModalUser = (props) => {
    const { action, dataModalUser, show, onHide } = props;
    const [schools, setSchools] = useState([]);

    const defaultUserData = {
        email: '',
        phone: '',
        username: '',
        password: '',
        gender: '',
        school: {
            id: '',
            name: '',
        },
        role: ''
    }
    const validInputsDefault = {
        email: true,
        phone: true,
        username: true,
        password: true,
        gender: true,
        role: true
    }

    const [userData, setUserData] = useState(defaultUserData);
    const [validInputs, setValidInputs] = useState(validInputsDefault);

    const [userRoles, setUserRoles] = useState([]);

    useEffect(() => {
        if (action === 'CREATE') {
            getRoles();
            fetchSchools();
        }
    }, [action, dataModalUser]);


    const fetchSchools = async () => {
        try {
            const response = await fetchAllSchools();
            if (response && response.dt.length > 0) {
                const mappedSchools = response.dt.map(school => ({
                    id: school.id,
                    name: school.name
                }));
                setSchools(mappedSchools);
            }
        } catch (error) {
            console.error("Error fetching school IDs:", error);
        }
    }



    useEffect(() => {
        if (action === 'CREATE') {
            setUserData(prevUserData => ({
                ...prevUserData,
                role: userRoles.length > 0 ? userRoles[0].id : ''
            }));
        }
    }, [action, userRoles]);

    useEffect(() => {
        if (action === 'UPDATE') {
            if (dataModalUser.roles && dataModalUser.roles.length > 0) {
                const roleIds = dataModalUser.roles.map(role => role.id);
                setUserData({
                    ...dataModalUser,
                    role: roleIds[0],
                    school:
                    {
                        id: dataModalUser.school.id,
                    }
                });
            } else {
                setUserData({ ...dataModalUser, role: '' });
            }
        }
    }, [action, dataModalUser])


    const getRoles = async () => {
        try {
            let response = await fetchAllRoleForAdmin();
            if (response && response.ec === 0 && response.dt && response.dt.length > 0) {
                setUserRoles(response.dt);
                let roles = response.dt;
                setUserData(prevUserData => ({ ...prevUserData, role: roles[0].id }));
            } else {
                toast.error(response ? response.em : "Error occurred");
            }
        } catch (error) {
            console.error("Error fetching roles:", error);
            toast.error("Error fetching roles");
        }
    }

    const handleOnChangeInput = (selectedOption) => {
        setUserData(prevUserData => ({
            ...prevUserData,
            school: {
                id: selectedOption.value,
                name: selectedOption.label
            }
        }));
    }

    const handleOnChange = (event, name) => {
        const value = event.target.value;
        setUserData(prevUserData => ({
            ...prevUserData,
            [name]: value
        }));
    }

    const onChangeSelect = (event) => {
        const selectedValue = event.target.value;
        handleOnChangeInput(selectedValue, "role");
    }
    const handleOnChangeGender = (value, name) => {
        let _userData = _.cloneDeep(userData);
        _userData[name] = value;
        setUserData(_userData);
    }

    const CheckValidInputs = () => {

        if (action === 'UPDATE') return true;

        // create user
        setValidInputs(validInputsDefault);
        let arr = ["email", "phone", "username", "password", "role"];
        let check = true;
        for (let i = 0; i < arr.length; i++) {
            // check empty input
            if (!userData[arr[i]]) {
                let _validInputs = _.cloneDeep(validInputsDefault);
                _validInputs[arr[i]] = false;
                setValidInputs(_validInputs);

                toast.error(`Empty input ${arr[i]}`);

                check = false;
                break;
            }
            // check valid email format
            if (arr[i] === "email" && !validateEmail(userData[arr[i]])) {
                let _validInputs = _.cloneDeep(validInputsDefault);
                _validInputs[arr[i]] = false;
                setValidInputs(_validInputs);

                toast.error(`Invalid email format`);

                check = false;
                break;
            }
            // check valid phone number format
            if (arr[i] === "phone" && !validatePhoneNumber(userData[arr[i]])) {
                let _validInputs = _.cloneDeep(validInputsDefault);
                _validInputs[arr[i]] = false;
                setValidInputs(_validInputs);

                toast.error(`Invalid phone number format`);

                check = false;
                break;
            }
        }
        return check;

    }

    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

    const validatePhoneNumber = (phone) => {
        const re = /^[0-9]{10}$/;
        return re.test(phone);
    }

    function findRoleNameById(roles, roleId) {
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].id === roleId) {
                let roleName = roles[i].name;
                let cleanedRoleName = roleName.substring(5).toLowerCase();
                return cleanedRoleName;
            }
        }
        return "Role not found";
    }
    const handleConfirmUser = async () => {

        //create User
        let check = CheckValidInputs();
        if (check) {
            let response;
            let role_id = userData['role'];
            let role_name = findRoleNameById(userRoles, +role_id);


            if (action === 'CREATE') {
                response = await createNewUser({ ...userData, roles: [role_name] })
            } else {
                response = await updateCurrentUser({
                    ...userData, roleId: role_id,
                });
            }

            if (response && response.ec === 0) {
                props.onHide();
                setUserData({
                    ...defaultUserData, role: userRoles && userRoles.length > 0
                        ? userRoles[0].id : ''
                })
                toast.success(response.em)
            }
            if (response && response.ec !== 0) {
                toast.error(response.em);
                let _validInputs = _.cloneDeep(validInputsDefault);
                _validInputs[response.dt] = false;
                setValidInputs(_validInputs);
            }
        }
    }
    const handleCloseModalUser = () => {
        onHide();
        setUserData(defaultUserData);
        setValidInputs(validInputsDefault);
    }
    const genderOptions = [
        { value: 'Nam', label: 'Nam' },
        { value: 'Nữ', label: 'Nữ' },
        { value: 'Khác', label: 'Khác' }
    ];


    return (
        <>
            <Modal size="lg" show={show} className='modal-user' onHide={() => handleCloseModalUser()}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <span>{action === 'CREATE'
                            ? 'Tạo mới người dùng' : 'Chỉnh sửa người dùng'}</span>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='content-body row'>
                        <div className='col-12 col-sm-6 form-role'>
                            <label> Địa chỉ Email (<span className='text-danger'>*</span>): </label>
                            <input
                                disabled={action !== 'CREATE'}
                                className={validInputs.email ? 'form-control fw-bold' : 'form-control fw-bold is-invalid'}
                                type="email" value={userData.email}
                                onChange={(event) => handleOnChange(event, "email")}
                                placeholder="Email..."

                            />
                        </div>
                        <div className='col-12 col-sm-6 form-role'>
                            <label>Số điện thoại(<span className='text-danger'>*</span>):</label>
                            <input
                                disabled={action !== 'CREATE'}
                                className={validInputs.phone ? 'form-control fw-bold' : 'form-control fw-bold is-invalid'}
                                type="text" value={userData.phone}
                                onChange={(event) => handleOnChange(event, "phone")}
                                placeholder="Phone..."
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-role'>
                            <label>Username(<span className='text-danger'>*</span>):</label>
                            <input
                                disabled={action !== 'CREATE'}
                                className={validInputs.username ? 'form-control fw-bold' : 'form-control fw-bold is-invalid'}
                                type="text" value={userData.username}
                                onChange={(event) => handleOnChange(event, "username")}
                                placeholder="Username..."
                            />

                        </div>
                        <div className='col-12 col-sm-6 form-role'>
                            {action === 'CREATE'
                                && <>
                                    <label>Mật khẩu(<span className='text-danger'>*</span>):</label>
                                    <input className={validInputs.password ? 'form-control fw-bold' : 'form-control fw-bold is-invalid'}
                                        type="password" value={userData.password}
                                        onChange={(event) => handleOnChange(event, "password")}
                                        placeholder="Mật khẩu..."
                                    />
                                </>
                            }

                        </div>
                        <div className='col-12 col-sm-6 form-role'>
                            <label>Giới tính:</label>
                            <Select
                                options={genderOptions}
                                className='fw-bold'
                                onChange={(selectedOption) => handleOnChangeGender(selectedOption.value, "gender")}
                                value={genderOptions.find(option => option.value === userData.gender)}
                                placeholder="Nam..."
                            />
                        </div>

                        <div className='col-12 col-sm-6 form-role'>
                            <label>Roles(<span className='text-danger'>*</span>):</label>
                            <select
                                className={validInputs.role ? 'form-select fw-bold' : 'form-select fw-bold is-invalid'}
                                onChange={onChangeSelect}
                                value={userData.role}
                                disabled='true'
                            >
                                {userRoles.length > 0 &&
                                    userRoles.map((item, i) => (
                                        <option key={`role-${i}`} value={item.id}>{item.name.substring(5)}</option>
                                    ))
                                }
                            </select>
                        </div>
                        <div className='col-12 col-sm-12'>
                            <label>Trường học:</label>
                            <Select
                                className='basic-single fw-bold'
                                classNamePrefix='select'
                                options={schools && schools.length > 0 ? schools.map(school => ({ value: school.id, label: school.name })) : []}
                                value={userData.school.id ? { value: userData.school.id, label: userData.school.name } : null}
                                onChange={(selectedOption) => handleOnChangeInput(selectedOption)}
                                placeholder="Trường học..."
                            />
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleCloseModalUser()}>Đóng</Button>
                    <Button variant="primary" onClick={() => handleConfirmUser()}>
                        {action === 'CREATE' ? 'Lưu' : 'Cập nhật'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default ModalUser;