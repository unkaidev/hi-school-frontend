import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
const ModalDelete = (props) => {

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} centered >
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa {props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn chắc chắn muốn xóa {props.title}: {props.dataModal.name} không?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={props.confirmDelete}>
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
export default ModalDelete;