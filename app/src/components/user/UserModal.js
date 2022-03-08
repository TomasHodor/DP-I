import React from 'react';
import {Button, Form, Modal} from "react-bootstrap";
import bcrypt from 'bcryptjs'

class UserModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: true,
            email: this.props.user.email,
            password: '',
            password2: '',
            name: this.props.user.name,
            surname: this.props.user.surname,
            phone: this.props.user.phone,
        };
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();

        fetch('http://localhost:5000/user', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({

            })
        })
            .then(response => response.json().then(data => {

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
                            placeholder="Enter Name"
                            value={this.state.name}
                            onChange={(e) =>  this.setState({name: e.target.value})}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicSurname">
                        <Form.Control
                            type="text"
                            placeholder="Enter Surname"
                            value={this.state.surname}
                            onChange={(e) =>  this.setState({surname: e.target.value})}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPhone">
                        <Form.Control
                            type="text"
                            placeholder="Enter Phone"
                            value={this.state.phone}
                            onChange={(e) =>  this.setState({phone: e.target.value})}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            value={this.state.password}
                            onChange={(e) =>  this.setState({password: e.target.value})}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword2">
                        <Form.Control
                            type="password"
                            placeholder="Retype password"
                            value={this.state.password2}
                            onChange={(e) =>  this.setState({password2: e.target.value})}/>
                    </Form.Group>
                    <br/>
                </Form>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
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