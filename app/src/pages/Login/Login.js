import React from 'react';
import {Button, Form, Container} from "react-bootstrap"

import './Login.css';


class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEmailChange(event) {
        this.setState({email: event.target.value});
    }
    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }
    handleSubmit(event) {
        alert('A mail was submitted: ' + this.state.email);
        event.preventDefault();
    }


    render() {
        return (
            <Container id="main-container" className="d-grid h-100">
                <Form id="sign-in-form" className="text-center p-3 w-100" onSubmit={this.handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={this.state.email}
                            onChange={this.handleEmailChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control
                            type="password"
                            placeholder="Enter Password"
                            value={this.state.password}
                            onChange={this.handlePasswordChange}/>
                    </Form.Group>
                    <div className="d-grid">
                        <Button as="input" type="submit" value="Sign in" variant="dark" size="lg"/>
                    </div>
                </Form>
            </Container>
        );
    }
}

export default Login;