import React from 'react';
import {Button, Form, Container} from "react-bootstrap"

class Registration extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            password2: '',
        };

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePassword2Change = this.handlePassword2Change.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }
    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }
    handlePassword2Change(event) {
        this.setState({password2: event.target.value});
    }
    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.email);
        event.preventDefault();
    }

    render() {
        return (
            <Container id="main-container" className="d-grid h-100">
                Registration form
                <Form id="sign-in-form" className="text-center p-3 w-100" onSubmit={this.handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control type="email" placeholder="Enter email" value={this.state.email} onChange={this.handleEmailChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control type="password" placeholder="Enter password" value={this.state.password} onChange={this.handlePasswordChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control type="password" label="Retype password" value={this.state.password2} onChange={this.handlePassword2Change}/>
                    </Form.Group>
                    <Form.Group className="d-flex justify-content-center mb-4" controlId="creator">
                        <Form.Check label="Creator" />
                    </Form.Group>
                    <Button variant="dark" type="submit">
                        Register
                    </Button>
                </Form>
            </Container>
        );
    }
}
export default Registration;