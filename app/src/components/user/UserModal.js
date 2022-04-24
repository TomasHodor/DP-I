import React from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import nodejs_connection from "../../nodejsInstance";

class UserModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: true,
            user_id: this.props.user.user_id,
            email: this.props.user.email,
            name: this.props.user.name,
            surname: this.props.user.surname,
            phone: this.props.user.phone,
        };
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();

        fetch(nodejs_connection + '/user/user_id=' + this.state.user_id, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: this.state.email,
                name: this.state.name,
                surname: this.state.surname,
                phone: this.state.phone
            })
        })
            .then(response => response.json().then(data => {
                console.log(data)
                this.handleClose();
            }))
    }
    handleClose() {
        this.setState({ show: false });
        this.props.modalHandler();
    }

    render() {
        return (
            <Modal show={this.state.show} onHide={this.handleClose}>
                <Form id="sign-in-form" className="text-center p-3 w-100" onSubmit={this.handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={this.state.email}
                            onChange={(e) =>  this.setState({email: e.target.value})}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Control
                            type="text"
                            placeholder="Enter name"
                            value={this.state.name}
                            onChange={(e) =>  this.setState({name: e.target.value})}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicSurname">
                        <Form.Control
                            type="text"
                            placeholder="Enter surname"
                            value={this.state.surname}
                            onChange={(e) =>  this.setState({surname: e.target.value})}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPhone">
                        <Form.Control
                            type="text"
                            placeholder="Enter phone"
                            value={this.state.phone}
                            onChange={(e) =>  this.setState({phone: e.target.value})}
                        />
                    </Form.Group>
                    <br/>
                </Form>
                <Modal.Footer>
                    <Button variant="primary" onClick={this.handleSubmit}>
                        Save
                    </Button>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default UserModal;