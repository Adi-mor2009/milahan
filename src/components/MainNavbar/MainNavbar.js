import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';

function MainNavbar({activeUser}) {
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
                    {!activeUser ? <Nav.Link href="#/login">Login</Nav.Link> : null}
                    {activeUser ? <Nav.Link href="#">Logout</Nav.Link> : null}
                </Nav>
        </Navbar.Collapse>
        </Navbar>
    );
}

export default MainNavbar;