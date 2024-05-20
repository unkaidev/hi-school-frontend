import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { createNewSubject, updateCurrentSubject, getAllName } from '../../../services/subjectService';
import { toast } from 'react-toastify';
import Select from 'react-select';
import _ from 'lodash';
import { getAllGrade } from '../../../services/schoolClassService';
import { getAllSemester, getAllSemesterWithSchoolId } from '../../../services/semesterService';

const ModalSubject = (props) => {
    const { action, dataModalSubject, show, onHide, schoolId } = props;
    const [semesters, setSemesters] = useState([]);


    const [subjectNames, setSubjectNames] = useState([]);


    const defaultSubjectData = {
        name: '',
        semester: {
            id: '',
            name: '',
        }
    }
    const [subjectData, setSubjectData] = useState(defaultSubjectData);

    const validInputsDefault = {
        name: true,
        semester: {
            id: true,
            name: true,
        }
    };
    const [validInputs, setValidInputs] = useState(validInputsDefault);
    const [gradeNames, setGradeNames] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const semesterResponse = await getAllSemesterWithSchoolId(schoolId);
                const subjectNamesResponse = await getAllName();
                const gradeResponse = await getAllGrade();

                if (gradeResponse) {
                    setGradeNames(gradeResponse);
                }
                if (semesterResponse && semesterResponse.dt && subjectNamesResponse) {
                    setSemesters(semesterResponse.dt.map(semester => ({
                        id: semester.id,
                        name: `${semester.name}-${semester.schoolYear.name}`
                    })));
                    setSubjectNames(subjectNamesResponse)
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
        if (action === 'UPDATE' && dataModalSubject) {
            setSubjectData(dataModalSubject);
        }
    }, [dataModalSubject, action]);

    const CheckValidInputs = () => {
        if (action === 'UPDATE') return true;

        let check = true;
        let arr = ["name"];
        for (let i = 0; i < arr.length; i++) {
            if (!subjectData[arr[i]]) {
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


    const handleConfirmSubject = async () => {
        let check = CheckValidInputs();
        if (check) {
            let response;
            if (action === 'CREATE') {
                response = await createNewSubject(subjectData);
            } else {
                response = await updateCurrentSubject(subjectData);
            }

            if (response && response.ec === 0) {
                props.onHide();
                setSubjectData(
                    defaultSubjectData
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

    const handleCloseModalSubject = () => {
        onHide();
        setSubjectData(defaultSubjectData);
    };


    const handleOnChangeName = (value, name) => {
        setSubjectData(prevSubjectData => ({
            ...prevSubjectData,
            [name]: value
        }));
    };

    const handleOnChangeSemester = (selectedOption, name) => {
        setSubjectData(prevSubjectData => ({
            ...prevSubjectData,
            semester: {
                id: selectedOption.value,
                name: selectedOption.label
            }
        }));
    };


    return (
        <Modal size="lg" show={show} className='modal-semester' onHide={handleCloseModalSubject}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {action === 'CREATE' ? 'Tạo mới môn học' : 'Chỉnh sửa môn học'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='content-body row'>
                    <div className='col-12 form-role'>
                        <label>Tên môn học(<span className='text-danger'>*</span>):</label>
                        <Select
                            className='basic-single fw-bold'
                            classNamePrefix='select'
                            options={subjectNames && subjectNames.length > 0 ? subjectNames.map(subjectName => ({ value: subjectName, label: subjectName })) : []}
                            value={subjectData.name ? { value: subjectData.name, label: subjectData.name } : ''}
                            onChange={(selectedOption) => handleOnChangeName(selectedOption.value, "name")}
                            placeholder="Tên môn học..."
                        />
                    </div>
                    <div className='col-12 form-role'>
                        <label>Khối học(<span className='text-danger'>*</span>):</label>

                        <Select
                            className='basic-single fw-bold'
                            classNamePrefix='select'
                            options={gradeNames && gradeNames.length > 0 ? gradeNames.map(gradeName => ({ value: gradeName, label: gradeName })) : []}
                            value={subjectData.grade ? { value: subjectData.grade, label: subjectData.grade } : ''}
                            onChange={(selectedOption) => handleOnChangeName(selectedOption.value, "grade")}
                            placeholder="Khối học..."
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
                            value={subjectData.semester && subjectData.semester.id && subjectData.semester.name ? {
                                value: subjectData.semester.id, label: `${subjectData.semester.name}-${subjectData.semester.schoolYear ? subjectData.semester.schoolYear.name : ''}`
                            } : ''}

                            onChange={(selectedOption) => handleOnChangeSemester(selectedOption, "semester")}
                            placeholder="Kỳ học..."
                        />
                    </div>



                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModalSubject}>Đóng</Button>
                <Button variant="primary" onClick={handleConfirmSubject}>
                    {action === 'CREATE' ? 'Lưu' : 'Cập nhật'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalSubject;
