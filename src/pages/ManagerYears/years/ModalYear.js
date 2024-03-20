import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { createNewYear, updateCurrentYear } from '../../../services/yearService';
import { toast } from 'react-toastify';
import Select from 'react-select';
import _ from 'lodash';
import { useSelector } from 'react-redux';

const ModalYear = (props) => {
    const { action, dataModalYear, show, onHide, schoolId } = props;

    const defaultYearData = {
        name: '',
        schoolId: schoolId
    }

    const validInputsDefault = {
        name: true,
    };
    const [yearData, setYearData] = useState(defaultYearData);

    const [validInputs, setValidInputs] = useState(validInputsDefault);

    useEffect(() => {
        if (action === 'CREATE') {
            setYearData(prevUserData => ({
                ...prevUserData
            }));
        }
    }, [action, dataModalYear]);

    useEffect(() => {
        if (action === 'UPDATE' && dataModalYear) {
            setYearData({ ...dataModalYear, schoolId: schoolId });
        }
    }, [dataModalYear, action]);

    const CheckValidInputs = () => {
        if (action === 'UPDATE') return true;

        let check = true;
        let arr = ["name"];
        for (let i = 0; i < arr.length; i++) {
            if (!yearData[arr[i]]) {
                let _validInputs = _.cloneDeep(validInputsDefault);
                _validInputs[arr[i]] = false;
                setValidInputs(_validInputs);

                toast.error(`Empty input ${arr[i]}`);

                check = false;
                break;
            }
        }
        return check;
    };


    const handleConfirmYear = async () => {
        let check = CheckValidInputs();
        if (check) {
            let response;
            if (action === 'CREATE') {
                response = await createNewYear(yearData);
            } else {
                response = await updateCurrentYear(yearData);
            }

            if (response && response.ec === 0) {
                props.onHide();
                setYearData(
                    defaultYearData
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

    const handleCloseModalYear = () => {
        onHide();
        setYearData(defaultYearData);
    };

    const handleOnChangeInput = (value, name) => {
        setYearData({ ...yearData, [name]: value });
    };

    return (
        <Modal size="lg" show={show} className='modal-year' onHide={handleCloseModalYear}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {action === 'CREATE' ? 'Tạo mới năm học' : 'Chỉnh sửa năm học'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='content-body row'>
                    <div className='col-12 form-role'>
                        <label>Tên năm học:(<span className='text-danger'>*</span>):</label>
                        <input
                            placeholder='Năm học 20xx...'

                            className={validInputs.name ? 'form-control' : 'form-control is-invalid'}
                            type="text" value={yearData.name}
                            onChange={(event) => handleOnChangeInput(event.target.value, "name")}
                        />
                    </div>

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModalYear}>Đóng</Button>
                <Button variant="primary" onClick={handleConfirmYear}>
                    {action === 'CREATE' ? 'Lưu' : 'Cập nhật'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalYear;
