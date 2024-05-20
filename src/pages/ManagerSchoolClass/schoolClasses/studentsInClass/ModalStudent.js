import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { createNewStudent, updateCurrentStudent } from '../../../../services/studentServices';
import { getAllCity, getAllDistrict, getAllIssuedPlace, getAllProvince, getAllWardCommune } from '../../../../services/addressService';
import { toast } from 'react-toastify';
import Select from 'react-select';
import _ from 'lodash';
import './modalStudent.scss';
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";

const ModalStudent = (props) => {
    const { action, dataModalStudent, show, onHide, schoolId, gender } = props;
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [wardCommunes, setWardCommunes] = useState([]);
    const [issuedPlaceNames, setIssuedPlaceNames] = useState([{}]);

    const defaultStudentData = {
        avatar: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'Nam',
        nationality: 'Việt Nam',
        ethnicity: 'Kinh',
        citizenId: '',
        issuedDate: '',
        issuedPlace: {
            name: '',
        },
        permanentAddress: {
            city: '',
            province: '',
            district: '',
            wardCommune: '',
            other: '',
        },
        contactAddress: {
            city: '',
            province: '',
            district: '',
            wardCommune: '',
            other: '',
        },
        user: {
            username: '',
            email: '',
            schoolId: +schoolId,
        },
        parent: {
            firstName: '',
            lastName: '',
        }
    }
    const [studentData, setStudentData] = useState(defaultStudentData);

    const validInputsDefault = {
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        gender: true,
        nationality: true,
        ethnicity: true,
        citizenId: true,
        issuedDate: true,
        issuedPlace: {
            name: true,
        },
        permanentAddress: {
            city: true,
            province: true,
            district: true,
            wardCommune: true
        },
        contactAddress: {
            city: true,
            province: true,
            district: true,
            wardCommune: true
        },
        user: {
            username: true,
            email: true,
            schoolId: true
        },
        parent: {
            firstName: true,
            lastName: true
        }
    };
    const [validInputs, setValidInputs] = useState(validInputsDefault);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const cityResponse = await getAllCity();
                const districtResponse = await getAllDistrict();
                const provinceResponse = await getAllProvince();
                const wardCommuneResponse = await getAllWardCommune();
                const issuedPlaceResponse = await getAllIssuedPlace();

                if (cityResponse && districtResponse && provinceResponse && wardCommuneResponse && issuedPlaceResponse) {
                    setCities(cityResponse);
                    setDistricts(districtResponse);
                    setProvinces(provinceResponse);
                    setWardCommunes(wardCommuneResponse);

                    const issuedPlaceNames = issuedPlaceResponse.map(place => place.name);
                    setIssuedPlaceNames(issuedPlaceNames);
                } else {
                    toast.error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to fetch data');
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (action === 'UPDATE' && dataModalStudent) {
            setStudentData({ ...dataModalStudent, gender: gender });
        }
    }, [dataModalStudent, action]);


    const CheckValidInputs = () => {
        if (action === 'UPDATE') return true;

        let check = true;
        let arr = ["firstName", "lastName", "permanentAddress", "contactAddress"];
        for (let i = 0; i < arr.length; i++) {
            if (typeof studentData[arr[i]] === 'object') {
                for (let key in studentData[arr[i]]) {
                    if (!studentData[arr[i]][key]) {
                        let _validInputs = _.cloneDeep(validInputsDefault);
                        _validInputs[arr[i]][key] = false;
                        setValidInputs(_validInputs);
                        toast.error(`Empty input ${key}`);
                        check = false;
                        break;
                    }
                }
            } else {
                if (!studentData[arr[i]]) {
                    let _validInputs = _.cloneDeep(validInputsDefault);
                    _validInputs[arr[i]] = false;
                    setValidInputs(_validInputs);
                    toast.error(`Empty input ${arr[i]}`);
                    check = false;
                    break;
                }
            }
        }
        return check;
    };



    const handleConfirmStudent = async () => {
        let check = CheckValidInputs();
        if (check) {
            let response;
            if (action === 'CREATE') {
                response = await createNewStudent(studentData);
            } else {
                response = await updateCurrentStudent(studentData);
            }

            if (response && response.ec === 0) {
                props.onHide();
                setStudentData(
                    defaultStudentData
                )
                toast.success(response.em)
            }
            if (response && response.ec !== 0) {
                toast.error(response.em);
                let _validInputs = _.cloneDeep(validInputsDefault);
                _validInputs[response.dt] = false;
                setValidInputs(_validInputs);
            }
        }
    };

    const handleCloseModalStudent = () => {
        onHide();
        setStudentData(defaultStudentData);
    };

    const handleOnChangeInput = (value, name) => {
        setStudentData({ ...studentData, [name]: value });
    };

    const handleOnChangePermanentAddress = (value, name) => {
        setStudentData({
            ...studentData,
            permanentAddress: {
                ...studentData.permanentAddress,
                [name]: value
            }
        });
    };
    const handleOnChangeContactAddress = (value, name) => {
        setStudentData({
            ...studentData,
            contactAddress: {
                ...studentData.contactAddress,
                [name]: value
            }
        });
    };
    const handleOnChangeIssuedPlace = (value, name) => {
        setStudentData({
            ...studentData,
            issuedPlace: {
                ...studentData.issuedPlace,
                name: value
            }
        });
    };

    const handleOnChangeParentInput = (value, fieldName) => {
        setStudentData({
            ...studentData,
            parent: {
                ...studentData.parent,
                [fieldName]: value
            }
        });
    };
    const handleOnChangeUserInput = (value, fieldName) => {
        setStudentData({
            ...studentData,
            user: {
                ...studentData.user,
                [fieldName]: value
            }
        });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.readAsDataURL(selectedFile);
            reader.onload = () => {
                const base64String = reader.result;
                setStudentData({
                    ...studentData,
                    avatar: base64String
                });
            };
            reader.onerror = (error) => {
                console.error('Error reading the file: ', error);
            };
        }
    };
    const handleOnChangeDateInput = (value, fieldName) => {
        const cleanedValue = value.replace(/\D/g, '');

        if (cleanedValue.length <= 2) {
            setStudentData({ ...studentData, [fieldName]: cleanedValue });
        } else if (cleanedValue.length <= 4) {
            setStudentData({ ...studentData, [fieldName]: cleanedValue.slice(0, 2) + '/' + cleanedValue.slice(2) });
        } else {
            setStudentData({ ...studentData, [fieldName]: cleanedValue.slice(0, 2) + '/' + cleanedValue.slice(2, 4) + '/' + cleanedValue.slice(4, 8) });
        }
    };


    return (
        <Modal fullscreen={true} show={show} className='modal-student' onHide={handleCloseModalStudent}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {action === 'CREATE' ? 'Tạo mới học sinh' : 'Chỉnh sửa học sinh'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='content-body row'>
                    <div className="new container px-3 mx-6">

                        <div className="left">
                            <div className='col-3' style={{ position: 'fixed' }}>
                                <img
                                    src={studentData.avatar || "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
                                    alt=""
                                    style={{ width: "200px", height: "200px", borderRadius: "50%", objectFit: "cover" }}
                                />
                                <div className="formInput" style={{ cursor: 'pointer' }}>
                                    <label htmlFor="file">
                                        Image: <DriveFolderUploadOutlinedIcon className="icon" />
                                    </label>
                                    <input
                                        type="file"
                                        id="file"
                                        onChange={handleFileChange}
                                        style={{ display: "none" }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="right">

                            <div className='col-12 form-role'>
                                <div
                                    className='row py-3'
                                    style={{ border: 'gray solid 1px', borderRadius: '10px' }}
                                >
                                    <div className='col-6'>
                                        <label>Họ(<span className='text-danger'>*</span>):</label>
                                        <input
                                            placeholder='Nguyễn Văn..'
                                            className={validInputs.firstName ? 'form-control fw-bold' : 'form-control is-invalid fw-bold'}
                                            type="text" value={studentData.firstName}
                                            onChange={(event) => handleOnChangeInput(event.target.value, "firstName")}
                                        />
                                    </div>
                                    <div className='col-6'>
                                        <label>Tên(<span className='text-danger'>*</span>):</label>
                                        <input
                                            placeholder='A...'
                                            className={validInputs.lastName ? 'form-control fw-bold' : 'form-control is-invalid fw-bold'}
                                            type="text" value={studentData.lastName}
                                            onChange={(event) => handleOnChangeInput(event.target.value, "lastName")}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='col-12 form-role'>
                                <div
                                    className='row py-3'
                                    style={{ border: 'gray solid 1px', borderRadius: '10px' }}
                                >

                                    <div className='col-3'>
                                        <label>Ngày sinh:(<span className='text-danger'>*</span>):</label>
                                        <input
                                            placeholder='dd/mm/yyyy'
                                            className={validInputs.dateOfBirth ? 'form-control fw-bold' : 'form-control is-invalid fw-bold'}
                                            type="text"
                                            pattern="\d{2}/\d{2}/\d{4}"
                                            value={studentData.dateOfBirth}
                                            onChange={(event) => handleOnChangeDateInput(event.target.value, "dateOfBirth")}
                                        />
                                    </div>
                                    <div className='col-3'>
                                        <label>Giới tính:</label>
                                        <select className='form-select fw-bold'
                                            onChange={(event) => handleOnChangeInput(event.target.value, "gender")}
                                            value={studentData.gender}
                                        >
                                            <option value='Nam' >Nam</option>
                                            <option value='Nữ'>Nữ</option>
                                            <option value='Khác'>Khác</option>
                                        </select>
                                    </div>

                                    <div className='col-3'>
                                        <label>Quốc tịch:(<span className='text-danger'>*</span>):</label>
                                        <input
                                            placeholder='Việt Nam...'
                                            className={validInputs.nationality ? 'form-control fw-bold' : 'form-control is-invalid fw-bold'}
                                            type="text" value={studentData.nationality}
                                            onChange={(event) => handleOnChangeInput(event.target.value, "nationality")}
                                        />
                                    </div>
                                    <div className='col-3'>
                                        <label>Dân tộc:(<span className='text-danger'>*</span>):</label>
                                        <input
                                            placeholder='Kinh...'
                                            className={validInputs.ethnicity ? 'form-control fw-bold' : 'form-control is-invalid fw-bold'}
                                            type="text" value={studentData.ethnicity}
                                            onChange={(event) => handleOnChangeInput(event.target.value, "ethnicity")}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='col-12 form-role'>
                                <div
                                    className='row py-3'
                                    style={{ border: 'gray solid 1px', borderRadius: '10px' }}
                                >

                                    <div className='col-3'>
                                        <label>Số CCCD/CMND:(<span className='text-danger'>*</span>):</label>
                                        <input
                                            placeholder='...'
                                            className={validInputs.citizenId ? 'form-control fw-bold' : 'form-control is-invalid fw-bold'}
                                            type="text" value={studentData.citizenId}
                                            onChange={(event) => handleOnChangeInput(event.target.value, "citizenId")}
                                        />
                                    </div>

                                    <div className='col-6'>
                                        <label>Nơi cấp:(<span className='text-danger'>*</span>):</label>
                                        <Select
                                            className='basic-single fw-bold'
                                            classNamePrefix='select'
                                            options={issuedPlaceNames && issuedPlaceNames.length > 0 ? issuedPlaceNames.map(issuedPlaceName => ({ value: issuedPlaceName, label: issuedPlaceName })) : []}
                                            value={studentData.issuedPlace && studentData.issuedPlace.name ? { value: studentData.issuedPlace.name, label: studentData.issuedPlace.name } : ''}
                                            onChange={(selectedOption) => handleOnChangeIssuedPlace(selectedOption.value, "name")}
                                            placeholder="Search Issued Place..."
                                        />
                                    </div>

                                    <div className='col-3'>
                                        <label>Ngày cấp:(<span className='text-danger'>*</span>):</label>
                                        <input
                                            placeholder='dd/mm/yyyy'
                                            className={validInputs.issuedDate ? 'form-control fw-bold' : 'form-control is-invalid fw-bold'}
                                            type="text"
                                            pattern="\d{2}/\d{2}/\d{4}"
                                            value={studentData.issuedDate}
                                            onChange={(event) => handleOnChangeDateInput(event.target.value, "issuedDate")}
                                        />
                                    </div>



                                </div>
                            </div>
                            <div className='col-12 form-role'>
                                <div className='row py-3'
                                    style={{ border: 'gray solid 1px', borderRadius: '10px' }}

                                >
                                    <label className='text-center'>Địa chỉ thường trú:</label>

                                    <div className='col-3'>
                                        <label>Thành phố(<span className='text-danger'>*</span>):</label>
                                        <Select
                                            className='basic-single fw-bold'
                                            classNamePrefix='select'
                                            options={cities && cities.length > 0 ? cities.map(city => ({ value: city, label: city })) : []}
                                            value={studentData.permanentAddress && studentData.permanentAddress.city ? { value: studentData.permanentAddress.city, label: studentData.permanentAddress.city } : null}
                                            onChange={(selectedOption) => handleOnChangePermanentAddress(selectedOption.value, "city")}
                                            placeholder="Select a city..."
                                        />

                                    </div>
                                    <div className='col-3'>
                                        <label>Tỉnh(<span className='text-danger'>*</span>):</label>
                                        <Select
                                            className='basic-single fw-bold'
                                            classNamePrefix='select'
                                            options={provinces && provinces.length > 0 ? provinces.map(province => ({ value: province, label: province })) : []}
                                            value={studentData.permanentAddress && studentData.permanentAddress.province ? { value: studentData.permanentAddress.province, label: studentData.permanentAddress.province } : null}
                                            onChange={(selectedOption) => handleOnChangePermanentAddress(selectedOption.value, "province")}
                                            placeholder="Search province..."
                                        />
                                    </div>
                                    <div className='col-3'>
                                        <label>Huyện(<span className='text-danger'>*</span>):</label>
                                        <Select
                                            className='basic-single fw-bold'
                                            classNamePrefix='select'
                                            options={districts && districts.length > 0 ? districts.map(district => ({ value: district, label: district })) : []}
                                            value={studentData.permanentAddress && studentData.permanentAddress.district ? { value: studentData.permanentAddress.district, label: studentData.permanentAddress.district } : null}
                                            onChange={(selectedOption) => handleOnChangePermanentAddress(selectedOption.value, "district")}
                                            placeholder="Search district..."
                                        />
                                    </div>
                                    <div className='col-3'>
                                        <label>Phường/Xã(<span className='text-danger'>*</span>):</label>
                                        <Select
                                            className='basic-single fw-bold'
                                            classNamePrefix='select'
                                            options={wardCommunes && wardCommunes.length > 0 ? wardCommunes.map(wardCommune => ({ value: wardCommune, label: wardCommune })) : []}
                                            value={studentData.permanentAddress && studentData.permanentAddress.wardCommune ? { value: studentData.permanentAddress.wardCommune, label: studentData.permanentAddress.wardCommune } : null}
                                            onChange={(selectedOption) => handleOnChangePermanentAddress(selectedOption.value, "wardCommune")}
                                            placeholder="Search ward/commune..."
                                        />
                                    </div>

                                    <div className='col-12'>
                                        <label>Khác:</label>
                                        <input
                                            className='form-control fw-bold'
                                            type="text"
                                            value={studentData.permanentAddress && studentData.permanentAddress.other}
                                            onChange={(event) => handleOnChangePermanentAddress(event.target.value, "other")}
                                            placeholder="Nhập tên đường, thôn, xóm..."
                                        />
                                    </div>
                                </div>

                            </div>
                            <div className='col-12 form-role'>
                                <div className='row py-3'
                                    style={{ border: 'gray solid 1px', borderRadius: '10px' }}

                                >
                                    <label className='text-center'>Địa chỉ liên lạc:</label>

                                    <div className='col-3'>
                                        <label>Thành phố(<span className='text-danger'>*</span>):</label>
                                        <Select
                                            className='basic-single fw-bold'
                                            classNamePrefix='select'
                                            options={cities && cities.length > 0 ? cities.map(city => ({ value: city, label: city })) : []}
                                            value={studentData.contactAddress && studentData.contactAddress.city ? { value: studentData.contactAddress.city, label: studentData.contactAddress.city } : null}
                                            onChange={(selectedOption) => handleOnChangeContactAddress(selectedOption.value, "city")}
                                            placeholder="Search city..."
                                        />
                                    </div>
                                    <div className='col-3'>
                                        <label>Tỉnh(<span className='text-danger'>*</span>):</label>
                                        <Select
                                            className='basic-single fw-bold'
                                            classNamePrefix='select'
                                            options={provinces && provinces.length > 0 ? provinces.map(province => ({ value: province, label: province })) : []}
                                            value={studentData.contactAddress && studentData.contactAddress.province ? { value: studentData.contactAddress.province, label: studentData.contactAddress.province } : null}
                                            onChange={(selectedOption) => handleOnChangeContactAddress(selectedOption.value, "province")}
                                            placeholder="Search province..."
                                        />
                                    </div>
                                    <div className='col-3'>
                                        <label>Huyện(<span className='text-danger'>*</span>):</label>
                                        <Select
                                            className='basic-single fw-bold'
                                            classNamePrefix='select'
                                            options={districts && districts.length > 0 ? districts.map(district => ({ value: district, label: district })) : []}
                                            value={studentData.contactAddress && studentData.contactAddress.district ? { value: studentData.contactAddress.district, label: studentData.contactAddress.district } : null}
                                            onChange={(selectedOption) => handleOnChangeContactAddress(selectedOption.value, "district")}
                                            placeholder="Search district..."
                                        />
                                    </div>
                                    <div className='col-3'>
                                        <label>Phường/Xã(<span className='text-danger'>*</span>):</label>
                                        <Select
                                            className='basic-single fw-bold'
                                            classNamePrefix='select'
                                            options={wardCommunes && wardCommunes.length > 0 ? wardCommunes.map(wardCommune => ({ value: wardCommune, label: wardCommune })) : []}
                                            value={studentData.contactAddress && studentData.contactAddress.wardCommune ? { value: studentData.contactAddress.wardCommune, label: studentData.contactAddress.wardCommune } : null}
                                            onChange={(selectedOption) => handleOnChangeContactAddress(selectedOption.value, "wardCommune")}
                                            placeholder="Search ward/commune..."
                                        />
                                    </div>

                                    <div className='col-12'>
                                        <label>Khác:</label>
                                        <input
                                            className='form-control fw-bold'
                                            type="text"
                                            value={studentData.contactAddress && studentData.contactAddress.other}
                                            onChange={(event) => handleOnChangeContactAddress(event.target.value, "other")}
                                            placeholder="Nhập tên đường, thôn, xóm..."
                                        />
                                    </div>
                                </div>

                            </div>
                            <div className='col-12 form-role'>
                                <div
                                    className='row py-3'
                                    style={{ border: 'gray solid 1px', borderRadius: '10px' }}
                                >
                                    <div className='col-6'>
                                        <label>Họ phụ huynh:(<span className='text-danger'>*</span>):</label>
                                        <input
                                            placeholder='Nguyễn Văn..'
                                            className={validInputs.parent.firstName ? 'form-control fw-bold' : 'form-control is-invalid fw-bold'}
                                            type="text" value={studentData.parent?.firstName}
                                            onChange={(event) => handleOnChangeParentInput(event.target.value, "firstName")}
                                        />
                                    </div>
                                    <div className='col-6'>
                                        <label>Tên phụ huynh:(<span className='text-danger'>*</span>):</label>
                                        <input
                                            placeholder='B..'
                                            className={validInputs.parent.lastName ? 'form-control fw-bold' : 'form-control is-invalid fw-bold'}
                                            type="text" value={studentData.parent?.lastName}
                                            onChange={(event) => handleOnChangeParentInput(event.target.value, "lastName")}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='col-12 form-role'>
                                <div
                                    className='row py-3'
                                    style={{ border: 'gray solid 1px', borderRadius: '10px' }}
                                >
                                    <div className='col-6'>
                                        <label>Username:(<span className='text-danger fst-italic'>Tự động tạo</span>)</label>
                                        <input
                                            disabled={true}
                                            placeholder='...'
                                            className={validInputs.user.username ? 'form-control fw-bold' : 'form-control is-invalid fw-bold'}
                                            type="text" value={studentData.user?.username}
                                            onChange={(event) => handleOnChangeUserInput(event.target.value, "username")}
                                        />
                                    </div>
                                    <div className='col-6'>
                                        <label>Email:(<span className='text-danger fst-italic'>Tự động tạo</span>)</label>
                                        <input
                                            disabled={true}
                                            placeholder='...'
                                            className={validInputs.user.username ? 'form-control fw-bold' : 'form-control is-invalid fw-bold'}
                                            type="text" value={studentData.user?.email}
                                            onChange={(event) => handleOnChangeUserInput(event.target.value, "email")}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModalStudent}>Đóng</Button>
                <Button variant="primary" onClick={handleConfirmStudent}>
                    {action === 'CREATE' ? 'Lưu' : 'Cập nhật'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalStudent;
