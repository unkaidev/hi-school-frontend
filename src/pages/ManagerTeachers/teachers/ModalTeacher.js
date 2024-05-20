import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { createNewTeacher, getAllGroupName, updateCurrentTeacher } from '../../../services/teacherServices';
import { getAllCity, getAllDistrict, getAllIssuedPlace, getAllProvince, getAllWardCommune } from '../../../services/addressService';
import { toast } from 'react-toastify';
import Select from 'react-select';
import _ from 'lodash';
import './modalTeacher.scss';
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";



const ModalTeacher = (props) => {
    const { action, dataModalTeacher, show, onHide, schoolId, gender } = props;
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [wardCommunes, setWardCommunes] = useState([]);
    const [issuedPlaceNames, setIssuedPlaceNames] = useState([{}]);
    const [groupNames, setGroupNames] = useState([]);

    const defaultTeacherData = {
        avatar: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'Nam',
        nationality: 'Việt Nam',
        ethnicity: 'Kinh',
        citizenId: '',
        issuedDate: '',
        firstWorkDate: '',
        group: '',
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
    }
    const [teacherData, setTeacherData] = useState(defaultTeacherData);

    const validInputsDefault = {
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        gender: true,
        nationality: true,
        ethnicity: true,
        citizenId: true,
        issuedDate: true,
        firstWorkDate: true,
        group: true,
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
                const groupNamesResponse = await getAllGroupName();


                if (cityResponse && districtResponse && provinceResponse && wardCommuneResponse && issuedPlaceResponse && groupNamesResponse) {
                    setCities(cityResponse);
                    setDistricts(districtResponse);
                    setProvinces(provinceResponse);
                    setWardCommunes(wardCommuneResponse);
                    setGroupNames(groupNamesResponse);

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
        if (action === 'UPDATE' && dataModalTeacher) {
            setTeacherData({ ...dataModalTeacher, gender: gender });
        }
    }, [dataModalTeacher, action]);


    const CheckValidInputs = () => {
        if (action === 'UPDATE') return true;

        let check = true;
        let arr = ["firstName", "lastName", "permanentAddress", "contactAddress"];
        for (let i = 0; i < arr.length; i++) {
            if (typeof teacherData[arr[i]] === 'object') {
                for (let key in teacherData[arr[i]]) {
                    if (!teacherData[arr[i]][key]) {
                        let _validInputs = _.cloneDeep(validInputsDefault);
                        _validInputs[arr[i]][key] = false;
                        setValidInputs(_validInputs);
                        toast.error(`Empty input ${key}`);
                        check = false;
                        break;
                    }
                }
            } else {
                if (!teacherData[arr[i]]) {
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



    const handleConfirmTeacher = async () => {
        let check = CheckValidInputs();
        if (check) {
            let response;
            if (action === 'CREATE') {
                response = await createNewTeacher(teacherData);
            } else {
                response = await updateCurrentTeacher(teacherData);
            }

            if (response && response.ec === 0) {
                setTeacherData(
                    defaultTeacherData
                )
                window.location.reload()
            }
            if (response && response.ec !== 0) {
                toast.error(response.em);
                let _validInputs = _.cloneDeep(validInputsDefault);
                _validInputs[response.dt] = false;
                setValidInputs(_validInputs);
            }
        }
    };

    const handleCloseModalTeacher = () => {
        onHide();
    };

    const handleOnChangeInput = (value, name) => {
        setTeacherData({ ...teacherData, [name]: value });
    };

    const handleOnChangePermanentAddress = (value, name) => {
        setTeacherData({
            ...teacherData,
            permanentAddress: {
                ...teacherData.permanentAddress,
                [name]: value
            }
        });
    };

    const handleOnChangeContactAddress = (value, name) => {
        setTeacherData({
            ...teacherData,
            contactAddress: {
                ...teacherData.contactAddress,
                [name]: value
            }
        });
    };
    const handleOnChangeIssuedPlace = (value, name) => {
        setTeacherData({
            ...teacherData,
            issuedPlace: {
                ...teacherData.issuedPlace,
                name: value
            }
        });
    };

    const handleOnChangeUserInput = (value, fieldName) => {
        setTeacherData({
            ...teacherData,
            user: {
                ...teacherData.user,
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
                setTeacherData({
                    ...teacherData,
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
            setTeacherData({ ...teacherData, [fieldName]: cleanedValue });
        } else if (cleanedValue.length <= 4) {
            setTeacherData({ ...teacherData, [fieldName]: cleanedValue.slice(0, 2) + '/' + cleanedValue.slice(2) });
        } else {
            setTeacherData({ ...teacherData, [fieldName]: cleanedValue.slice(0, 2) + '/' + cleanedValue.slice(2, 4) + '/' + cleanedValue.slice(4, 8) });
        }
    };
    const genderOptions = [
        { value: 'Nam', label: 'Nam' },
        { value: 'Nữ', label: 'Nữ' },
        { value: 'Khác', label: 'Khác' }
    ];
    return (
        <Modal fullscreen={true} show={show} className='modal-teacher' onHide={handleCloseModalTeacher}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {action === 'CREATE' ? 'Tạo mới giáo viên' : 'Chỉnh sửa giáo viên'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='content-body row'>
                    <div className="new container px-3 mx-6">

                        <div className="left">
                            <div className='col-3' style={{ position: 'fixed' }}>
                                <img
                                    src={teacherData.avatar || "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"}
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
                                            type="text" value={teacherData.firstName}
                                            onChange={(event) => handleOnChangeInput(event.target.value, "firstName")}
                                        />
                                    </div>
                                    <div className='col-6'>
                                        <label>Tên(<span className='text-danger'>*</span>):</label>
                                        <input
                                            placeholder='A...'
                                            className={validInputs.lastName ? 'form-control fw-bold' : 'form-control is-invalid fw-bold'}
                                            type="text" value={teacherData.lastName}
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
                                            value={teacherData.dateOfBirth}
                                            onChange={(event) => handleOnChangeDateInput(event.target.value, "dateOfBirth")}
                                        />
                                    </div>
                                    <div className='col-3 form-role'>
                                        <label>Giới tính:</label>
                                        <Select
                                            placeholder="Nam..."
                                            className='fw-bold'
                                            options={genderOptions}
                                            onChange={(selectedOption) => handleOnChangeInput(selectedOption.value, "gender")}
                                            value={genderOptions.find(option => option.value === teacherData.gender)}
                                        />
                                    </div>

                                    <div className='col-3'>
                                        <label>Quốc tịch:(<span className='text-danger'>*</span>):</label>
                                        <input
                                            placeholder='Việt Nam...'
                                            className={validInputs.nationality ? 'form-control fw-bold' : 'form-control is-invalid fw-bold'}
                                            type="text" value={teacherData.nationality}
                                            onChange={(event) => handleOnChangeInput(event.target.value, "nationality")}
                                        />
                                    </div>
                                    <div className='col-3'>
                                        <label>Dân tộc:(<span className='text-danger'>*</span>):</label>
                                        <input
                                            placeholder='Kinh...'
                                            className={validInputs.ethnicity ? 'form-control fw-bold' : 'form-control is-invalid fw-bold'}
                                            type="text" value={teacherData.ethnicity}
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
                                            type="text" value={teacherData.citizenId}
                                            onChange={(event) => handleOnChangeInput(event.target.value, "citizenId")}
                                        />
                                    </div>

                                    <div className='col-6'>
                                        <label>Nơi cấp:(<span className='text-danger'>*</span>):</label>
                                        <Select
                                            className='basic-single fw-bold'
                                            classNamePrefix='select'
                                            options={issuedPlaceNames && issuedPlaceNames.length > 0 ? issuedPlaceNames.map(issuedPlaceName => ({ value: issuedPlaceName, label: issuedPlaceName })) : []}
                                            value={teacherData.issuedPlace && teacherData.issuedPlace.name ? { value: teacherData.issuedPlace.name, label: teacherData.issuedPlace.name } : ''}
                                            onChange={(selectedOption) => handleOnChangeIssuedPlace(selectedOption.value, "name")}
                                            placeholder="Chọn nơi cấp..."
                                        />
                                    </div>

                                    <div className='col-3'>
                                        <label>Ngày cấp:(<span className='text-danger'>*</span>):</label>
                                        <input
                                            placeholder='dd/mm/yyyy'
                                            className={validInputs.issuedDate ? 'form-control fw-bold' : 'form-control is-invalid fw-bold'}
                                            type="text"
                                            pattern="\d{2}/\d{2}/\d{4}"
                                            value={teacherData.issuedDate}
                                            onChange={(event) => handleOnChangeDateInput(event.target.value, "issuedDate")}
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
                                        <label>Làm việc từ ngày:(<span className='text-danger'>*</span>):</label>
                                        <input
                                            placeholder='dd/mm/yyyy'
                                            className={validInputs.firstWorkDate ? 'form-control fw-bold' : 'form-control is-invalid fw-bold'}
                                            type="text"
                                            pattern="\d{2}/\d{2}/\d{4}"
                                            value={teacherData.firstWorkDate}
                                            onChange={(event) => handleOnChangeDateInput(event.target.value, "firstWorkDate")}
                                        />
                                    </div>
                                    <div className='col-6'>
                                        <label>Nhóm chuyên môn(<span className='text-danger'>*</span>):</label>
                                        <Select
                                            className='basic-single fw-bold'
                                            classNamePrefix='select'
                                            options={groupNames && groupNames.length > 0 ? groupNames.map(groupName => ({ value: groupName, label: groupName })) : []}
                                            value={teacherData.group ? { value: teacherData.group, label: teacherData.group } : null}
                                            onChange={(selectedOption) => handleOnChangeInput(selectedOption.value, "group")}
                                            placeholder="Chọn nhóm..."
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
                                            value={teacherData.permanentAddress && teacherData.permanentAddress.city ? { value: teacherData.permanentAddress.city, label: teacherData.permanentAddress.city } : null}
                                            onChange={(selectedOption) => handleOnChangePermanentAddress(selectedOption.value, "city")}
                                            placeholder="Chọn thành phố..."
                                        />

                                    </div>
                                    <div className='col-3'>
                                        <label>Tỉnh(<span className='text-danger'>*</span>):</label>
                                        <Select
                                            className='basic-single fw-bold'
                                            classNamePrefix='select'
                                            options={provinces && provinces.length > 0 ? provinces.map(province => ({ value: province, label: province })) : []}
                                            value={teacherData.permanentAddress && teacherData.permanentAddress.province ? { value: teacherData.permanentAddress.province, label: teacherData.permanentAddress.province } : null}
                                            onChange={(selectedOption) => handleOnChangePermanentAddress(selectedOption.value, "province")}
                                            placeholder="Chọn tỉnh..."
                                        />
                                    </div>
                                    <div className='col-3'>
                                        <label>Huyện(<span className='text-danger'>*</span>):</label>
                                        <Select
                                            className='basic-single fw-bold'
                                            classNamePrefix='select'
                                            options={districts && districts.length > 0 ? districts.map(district => ({ value: district, label: district })) : []}
                                            value={teacherData.permanentAddress && teacherData.permanentAddress.district ? { value: teacherData.permanentAddress.district, label: teacherData.permanentAddress.district } : null}
                                            onChange={(selectedOption) => handleOnChangePermanentAddress(selectedOption.value, "district")}
                                            placeholder="Chọn huyện..."
                                        />
                                    </div>
                                    <div className='col-3'>
                                        <label>Phường/Xã(<span className='text-danger'>*</span>):</label>
                                        <Select
                                            className='basic-single fw-bold'
                                            classNamePrefix='select'
                                            options={wardCommunes && wardCommunes.length > 0 ? wardCommunes.map(wardCommune => ({ value: wardCommune, label: wardCommune })) : []}
                                            value={teacherData.permanentAddress && teacherData.permanentAddress.wardCommune ? { value: teacherData.permanentAddress.wardCommune, label: teacherData.permanentAddress.wardCommune } : null}
                                            onChange={(selectedOption) => handleOnChangePermanentAddress(selectedOption.value, "wardCommune")}
                                            placeholder="Chọn phường/xã..."
                                        />
                                    </div>

                                    <div className='col-12'>
                                        <label>Khác:</label>
                                        <input
                                            className='form-control fw-bold'
                                            type="text"
                                            value={teacherData.permanentAddress && teacherData.permanentAddress.other}
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
                                            value={teacherData.contactAddress && teacherData.contactAddress.city ? { value: teacherData.contactAddress.city, label: teacherData.contactAddress.city } : null}
                                            onChange={(selectedOption) => handleOnChangeContactAddress(selectedOption.value, "city")}
                                            placeholder="Chọn thành phố..."
                                        />
                                    </div>
                                    <div className='col-3'>
                                        <label>Tỉnh(<span className='text-danger'>*</span>):</label>
                                        <Select
                                            className='basic-single fw-bold'
                                            classNamePrefix='select'
                                            options={provinces && provinces.length > 0 ? provinces.map(province => ({ value: province, label: province })) : []}
                                            value={teacherData.contactAddress && teacherData.contactAddress.province ? { value: teacherData.contactAddress.province, label: teacherData.contactAddress.province } : null}
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
                                            value={teacherData.contactAddress && teacherData.contactAddress.district ? { value: teacherData.contactAddress.district, label: teacherData.contactAddress.district } : null}
                                            onChange={(selectedOption) => handleOnChangeContactAddress(selectedOption.value, "district")}
                                            placeholder="Chọn huyện..."
                                        />
                                    </div>
                                    <div className='col-3'>
                                        <label>Phường/Xã(<span className='text-danger'>*</span>):</label>
                                        <Select
                                            className='basic-single fw-bold'
                                            classNamePrefix='select'
                                            options={wardCommunes && wardCommunes.length > 0 ? wardCommunes.map(wardCommune => ({ value: wardCommune, label: wardCommune })) : []}
                                            value={teacherData.contactAddress && teacherData.contactAddress.wardCommune ? { value: teacherData.contactAddress.wardCommune, label: teacherData.contactAddress.wardCommune } : null}
                                            onChange={(selectedOption) => handleOnChangeContactAddress(selectedOption.value, "wardCommune")}
                                            placeholder="Chọn phường/xã..."
                                        />
                                    </div>

                                    <div className='col-12'>
                                        <label>Khác:</label>
                                        <input
                                            className='form-control fw-bold'
                                            type="text"
                                            value={teacherData.contactAddress && teacherData.contactAddress.other}
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
                                        <label>Username:(<span className='text-danger fst-italic'>Tự động tạo</span>)</label>
                                        <input
                                            disabled={true}
                                            placeholder='...'
                                            className={validInputs.user.username ? 'form-control fw-bold' : 'form-control is-invalid fw-bold'}
                                            type="text" value={teacherData.user?.username}
                                            onChange={(event) => handleOnChangeUserInput(event.target.value, "username")}
                                        />
                                    </div>
                                    <div className='col-6'>
                                        <label>Email:(<span className='text-danger fst-italic'>Tự động tạo</span>)</label>
                                        <input
                                            disabled={true}
                                            placeholder='...'
                                            className={validInputs.user.username ? 'form-control fw-bold' : 'form-control is-invalid fw-bold'}
                                            type="text" value={teacherData.user?.email}
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
                <Button variant="secondary" onClick={handleCloseModalTeacher}>Đóng</Button>
                <Button variant="primary" onClick={handleConfirmTeacher}>
                    {action === 'CREATE' ? 'Lưu' : 'Cập nhật'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalTeacher;
