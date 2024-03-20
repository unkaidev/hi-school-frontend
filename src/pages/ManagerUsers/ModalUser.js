import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect, useState } from 'react';
import { createNewUser, updateCurrentUser, fetchAllRoleForManager } from '../../services/userServices'
import { toast } from 'react-toastify';
import _, { forEach } from 'lodash';
import Select from 'react-select'

const ModalUser = (props) => {
    const { action, dataModalUser, show, onHide, schoolId } = props;

    const defaultUserData = {
        email: '',
        phone: '',
        username: '',
        password: '',
        gender: '',
        schoolId: schoolId,
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
        getRoles();

    }, [])



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
                setUserData({ ...dataModalUser, role: roleIds[0], schoolId: schoolId });
            } else {
                setUserData({ ...dataModalUser, role: '' });
            }
        }
    }, [action, dataModalUser])
    const getRoles = async () => {
        try {
            let response = await fetchAllRoleForManager();
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

    const handleOnChangeInput = (value, name) => {
        let _userData = _.cloneDeep(userData);
        _userData[name] = value;
        setUserData(_userData);
    }
    const onChangeSelect = (event) => {
        const selectedValue = event.target.value;
        handleOnChangeInput(selectedValue, "role");
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
                    gender: userData['gender'] === null ? 'Male' : userData['gender']
                });
            }

            if (response && response.ec === 0) {
                setUserData({
                    ...defaultUserData, role: userRoles && userRoles.length > 0
                        ? userRoles[0].id : ''
                })
                window.location.reload()
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
                                className={validInputs.email ? 'form-control' : 'form-control is-invalid'}
                                type="email" value={userData.email}
                                onChange={(event) => handleOnChangeInput(event.target.value, "email")}

                            />
                        </div>
                        <div className='col-12 col-sm-6 form-role'>
                            <label>Số điện thoại(<span className='text-danger'>*</span>):</label>
                            <input
                                className={validInputs.phone ? 'form-control' : 'form-control is-invalid'}
                                type="text" value={userData.phone}
                                onChange={(event) => handleOnChangeInput(event.target.value, "phone")}
                            />
                        </div>
                        <div className='col-12 col-sm-6 form-role'>
                            <label>Username(<span className='text-danger'>*</span>):</label>
                            <input
                                disabled={action !== 'CREATE'}
                                className={validInputs.username ? 'form-control' : 'form-control is-invalid'}
                                type="text" value={userData.username}
                                onChange={(event) => handleOnChangeInput(event.target.value, "username")} />
                        </div>
                        <div className='col-12 col-sm-6 form-role'>
                            {action === 'CREATE'
                                && <>
                                    <label>Mật khẩu(<span className='text-danger'>*</span>):</label>
                                    <input className={validInputs.password ? 'form-control' : 'form-control is-invalid'}
                                        type="password" value={userData.password}
                                        onChange={(event) => handleOnChangeInput(event.target.value, "password")} />
                                </>
                            }

                        </div>
                        <div className='col-12 col-sm-6 form-role'>
                            <label>Giới tính:</label>
                            <Select
                                options={genderOptions}
                                onChange={(selectedOption) => handleOnChangeInput(selectedOption.value, "gender")}
                                value={genderOptions.find(option => option.value === userData.gender)}
                            />
                        </div>

                        <div className='col-12 col-sm-6 form-role'>
                            <label>Roles(<span className='text-danger'>*</span>):</label>
                            <select
                                className={validInputs.role ? 'form-select' : 'form-select is-invalid'}
                                onChange={onChangeSelect}
                                value={userData.role}
                            >
                                {userRoles.length > 0 &&
                                    userRoles.map((item, i) => (
                                        <option key={`role-${i}`} value={item.id}>{item.name.substring(5)}</option>
                                    ))
                                }
                            </select>
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