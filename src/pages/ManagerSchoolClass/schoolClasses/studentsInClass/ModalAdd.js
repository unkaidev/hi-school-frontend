import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';

const ModalAdd = (props) => {
    const [confirmAddMany, setConfirmAddMany] = useState(false);

    const handleConfirmAddMany = () => {
        setConfirmAddMany(true);
        if (props.confirmAddManyStudents) {
            props.confirmAddManyStudents();
        }
    };
    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận thêm {props.title} vào lớp </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!props.dataModal.length ?
                        `Bạn chắc chắn muốn thêm ${props.title} có ID: ${props.dataModal.id} không?` :
                        `Bạn chắc chắn muốn thêm ${props.dataModal.length} ${props.title} không?`
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Đóng
                    </Button>
                    {props.confirmAdd && props.dataModal && !props.dataModal.length && (
                        <Button variant="primary" onClick={props.confirmAdd}>
                            Xác nhận
                        </Button>
                    )}
                    {props.confirmAddManyStudents && !confirmAddMany && props.dataModal && props.dataModal.length >= 2 && (
                        <Button variant="warning" onClick={handleConfirmAddMany}>
                            Xác nhận thêm nhiều
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalAdd;
