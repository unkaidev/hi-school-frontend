import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { updateCurrentTranscript } from '../../../services/transcriptService';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { getAllGrade, getASchoolClass, getAllSchoolClassWithYearId } from '../../../services/schoolClassService';

const ModalTranscript = (props) => {
    const { action, dataModalTranscript, show, onHide, schoolId, selectedYearLabel, selectedTermLabel, selectedTeacher, classId } = props;

    const defaultTranscriptData = {
        yearEvaluation: '',
    }
    const [transcriptData, setTranscriptData] = useState(defaultTranscriptData);

    const [sClass, setSClass] = useState({});

    useEffect(() => {
        if (classId) {
            const fetchData = async () => {
                try {
                    await fetchClassData(classId);
                } catch (error) {
                    console.error('Error fetching data:', error);
                    toast.error('Failed to fetch data');
                }
            };

            fetchData();
        }

    }, [action, classId]);

    const fetchClassData = async (classId) => {
        try {
            const classResponse = await getASchoolClass(classId);
            if (classResponse && classResponse.dt) {
                const classData = {
                    name: classResponse.dt.name,
                    id: classResponse.dt.id
                };
                setSClass(classData);
                setTranscriptData(prevState => ({
                    ...prevState,
                    schoolClass: {
                        name: classResponse.dt.name,
                        id: classResponse.dt.id
                    }
                }));
            }
        } catch (error) {
            console.error('Error fetching class data:', error);
            toast.error('Failed to fetch class data');
        }
    };

    useEffect(() => {
        if (action === 'UPDATE' && dataModalTranscript) {
            setTranscriptData(dataModalTranscript);
        }
    }, [dataModalTranscript, action]);

    const handleConfirmTranscript = async () => {
        let response;
        response = await updateCurrentTranscript(transcriptData);

        if (response && response.ec === 0) {
            props.onHide();
            setTranscriptData({
                ...defaultTranscriptData,
                schoolClass: {
                    id: schoolId
                }
            });
            toast.success(response.em)
        }
        if (response && response.ec !== 0) {
            toast.error(response.em);
        }
    };

    const handleCloseModalTranscript = () => {
        onHide();
        setTranscriptData({
            ...defaultTranscriptData,
            schoolClass: {
                id: schoolId
            }
        });
    };


    const handleOnChangeInput = (value, fieldName) => {
        setTranscriptData(prevState => ({
            ...prevState,
            [fieldName]: value
        }));
    };

    return (
        <Modal size="lg" show={show} className='modal-transcript' onHide={handleCloseModalTranscript}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {action === 'CREATE' ? 'Tạo mới đánh giá' : 'Chỉnh sửa đánh giá'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='content-body row'>

                    <div className='col-12 form-role'>
                        <div className='row py-3'>


                            <div className='col-4 form-role'>
                                <label>Lớp học(<span className='text-danger'>*</span>):</label>
                                {sClass && (
                                    <div>
                                        <input
                                            className='form-control'
                                            type="text" value={sClass.name} readOnly />
                                    </div>
                                )}
                            </div>
                            <div className='col-4 form-role'>
                                <label>Kỳ học(<span className='text-danger'>*</span>):</label>
                                {selectedTermLabel && (
                                    <div>
                                        <input
                                            className='form-control'
                                            type="text" value={selectedTermLabel} readOnly />
                                    </div>
                                )}
                            </div>
                            <div className='col-4 form-role'>
                                <label>Năm học(<span className='text-danger'>*</span>):</label>
                                {selectedYearLabel && (
                                    <div>
                                        <input
                                            className='form-control'
                                            type="text" value={selectedYearLabel} readOnly />
                                    </div>
                                )}
                            </div>
                            <div className='col-12 form-role'>
                                <label>Tên học sinh(<span className='text-danger'>*</span>):</label>
                                {transcriptData && transcriptData.student && (
                                    <div>
                                        <input
                                            className='form-control'
                                            type="text"
                                            value={`${transcriptData.student.firstName} ${transcriptData.student.lastName}`}
                                            readOnly />
                                    </div>
                                )}
                            </div>
                            <div className='col-12 form-role'>
                                <label>Tên giáo viên chủ nhiệm(<span className='text-danger'>*</span>):</label>
                                {selectedTeacher && selectedTeacher && (
                                    <div>
                                        <input
                                            className='form-control'
                                            type="text"
                                            value={`${selectedTeacher.firstName} ${selectedTeacher.lastName}`}
                                            readOnly />
                                    </div>
                                )}
                            </div>
                            <div className='col-12 form-role'>
                                <label>Đánh giá năm học:</label>
                                <input
                                    className='form-control'
                                    type="text"
                                    value={transcriptData.yearEvaluation}
                                    onChange={(event) => handleOnChangeInput(event.target.value, "yearEvaluation")}
                                    placeholder="Nhập đánh giá.."
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModalTranscript}>Đóng</Button>
                <Button variant="primary" onClick={handleConfirmTranscript}>
                    {action === 'CREATE' ? 'Lưu' : 'Cập nhật'}
                </Button>
            </Modal.Footer>
        </Modal >
    );
};

export default ModalTranscript;
