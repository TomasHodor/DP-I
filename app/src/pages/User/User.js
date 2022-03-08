import React from 'react';
import {Button, Container} from "react-bootstrap"
import UserModal from "../../components/user/UserModal";

class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user_id: null,
            name: null,
            surname: null,
            email: null,
            phone: null,
            userModal: false
        };
    }

    handleUserModal(event) {
        if (this.state.user_id)
            this.setState({ userModal: !this.state.userModal });
    }

    componentDidMount() {
        let user = this.props.user;
        if (user) {
            let user_id = this.props.user.user_id
            fetch('http://127.0.0.1:5000/user/user_id=' + user_id, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            }).then(response => response.json().then(data => {
                this.setState({
                    user_id: user_id,
                    name: data[0].name,
                    surname: data[0].surname,
                    email: data[0].email,
                    phone: data[0].phone
                })
            }));
        }
    }

    render() {
        const userModal = this.state.userModal ? (
            <UserModal modalHandler={this.handleUserModal.bind(this)} show={this.state.userModal} user={this.state}/>
        ) : null;
        return (
            <Container>
                {userModal}
                Name: {this.state.name}
                <br/>
                Surname: {this.state.surname}
                <br/>
                Email: {this.state.email}
                <br/>
                Phone: {this.state.phone}
                <br/>
                <Button variant="secondary" onClick={this.handleUserModal.bind(this)}>
                    Change Values
                </Button>
            </Container>
        );
    }
}

export default User;