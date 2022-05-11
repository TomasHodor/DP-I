import React from 'react';
import {Button, Form, Container, Alert} from "react-bootstrap"
import bcrypt from 'bcryptjs'
import {Navigate} from "react-router-dom";
import './Login.css';
import nodejs_connection from "../../nodejsInstance";

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            userId: null,
            error: null
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        if (this.state.email === '') {
            this.setState({error: "Email is empty"});
            return;
        }
        if (this.state.password === "") {
            this.setState({error: "Empty Password"});
            return;
        }
        console.log(nodejs_connection + '/user/email=' + this.state.email)
        fetch(nodejs_connection + '/user/email=' + this.state.email, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(response => response.json().then(async data => {
            if (data.length) {
                const success = await bcrypt.compare(this.state.password, data[0].password);
                if (success) {
                    this.setState({
                        user_id: data[0].user_id, error: null
                    });
                    let user = {"user_id": data[0].user_id, "email": this.state.email}
                    localStorage.setItem("CrowdfundingUser", JSON.stringify(user));
                    this.props.handleLogin(user);
                } else {
                    this.setState({
                        error: "Wrong Password"
                    });
                }
            } else {
                this.setState({
                    error: "Not existing User"
                });
            }
        }))
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
                            onChange={(e) =>  this.setState({email: e.target.value})}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control
                            type="password"
                            placeholder="Enter Password"
                            value={this.state.password}
                            onChange={(e) =>  this.setState({password: e.target.value})}/>
                    </Form.Group>
                    <div className="d-grid">
                        <Button as="input" type="submit" value="Sign in" variant="dark" size="lg"/>
                    </div>
                    <br/>
                    {this.state.error ? <Alert variant='danger'>{this.state.error}</Alert> : null}
                    {this.state.user_id ? <Navigate to="/campaigns" replace /> : null}
                </Form>
            </Container>
        );
    }
}

export default Login;