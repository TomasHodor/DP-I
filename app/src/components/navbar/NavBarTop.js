import React from 'react';
import {Container, Nav, Navbar} from "react-bootstrap";

class NavBarTop extends React.Component {

    render() {
        return (
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="/">Crowdfund</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link href="/">Home</Nav.Link>
                        <Nav.Link href="/contribute">Contribute</Nav.Link>
                        <Nav.Link href="/registration"> Sign Up</Nav.Link>
                        <Navbar.Collapse className="justify-content-end">
                            <Navbar.Text>
                                Signed in as: <a href="/signin">Sign In</a>
                            </Navbar.Text>
                        </Navbar.Collapse>
                    </Nav>
                </Container>
            </Navbar>
        );
    }
}

export default NavBarTop;