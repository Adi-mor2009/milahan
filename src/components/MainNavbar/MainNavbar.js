import React, { useState } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import './MainNavbar.css'

function MainNavbar({ activeUser, onLogout }) {
    debugger
    return (
        <Navbar bg="light" expand="lg" className="c-navbar">
            <Navbar.Brand href="#/"><i className="bi bi-house-fill"></i> מילחן</Navbar.Brand>
            {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">
                    {/* <Nav.Link href="#/book">ספרים</Nav.Link> */}
                    <Nav.Link href="#/book">ספרים</Nav.Link>
                    <Nav.Link href="#/about">אודות</Nav.Link>
                    {/* {activeUser &&  activeUser.role==0 ? <Nav.Link href="#/edit">עריכה</Nav.Link> : null} */}
                    <Nav.Link href="#/contact">יצירת קשר</Nav.Link>
                    <Nav.Link className="lib-haifa-link" href="https://lib.haifa.ac.il/" target="_blank"></Nav.Link>
                </Nav>
                <Nav className="me-auto">
                    {!activeUser ? <Nav.Link href="#/login"><span style={{ color: "blue", fontWeight: "bold" }}>התחברות</span></Nav.Link> : null}
                    {activeUser ? <Navbar.Text><span style={{ color: "blue" }}>שלום {activeUser.name}</span></Navbar.Text> : null}
                    {activeUser ? <Nav.Link href="#" onClick={() => onLogout()}>התנתקות</Nav.Link> : null}
                    {/* {activeUser ? <Nav.Link href="#/dashboard"></Nav.Link> : null}
                    {activeUser &&  activeUser.role===0 ? <Nav.Link href="#tenants/"></Nav.Link> : null}
                    {activeUser ? <Nav.Link href="#/messages"></Nav.Link> : null}
                    {activeUser ? <Nav.Link href="#/issue"></Nav.Link> : null}
                    {activeUser ? <Nav.Link href="#/vote"></Nav.Link> : null} */}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default MainNavbar;