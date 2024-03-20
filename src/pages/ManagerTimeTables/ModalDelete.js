import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';

const ModalDelete = (props) => {
    const [confirmDeleteMany, setConfirmDeleteMany] = useState(false);

    const handleConfirmDeleteMany = () => {
        setConfirmDeleteMany(true);
        if (props.confirmDeleteManyTimeTables) {
            props.confirmDeleteManyTimeTables();
        }
    };

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa {props.title}</Modal.Title>
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
                    {props.confirmDelete && props.dataModal && !props.dataModal.length && (
                        <Button variant="primary" onClick={props.confirmDelete}>
                            Xác nhận
                        </Button>
                    )}
                    {props.confirmDeleteManyTimeTables && !confirmDeleteMany && props.dataModal && props.dataModal.length >= 2 && (
                        <Button variant="warning" onClick={handleConfirmDeleteMany}>
                            Xác nhận xóa nhiều
                        </Button>
                    )}
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalDelete;
