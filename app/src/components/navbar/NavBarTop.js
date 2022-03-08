import React from 'react';
import {Button, Container, Nav, Navbar} from "react-bootstrap";
import {LinkContainer} from 'react-router-bootstrap'

class NavBarTop extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {}
        };
    }

    logout() {
        this.props.handleLogout();
        this.setState({
            user: {}
        })
    }

    render() {
        const user = this.props.user
        const logonUser = (
            <>
                {user && 'email' in user
                    ? <LinkContainer to="/user"><Nav.Link>{user.email}</Nav.Link></LinkContainer>
                    : null}
                <Button variant="light" onClick={this.logout.bind(this)}>Logout</Button>
            </>
        )
        const logoutUser = (
            <>
                <LinkContainer to="/registration"><Nav.Link>Sign Up</Nav.Link></LinkContainer>
                <LinkContainer to="/login"><Nav.Link>Sign In</Nav.Link></LinkContainer>
            </>
        )
        return (
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand to="/">Crowdfund</Navbar.Brand>
                    <Nav className="me-auto">
                        <LinkContainer to="/"><Nav.Link>Home</Nav.Link></LinkContainer>
                        <LinkContainer to="/campaigns"><Nav.Link>Campaigns</Nav.Link></LinkContainer>
                    </Nav>
                    <Nav>
                        {user ? logonUser : logoutUser}
                    </Nav>

                </Container>
            </Navbar>
        );
    }
}

export default NavBarTop;