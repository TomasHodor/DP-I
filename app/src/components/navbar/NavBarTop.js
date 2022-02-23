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
                        <Navbar.Toggle />
                        <Navbar.Collapse className="justify-content-end">
                            <Nav.Link href="/registration"> Sign Up</Nav.Link>
                            <Nav.Link href="/login"> Sign In</Nav.Link>
                        </Navbar.Collapse>
                    </Nav>
                </Container>
            </Navbar>
        );
    }
}

export default NavBarTop;