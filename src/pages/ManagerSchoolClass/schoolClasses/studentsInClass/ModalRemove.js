import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';

const ModalRemove = (props) => {
    const [confirmRemoveMany, setConfirmRemoveMany] = useState(false);

    const handleConfirmRemoveMany = () => {
        setConfirmRemoveMany(true);
        if (props.confirmRemoveManyStudents) {
            props.confirmRemoveManyStudents();
        }
    };

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa khỏi lớp {props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!props.dataModal.length ?
                        `Bạn chắc chắn muốn xóa ${props.title} có ID: ${props.dataModal.id} không?` :
                        `Bạn chắc chắn muốn xóa ${props.dataModal.length} ${props.title} không?`
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Đóng
                    </Button>
                    {props.confirmRemove && props.dataModal && !props.dataModal.length && (
                        <Button variant="primary" onClick={props.confirmRemove}>
                            Xác nhận
                        </Button>
                    )}
                    {props.confirmRemoveManyStudents && !confirmRemoveMany && props.dataModal && props.dataModal.length >= 2 && (
                        <Button variant="warning" onClick={handleConfirmRemoveMany}>
                            Xác nhận xóa nhiều
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalRemove;
