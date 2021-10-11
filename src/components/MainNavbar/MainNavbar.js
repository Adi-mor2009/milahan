import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';

function MainNavbar(props) {
    return (
        <Navbar bg="light" expand="lg">
            <Navbar.Brand href="#/">Milahan</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto">
                    <Nav.Link href="#/About">About</Nav.Link>
                    <Nav.Link href="#/Contact">Contact us</Nav.Link>
                </Nav>
                <Nav className="ml-auto">
                    <Nav.Link href="#/login">Login</Nav.Link>
                    <Nav.Link href="#">Logout</Nav.Link>
                </Nav>
        </Navbar.Collapse>
        </Navbar>
    );
}

export default MainNavbar;