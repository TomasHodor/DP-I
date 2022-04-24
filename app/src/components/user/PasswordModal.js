import React from 'react';
import bcrypt from 'bcryptjs'
import {Alert, Button, Form, Modal} from "react-bootstrap";
import nodejs_connection from "../../nodejsInstance";

class PasswordModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            error: '',
            show: true,
            old_password: '',
            password: '',
            password2: '',
        };
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (this.state.password === '') {
            this.setState({error: "Password is empty"});
            return;
        }

        if (this.state.old_password === '') {
            this.setState({error: "Old password is empty"});
            return;
        }

        if (this.state.password !== this.state.password2) {
            this.setState({error: "Passwords are not same"});
            return;
        }

        const success = await bcrypt.compare(this.state.old_password, this.props.user.password);
        if (success) {
            const hashedPassword = await bcrypt.hash(this.state.password, 10)
            fetch(nodejs_connection + '/password/user_id=' + this.props.user.user_id, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    password: hashedPassword
                })
            })
                .then(response => response.json().then(data => {
                    this.handleClose();
                }))
        } else {
            this.setState({error: "Old password is wrong"});
        }


    }
    handleClose() {
        this.setState({ show: false });
        this.props.modalHandler();
    }

    render() {
        return (
            <Modal show={this.state.show} onHide={this.handleClose}>
                <Form id="sign-in-form" className="text-center p-3 w-100" onSubmit={this.handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicOldPassword">
                        <Form.Control
                            type="password"
                            placeholder="Enter old password"
                            value={this.state.old_password}
                            onChange={(e) =>  this.setState({old_password: e.target.value})}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control
                            type="password"
                            placeholder="Enter new password"
                            value={this.state.password}
                            onChange={(e) =>  this.setState({password: e.target.value})}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword2">
                        <Form.Control
                            type="password"
                            placeholder="Confirm new password"
                            value={this.state.password2}
                            onChange={(e) =>  this.setState({password2: e.target.value})}/>
                    </Form.Group>
                    <br/>
                    {this.state.error !== '' ? <Alert variant='danger'>
                        {this.state.error}
                    </Alert> : null}
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

export default PasswordModal;