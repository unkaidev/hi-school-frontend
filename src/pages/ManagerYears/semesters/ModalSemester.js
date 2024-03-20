import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { createNewSemester, updateCurrentSemester } from '../../../services/semesterService';
import { toast } from 'react-toastify';
import Select from 'react-select';
import _ from 'lodash';
import { getAllYearWithSchoolId } from '../../../services/yearService';

const ModalSemester = (props) => {
    const { action, dataModalSemester, show, onHide, schoolId } = props;
    const [yearNames, setYearNames] = useState([]);

    const defaultSemesterData = {
        name: '',
        study_period: '',
        schoolYear: {
            name: '',
            schoolId: schoolId
        },
    }
    const [semesterData, setSemesterData] = useState(defaultSemesterData);

    const validInputsDefault = {
        name: true,
        study_period: true,
        schoolYear: {
            name: true,
        }
    };
    const [validInputs, setValidInputs] = useState(validInputsDefault);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const yearResponse = await getAllYearWithSchoolId(schoolId);
                if (yearResponse && yearResponse.dt) {
                    setYearNames(yearResponse.dt.map(year => year.name));
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
        if (action === 'UPDATE' && dataModalSemester) {
            setSemesterData({ ...dataModalSemester, schoolYear: { ...dataModalSemester.schoolYear, schoolId: schoolId } });
        } else {
            setSemesterData(defaultSemesterData);
        }
    }, [dataModalSemester, action, schoolId]);


    const CheckValidInputs = () => {
        if (action === 'UPDATE') return true;

        let check = true;
        let arr = ["name"];
        for (let i = 0; i < arr.length; i++) {
            if (!semesterData[arr[i]]) {
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


    const handleConfirmSemester = async () => {
        let check = CheckValidInputs();
        if (check) {
            let response;
            if (action === 'CREATE') {
                response = await createNewSemester(semesterData);
            } else {
                response = await updateCurrentSemester(semesterData);
            }

            if (response && response.ec === 0) {
                props.onHide();
                setSemesterData(
                    defaultSemesterData
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

    const handleCloseModalSemester = () => {
        onHide();
        setSemesterData(defaultSemesterData);
    };

    const handleOnChangeInput = (value, name) => {
        setSemesterData({ ...semesterData, [name]: value });
    };
    const handleOnChangeYear = (value, name) => {
        setSemesterData(prevSemesterData => ({
            ...prevSemesterData,
            schoolYear: {
                ...prevSemesterData.schoolYear,
                [name]: value
            }
        }));
    };
    const handleOnChangeStartDate = (value) => {
        let formattedValue = value.replace(/\D/g, '');
        if (formattedValue.length <= 2) {
            formattedValue += '/';
        } else if (formattedValue.length <= 4) {
            formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2) + '/';
        } else {
            formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4) + '/' + formattedValue.slice(4, 8);
        }
        setSemesterData({ ...semesterData, start_date: formattedValue, study_period: `${formattedValue} - ${semesterData.end_date || '--/--/----'}` });
    };

    const handleOnChangeEndDate = (value) => {
        let formattedValue = value.replace(/\D/g, '');
        if (formattedValue.length <= 2) {
            formattedValue += '/';
        } else if (formattedValue.length <= 4) {
            formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2) + '/';
        } else {
            formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4) + '/' + formattedValue.slice(4, 8);
        }
        setSemesterData({ ...semesterData, end_date: formattedValue, study_period: `${semesterData.start_date || '--/--/----'} - ${formattedValue}` });
    };

    return (
        <Modal size="lg" show={show} className='modal-semester' onHide={handleCloseModalSemester}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {action === 'CREATE' ? 'Tạo mới kỳ học' : 'Chỉnh sửa kỳ học'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='content-body row'>
                    <div className='col-12 form-role'>
                        <label>Tên kỳ học:(<span className='text-danger'>*</span>):</label>
                        <input
                            className={validInputs.name ? 'form-control' : 'form-control is-invalid'}
                            type="text"
                            placeholder='Kỳ học I'
                            value={semesterData.name}
                            onChange={(event) => handleOnChangeInput(event.target.value, "name")}
                        />
                    </div>

                    <div className='col-12 form-role'>
                        <label>Thời gian học:(<span className='text-danger'>*</span>):</label>
                        <div className="d-flex">
                            <input
                                placeholder='Ngày bắt đầu: dd/mm/yyyy'
                                className='form-control mr-2'
                                type="text"
                                value={semesterData.start_date}
                                onChange={(event) => handleOnChangeStartDate(event.target.value)}
                            />

                            <input
                                placeholder='Ngày kết thúc: dd/mm/yyyy'
                                className='form-control mr-2'
                                type="text"
                                value={semesterData.end_date}
                                onChange={(event) => handleOnChangeEndDate(event.target.value)}
                            />
                        </div>
                        <input
                            className="form-control mt-2"
                            type="text"
                            value={semesterData.study_period}
                            readOnly
                        />
                    </div>

                    <div className='col-12 form-role'>
                        <label>Năm học(<span className='text-danger'>*</span>):</label>

                        <Select
                            className='basic-single'
                            classNamePrefix='select'
                            options={yearNames && yearNames.length > 0 ? yearNames.map(yearName => ({ value: yearName, label: yearName })) : []}
                            value={semesterData.schoolYear && semesterData.schoolYear.name ? { value: semesterData.schoolYear.name, label: semesterData.schoolYear.name } : ''}
                            onChange={(selectedOption) => handleOnChangeYear(selectedOption.value, "name")}
                            placeholder="Năm học..."
                        />

                    </div>

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModalSemester}>Đóng</Button>
                <Button variant="primary" onClick={handleConfirmSemester}>
                    {action === 'CREATE' ? 'Lưu' : 'Cập nhật'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalSemester;
