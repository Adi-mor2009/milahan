import React from 'react';
import { Container } from 'react-bootstrap';
import './ContactPage.css'

function ContactPage(props) {
    return (
        <Container className="p-contact">
            <h1 className="display-1">Contact Us</h1>
            <p>Contact us Page!</p>
        </Container>
    );
}

export default ContactPage;