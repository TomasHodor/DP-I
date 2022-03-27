import React from 'react';
import {Button, Modal} from "react-bootstrap";

class ConfirmModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: true,
        };
    }

    handleConfirm() {
        this.setState({ show: false });
        this.props.confirm();
    }

    handleCancel() {
        this.setState({ show: false });
        this.props.cancel();
    }

    render() {
        return (
            <Modal centered show={this.state.show} backdrop="static" style={{backgroundColor: 'rgba(45,45,49,0.42)'}}>
                <Modal.Header>
                    <Modal.Title> {this.props.text} </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <Button variant="outline-dark" className="me-3" onClick={this.handleConfirm.bind(this)}>
                        Confirm
                    </Button>
                    <Button variant="dark" className="ms-3" onClick={this.handleCancel.bind(this)}>
                        Cancel
                    </Button>
                </Modal.Body>
            </Modal>
        );
    }
}

export default ConfirmModal;