import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { createNewSchedule, updateCurrentSchedule } from '../../../services/scheduleService';
import { toast } from 'react-toastify';
import Select from 'react-select';
import _ from 'lodash';
import { getAllYearWithSchoolId } from '../../../services/yearService';
import { getAllSemesterWithSchoolId } from '../../../services/semesterService';


const ModalSchedule = (props) => {
    const { action, dataModalSchedule, show, onHide, schoolId } = props;
    const [semesters, setSemesters] = useState([]);

    const [validTimeInputs, setValidTimeInputs] = useState({
        startTime: true,
        endTime: true
    });
    const checkTimePattern = (value) => {
        const pattern = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
        return pattern.test(value);
    };
    const handleOnChangeTimeInput = (event, fieldName) => {
        let { value } = event.target;

        if (value.length <= 5 && /^\d+$/.test(value)) {
            if (value.length === 2) {
                value = value + ':';
            }
        }

        const isValid = checkTimePattern(value);

        setValidTimeInputs(prevState => ({
            ...prevState,
            [fieldName]: isValid
        }));

        setScheduleData(prevScheduleData => ({
            ...prevScheduleData,
            [fieldName]: value
        }));
    };
    const defaultSubjectData = {
        name: '',
        semester: {
            id: '',
            name: '',
        }
    }
    const CheckValidInputs = () => {
        let check = true;
        const requiredFields = ["name", "startTime", "endTime"];

        for (let i = 0; i < requiredFields.length; i++) {
            const field = requiredFields[i];
            if (!scheduleData[field]) {
                setValidInputs(prevValidInputs => ({
                    ...prevValidInputs,
                    [field]: false
                }));
                toast.error(`Empty input ${field}`);
                check = false;
                break;
            }
        }

        return check;
    };

    const handleBlurTimeInput = (event, fieldName) => {
        const { value } = event.target;
        const isValid = checkTimePattern(value);
        if (!isValid) {
            toast.error('Giờ không hợp lệ! Vui lòng nhập theo định dạng HH:mm.');
        }
        setValidTimeInputs(prevState => ({
            ...prevState,
            [fieldName]: isValid
        }));
    };


    const defaultScheduleData = {
        name: '',
        semester: {
            id: '',
            name: '',
        },
        startTime: '',
        endTime: '',
    }
    const [scheduleData, setScheduleData] = useState(defaultScheduleData);

    const validInputsDefault = {
        name: true,
        semester: {
            id: true,
            name: true,
        },
        startTime: true,
        endTime: true,
    }

    const [validInputs, setValidInputs] = useState(validInputsDefault);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const semesterResponse = await getAllSemesterWithSchoolId(schoolId);
                if (semesterResponse && semesterResponse.dt) {
                    setSemesters(semesterResponse.dt.map(semester => ({
                        id: semester.id,
                        name: `${semester.name}-${semester.schoolYear.name}`
                    })));
                }

            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to fetch data');
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (action === 'UPDATE' && dataModalSchedule) {
            setScheduleData(dataModalSchedule);
        }
    }, [dataModalSchedule, action]);

    const handleConfirmSchedule = async () => {
        let check = CheckValidInputs();
        if (check) {
            let response;
            if (action === 'CREATE') {
                response = await createNewSchedule(scheduleData);
            } else {
                response = await updateCurrentSchedule(scheduleData);
            }

            if (response && response.ec === 0) {
                props.onHide();
                setScheduleData(defaultScheduleData);
                toast.success(response.em);
            }
            if (response && response.ec !== 0) {
                toast.error(response.em);
                let _validInputs = _.cloneDeep(validInputsDefault);
                _validInputs[response.dt] = false;
                setValidInputs(_validInputs);
            }
        }
    };

    const handleCloseModalSchedule = () => {
        onHide();
        setScheduleData(defaultScheduleData);
    };

    const handleOnChangeInput = (value, name) => {
        setScheduleData(prevScheduleData => ({
            ...prevScheduleData,
            [name]: value,
        }));
    };

    const formatTime = (timeArray) => {
        if (timeArray > 0) {
            const hours = timeArray[0].toString().padStart(2, '0');
            const minutes = timeArray[1].toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        }

    };
    const handleOnChangeSemester = (selectedOption, name) => {
        setScheduleData(prevSubjectData => ({
            ...prevSubjectData,
            semester: {
                id: selectedOption.value,
                name: selectedOption.label
            }
        }));
    };

    return (
        <Modal size="lg" show={show} className='modal-schedule' onHide={handleCloseModalSchedule}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {action === 'CREATE' ? 'Tạo mới tiết học' : 'Chỉnh sửa tiết học'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='content-body row'>
                    <div className='col-12 form-role'>
                        <label>Tên tiết học:(<span className='text-danger'>*</span>):</label>
                        <input
                            placeholder='Tiết 1'
                            className={validInputs.name ? 'form-control fw-bold' : 'form-control is-invalid fw-bold'}
                            type="text"
                            value={scheduleData.name}
                            onChange={(event) => handleOnChangeInput(event.target.value, "name")}
                        />
                    </div>
                    <div className='col-6 form-role'>
                        <label>Giờ bắt đầu:(<span className='text-danger'>*</span>):</label>
                        <input
                            className={validTimeInputs.startTime ? 'form-control fw-bold' : 'form-control is-invalid fw-bold'}
                            type="text"
                            pattern="[0-9]{2}:[0-9]{2}"
                            placeholder="HH:mm"
                            value={scheduleData.startTime}
                            onChange={(event) => handleOnChangeTimeInput(event, "startTime")}
                            onBlur={(event) => handleBlurTimeInput(event, "startTime")}
                        />
                    </div>
                    <div className='col-6 form-role'>
                        <label>Giờ kết thúc:(<span className='text-danger'>*</span>):</label>
                        <input
                            className={validTimeInputs.endTime ? 'form-control fw-bold' : 'form-control is-invalid fw-bold'}
                            type="text"
                            pattern="[0-9]{2}:[0-9]{2}"
                            placeholder="HH:mm"
                            value={scheduleData.endTime}
                            onChange={(event) => handleOnChangeTimeInput(event, "endTime")}
                            onBlur={(event) => handleBlurTimeInput(event, "endTime")}
                        />
                    </div>
                    <div className='col-12 form-role'>
                        <label>Kỳ học(<span className='text-danger'>*</span>):</label>
                        <Select
                            className='basic-single fw-bold'
                            classNamePrefix='select'
                            options={semesters && semesters.length > 0 ? semesters.map(semester => ({
                                value: semester.id,
                                label: semester.name
                            })) : []}
                            value={scheduleData.semester && scheduleData.semester.id && scheduleData.semester.name ? {
                                value: scheduleData.semester.id, label: `${scheduleData.semester.name}-${scheduleData.semester.schoolYear ? scheduleData.semester.schoolYear.name : ''}`
                            } : ''}

                            onChange={(selectedOption) => handleOnChangeSemester(selectedOption, "semester")}
                            placeholder="Kỳ học..."
                        />
                    </div>

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModalSchedule}>Đóng</Button>
                <Button variant="primary" onClick={handleConfirmSchedule}>
                    {action === 'CREATE' ? 'Lưu' : 'Cập nhật'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalSchedule;
