import React from 'react';
import {Modal, Spinner} from "react-bootstrap";

class LoadingModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: true,
        };
    }

    render() {
        return (
            <Modal centered show={this.state.show} backdrop="static" style={{backgroundColor: 'rgba(45,45,49,0.42)'}}>
                <Modal.Body className="text-center">
                    <Spinner animation="grow" size="xxxl" variant="dark" >
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <br/>
                    <span>Loading</span>
                </Modal.Body>
            </Modal>
        );
    }
}

export default LoadingModal;