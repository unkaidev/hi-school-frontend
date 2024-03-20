import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { createNewSchoolClass, updateCurrentSchoolClass, getAllGrade } from '../../../services/schoolClassService';
import { toast } from 'react-toastify';
import Select from 'react-select';
import _ from 'lodash';
import { getAllYearWithSchoolId } from '../../../services/yearService';
import { getAllTeacherReadyWithSchoolIdAndYearId } from '../../../services/teacherServices';

const ModalSchoolClass = (props) => {
    const { action, dataModalSchoolClass, show, onHide, schoolId } = props;
    const [gradeNames, setGradeNames] = useState([]);
    const [years, setYears] = useState([]);
    const [teachers, setTeachers] = useState([]);


    const defaultSchoolClassData = {
        name: '',
        grade: '',
        schoolYear: {
            id: '',
            name: '',
            schoolId: schoolId
        },
        teacher: {
            id: '',
            firstName: '',
            lastName: '',
        }
    }
    const [schoolClassData, setSchoolClassData] = useState(defaultSchoolClassData);

    const validInputsDefault = {
        name: true,
        grade: true,
        schoolYear: {
            name: true,
        }
    };
    const [validInputs, setValidInputs] = useState(validInputsDefault);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const yearResponse = await getAllYearWithSchoolId(schoolId);
                let gradeResponse = await getAllGrade();

                if (yearResponse && yearResponse.dt) {
                    console.log(yearResponse);
                    setYears(yearResponse.dt.map(year => ({ name: year.name, id: year.id })));
                }
                if (gradeResponse) {
                    setGradeNames(gradeResponse);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    useEffect(() => {
        if (action === 'UPDATE' && dataModalSchoolClass) {
            setSchoolClassData({
                ...dataModalSchoolClass,
                schoolYear: {
                    ...dataModalSchoolClass.schoolYear,
                    schoolId: schoolId,
                }
            });
        }
    }, [dataModalSchoolClass, action, schoolId]);


    const CheckValidInputs = () => {
        if (action === 'UPDATE') return true;

        let check = true;
        let arr = ["name"];
        for (let i = 0; i < arr.length; i++) {
            if (!schoolClassData[arr[i]]) {
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


    const handleConfirmSchoolClass = async () => {
        let check = CheckValidInputs();
        if (check) {
            let response;
            if (action === 'CREATE') {
                response = await createNewSchoolClass(schoolClassData);
            } else {
                response = await updateCurrentSchoolClass(schoolClassData);
            }

            if (response && response.ec === 0) {
                setSchoolClassData(
                    defaultSchoolClassData
                )
                toast.success(response.em)
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

    const handleCloseModalSchoolClass = () => {
        onHide();
        setSchoolClassData(defaultSchoolClassData);
    };

    const handleOnChangeInput = (value, name) => {
        setSchoolClassData({ ...schoolClassData, [name]: value });
    };

    const fetchData = async (yearId) => {
        try {
            const teacherResponse = await getAllTeacherReadyWithSchoolIdAndYearId(+schoolId, +yearId);

            if (teacherResponse && teacherResponse.dt) {
                const teachersData = teacherResponse.dt.map(teacher => ({
                    name: `${teacher?.firstName} ${teacher?.lastName}`,
                    firstName: `${teacher.firstName}`,
                    lastName: `${teacher.lastName}`,
                    id: teacher.id
                }));
                setTeachers(teachersData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleOnChangeYear = (selectedOption) => {
        const selectedYear = {
            id: selectedOption.value,
            name: selectedOption.label
        };
        setSchoolClassData(prevSchoolClassData => ({
            ...prevSchoolClassData,
            schoolYear: selectedYear
        }));
        fetchData(selectedYear.id);
    };


    const handleOnChangeTeacher = (selectedOption, field) => {
        setSchoolClassData(prevState => ({
            ...prevState,
            teacher: {
                ...prevState.teacher,
                firstName: selectedOption.firstName,
                lastName: selectedOption.lastName,
                id: selectedOption.id,
            }
        }));
    };
    return (
        <Modal size="lg" show={show} className='modal-schoolClass' onHide={handleCloseModalSchoolClass}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {action === 'CREATE' ? 'Tạo mới lớp học' : 'Chỉnh sửa lớp học'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='content-body row'>
                    <div className='col-12 form-role'>
                        <label>Tên lớp học:(<span className='text-danger'>*</span>):</label>
                        <input
                            className={validInputs.name ? 'form-control' : 'form-control is-invalid'}
                            type="text"
                            placeholder='10A1...'
                            value={schoolClassData.name}
                            onChange={(event) => handleOnChangeInput(event.target.value, "name")}
                        />
                    </div>
                    <div className='col-12 form-role'>
                        <label>Năm học(<span className='text-danger'>*</span>):</label>
                        <Select
                            className='basic-single'
                            classNamePrefix='select'
                            options={years && years.length > 0 ? years.map(year => ({ value: year.id, label: year.name })) : []}
                            value={schoolClassData.schoolYear && schoolClassData.schoolYear.id ? { value: schoolClassData.schoolYear.id, label: schoolClassData.schoolYear.name } : null}
                            onChange={(selectedOption) => handleOnChangeYear(selectedOption)}
                            placeholder="Năm học..."
                        />
                    </div>


                    <div className='col-12 form-role'>
                        <label>Khối học(<span className='text-danger'>*</span>):</label>

                        <Select
                            className='basic-single'
                            classNamePrefix='select'
                            options={gradeNames && gradeNames.length > 0 ? gradeNames.map(gradeName => ({ value: gradeName, label: gradeName })) : []}
                            value={schoolClassData.grade ? { value: schoolClassData.grade, label: schoolClassData.grade } : ''}
                            onChange={(selectedOption) => handleOnChangeInput(selectedOption.value, "grade")}
                            placeholder="Khối học..."
                        />

                    </div>
                    <div className='col-12 form-role'>
                        <label>Giáo viên chủ nhiệm(<span className='text-danger'>*</span>):</label>

                        <Select
                            className='basic-single'
                            classNamePrefix='select'
                            options={teachers && teachers.length > 0 ? teachers.map(teacher => ({ value: teacher.name, label: teacher.name, firstName: teacher.firstName, lastName: teacher.lastName, id: teacher.id })) : []}
                            value={schoolClassData.teacher ? { value: `${schoolClassData.teacher.firstName} ${schoolClassData.teacher.lastName}`, label: `${schoolClassData.teacher.firstName} ${schoolClassData.teacher.lastName}` } : null}
                            onChange={(selectedOption) => handleOnChangeTeacher(selectedOption, "teacher")}
                            placeholder="Chọn giáo viên"

                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModalSchoolClass}>Đóng</Button>
                <Button variant="primary" onClick={handleConfirmSchoolClass}>
                    {action === 'CREATE' ? 'Lưu' : 'Cập nhật'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalSchoolClass;
