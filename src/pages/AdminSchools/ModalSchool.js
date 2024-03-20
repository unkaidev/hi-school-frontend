import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { createNewSchool, updateCurrentSchool } from '../../services/schoolServices';
import { getAllCity, getAllDistrict, getAllProvince, getAllWardCommune } from '../../services/addressService';
import { toast } from 'react-toastify';
import Select from 'react-select';
import _ from 'lodash';

const ModalSchool = (props) => {
    const { action, dataModalSchool, show, onHide } = props;

    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [wardCommunes, setWardCommunes] = useState([]);
    const defaultSchoolData = {
        name: '',
        address: {
            city: '',
            province: '',
            district: '',
            wardCommune: '',
            other: '',
        }
    }
    const [schoolData, setSchoolData] = useState(defaultSchoolData);

    const validInputsDefault = {
        name: true,
        address: {
            city: true,
            district: true,
            province: true,
            wardCommune: true
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

                if (cityResponse && districtResponse && provinceResponse && wardCommuneResponse) {
                    setCities(cityResponse);
                    setDistricts(districtResponse);
                    setProvinces(provinceResponse);
                    setWardCommunes(wardCommuneResponse);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);



    useEffect(() => {
        if (action === 'UPDATE' && dataModalSchool) {
            setSchoolData(dataModalSchool);
        }
    }, [dataModalSchool, action]);

    const CheckValidInputs = () => {
        if (action === 'UPDATE') return true;

        let check = true;
        let arr = ["name", "address"];
        for (let i = 0; i < arr.length; i++) {
            if (!schoolData[arr[i]]) {
                let _validInputs = _.cloneDeep(validInputsDefault);
                if (arr[i] === "address") {
                    for (let key in _validInputs.address) {
                        _validInputs.address[key] = false;
                    }
                } else {
                    _validInputs[arr[i]] = false;
                }

                setValidInputs(_validInputs);
                toast.error(`Empty input ${arr[i]}`);
                check = false;
                break;
            }
        }
        return check;
    };


    const handleConfirmSchool = async () => {
        let check = CheckValidInputs();
        if (check) {
            let response;
            if (action === 'CREATE') {
                response = await createNewSchool(schoolData);
            } else {
                response = await updateCurrentSchool(schoolData);
            }

            if (response && response.ec === 0) {
                props.onHide();
                setSchoolData(
                    defaultSchoolData
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

    const handleCloseModalSchool = () => {
        onHide();
        setSchoolData(defaultSchoolData);
    };

    const handleOnChangeInput = (value, name) => {
        setSchoolData({ ...schoolData, [name]: value });
    };

    const handleOnChangeAddress = (value, name) => {
        setSchoolData({
            ...schoolData,
            address: {
                ...schoolData.address,
                [name]: value
            }
        });
    };

    return (
        <Modal size="lg" show={show} className='modal-school' onHide={handleCloseModalSchool}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {action === 'CREATE' ? 'Tạo mới trường học' : 'Chỉnh sửa trường học'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='content-body row'>
                    <div className='col-12 form-role'>
                        <label>Tên trường học(<span className='text-danger'>*</span>):</label>
                        <input
                            placeholder='THPT X...'
                            className={validInputs.name ? 'form-control fw-bold' : 'form-control is-invalid fw-bold'}
                            type="text" value={schoolData.name}
                            onChange={(event) => handleOnChangeInput(event.target.value, "name")}
                        />
                    </div>
                    <div className='col-6 form-role'>
                        <label>Thành phố(<span className='text-danger'>*</span>):</label>
                        <Select
                            className='basic-single fw-bold'
                            classNamePrefix='select'
                            options={cities && cities.length > 0 ? cities.map(city => ({ value: city, label: city })) : []}
                            value={schoolData.address && schoolData.address.city ? { value: schoolData.address.city, label: schoolData.address.city } : null}
                            onChange={(selectedOption) => handleOnChangeAddress(selectedOption.value, "city")}
                            placeholder="Tên thành phố..."
                        />
                    </div>
                    <div className='col-6 form-role'>
                        <label>Tỉnh(<span className='text-danger'>*</span>):</label>
                        <Select
                            className='basic-single fw-bold'
                            classNamePrefix='select'
                            options={provinces && provinces.length > 0 ? provinces.map(province => ({ value: province, label: province })) : []}
                            value={schoolData.address && schoolData.address.province ? { value: schoolData.address.province, label: schoolData.address.province } : null}
                            onChange={(selectedOption) => handleOnChangeAddress(selectedOption.value, "province")}
                            placeholder="Tên tỉnh..."
                        />
                    </div>
                    <div className='col-6 form-role'>
                        <label>Huyện(<span className='text-danger'>*</span>):</label>
                        <Select
                            className='basic-single fw-bold'
                            classNamePrefix='select'
                            options={districts && districts.length > 0 ? districts.map(district => ({ value: district, label: district })) : []}
                            value={schoolData.address && schoolData.address.district ? { value: schoolData.address.district, label: schoolData.address.district } : null}
                            onChange={(selectedOption) => handleOnChangeAddress(selectedOption.value, "district")}
                            placeholder="Tên huyện..."
                        />
                    </div>
                    <div className='col-6 form-role'>
                        <label>Phường/Xã(<span className='text-danger'>*</span>):</label>
                        <Select
                            className='basic-single fw-bold'
                            classNamePrefix='select'
                            options={wardCommunes && wardCommunes.length > 0 ? wardCommunes.map(wardCommune => ({ value: wardCommune, label: wardCommune })) : []}
                            value={schoolData.address && schoolData.address.wardCommune ? { value: schoolData.address.wardCommune, label: schoolData.address.wardCommune } : null}
                            onChange={(selectedOption) => handleOnChangeAddress(selectedOption.value, "wardCommune")}
                            placeholder="Tên phường/xã..."
                        />
                    </div>

                    <div className='col-12 form-role'>
                        <label>Khác:</label>
                        <input
                            className='form-control fw-bold'
                            type="text"
                            value={schoolData.address && schoolData.address.other}
                            onChange={(event) => handleOnChangeAddress(event.target.value, "other")}
                            placeholder="Nhập tên đường, thôn, xóm..."
                        />
                    </div>


                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModalSchool}>Đóng</Button>
                <Button variant="primary" onClick={handleConfirmSchool}>
                    {action === 'CREATE' ? 'Lưu' : 'Cập nhật'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalSchool;
