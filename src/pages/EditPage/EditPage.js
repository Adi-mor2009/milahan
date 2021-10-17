import React from 'react';
import { Container } from 'react-bootstrap';
import './EditPage.css'

function EditPage(props) {
    return (
        <Container className="p-edit">
            <h1 className="display-1">Milahan</h1>
            <p>Add Remove Items for admin only</p>
        </Container>
    );
}

export default EditPage;