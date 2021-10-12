import React from 'react';
import { Container } from 'react-bootstrap';
import './AboutPage.css'

function AboutPage(props) {
    return (
        <Container className="p-about">
            <h1 className="display-1">About Us</h1>
            <p>About Page!</p>
        </Container>
    );
}

export default AboutPage;