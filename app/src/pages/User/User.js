import React from 'react';
import {Button, Container} from "react-bootstrap"
import UserModal from "../../components/user/UserModal";
import nodejs_connection from "../../nodejsInstance";
import PasswordModal from "../../components/user/PasswordModal";

class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user_id: null,
            name: null,
            surname: null,
            email: null,
            phone: null,
            password: null,
            userModal: false,
            passwordModal: false
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.user !== prevProps.user && this.props.user === null) {
            this.setState({ user_id: null });
        }
    }

    reloadData() {
        let user_id = this.props.user.user_id;
        fetch(nodejs_connection + '/user/user_id=' + user_id, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        }).then(response => response.json().then(data => {
            this.setState({
                user_id: user_id,
                name: data[0].name,
                surname: data[0].surname,
                email: data[0].email,
                phone: data[0].phone,
                password: data[0].password
            })
        }));
    }

    handleUserModal() {
        if (this.state.user_id) {
            if (this.state.userModal)
                this.reloadData()
            this.setState({userModal: !this.state.userModal});
        }

    }

    handlePasswordModal() {
        if (this.state.user_id)
            this.setState({ passwordModal: !this.state.passwordModal });
    }

    componentDidMount() {
        let user = this.props.user;
        if (user) {
            this.reloadData();
        }
    }

    render() {
        const userModal = this.state.userModal ? (
            <UserModal modalHandler={this.handleUserModal.bind(this)} show={this.state.userModal} user={this.state}/>
        ) : null;
        const passwordModal = this.state.passwordModal ? (
            <PasswordModal modalHandler={this.handlePasswordModal.bind(this)} show={this.state.passwordModal} user={this.state}/>
        ) : null;
        return (
            <Container>
                {userModal}
                {passwordModal}
                Name: {this.state.name}
                <br/>
                Surname: {this.state.surname}
                <br/>
                Email: {this.state.email}
                <br/>
                Phone: {this.state.phone}
                <br/>
                <Button className="me-3" variant="secondary" onClick={this.handleUserModal.bind(this)} disabled={this.state.user_id === null}>
                    Change Values
                </Button>
                <Button className="ms-3" variant="secondary" onClick={this.handlePasswordModal.bind(this)} disabled={this.state.user_id === null}>
                    Change Password
                </Button>
            </Container>
        );
    }
}

export default User;