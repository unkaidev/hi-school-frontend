import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { updateCurrentScore, } from '../../../../services/scoreService';
import { toast } from 'react-toastify';
import Select from 'react-select';
import _ from 'lodash';


const ModalScore = (props) => {
    const { action, dataModalScore, show, onHide, schoolId } = props;

    const defaultScoreData = {
        dailyScore: '',
        midtermScore: '',
        finalScore: '',
        subjectEvaluation: '',
    }
    const [scoreData, setScoreData] = useState(defaultScoreData);

    const validInputsDefault = {
        dailyScore: true,
        midtermScore: true,
        finalScore: true,
        subjectEvaluation: true,
    };
    const [validInputs, setValidInputs] = useState(validInputsDefault);

    useEffect(() => {
        if (action === 'UPDATE' && dataModalScore) {
            setScoreData(dataModalScore);
        }
    }, [dataModalScore, action, schoolId]);


    const CheckValidInputs = () => {
        if (action === 'UPDATE') return true;

        let check = true;
        let arr = ["name"];
        for (let i = 0; i < arr.length; i++) {
            if (!scoreData[arr[i]]) {
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


    const handleConfirmScore = async () => {
        let check = CheckValidInputs();
        if (check) {
            let response;
            response = await updateCurrentScore(scoreData);
            if (response && response.ec === 0) {
                props.onHide();
                setScoreData(
                    defaultScoreData
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

    const handleCloseModalScore = () => {
        onHide();
        setScoreData(defaultScoreData);
    };

    const handleOnChangeInput = (value, name) => {
        setScoreData({ ...scoreData, [name]: value });
    };

    return (
        <Modal size="lg" show={show} className='modal-score' onHide={handleCloseModalScore}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {action === 'CREATE' ? 'Tạo mới điểm số' : 'Chỉnh sửa điểm số'}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='content-body row'>
                    <div className='col-12 form-role'>
                        <label>Tên môn học:(<span className='text-danger'>*</span>):</label>
                        <input
                            className='form-control'
                            type="text"
                            value={scoreData.subject?.name}
                            readOnly
                        />
                    </div>
                    <div className='col-4 form-role'>
                        <label>Điểm chuyên cần(<span className='text-danger'>*</span>):</label>
                        <input
                            className={validInputs.dailyScore ? 'form-control' : 'form-control is-invalid'}
                            type="number"
                            step="0.1"
                            placeholder='x.x'
                            value={scoreData.dailyScore}
                            onChange={(event) => handleOnChangeInput(event.target.value, "dailyScore")}
                        />
                    </div>
                    <div className='col-4 form-role'>
                        <label>Điểm giữa kỳ(<span className='text-danger'>*</span>):</label>
                        <input
                            className={validInputs.midtermScore ? 'form-control' : 'form-control is-invalid'}
                            type="number"
                            step="0.1"
                            placeholder='x.x'
                            value={scoreData.midtermScore}
                            onChange={(event) => handleOnChangeInput(event.target.value, "midtermScore")}
                        />
                    </div>
                    <div className='col-4 form-role'>
                        <label>Điểm cuối kỳ(<span className='text-danger'>*</span>):</label>
                        <input
                            className={validInputs.finalScore ? 'form-control' : 'form-control is-invalid'}
                            type="number"
                            step="0.1"
                            placeholder='x.x'
                            value={scoreData.finalScore}
                            onChange={(event) => handleOnChangeInput(event.target.value, "finalScore")}
                        />
                    </div>
                    <div className='col-12 form-role'>
                        <label>Đánh giá môn(<span className='text-danger'>*</span>):</label>
                        <input
                            className={validInputs.subjectEvaluation ? 'form-control' : 'form-control is-invalid'}
                            type="text"
                            placeholder='Nhập đánh giá...'
                            value={scoreData.subjectEvaluation}
                            onChange={(event) => handleOnChangeInput(event.target.value, "subjectEvaluation")}
                        />
                    </div>

                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModalScore}>Đóng</Button>
                <Button variant="primary" onClick={handleConfirmScore}>
                    {action === 'CREATE' ? 'Lưu' : 'Cập nhật'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalScore;
