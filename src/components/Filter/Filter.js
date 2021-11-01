import React from 'react';
import { Form, InputGroup, ListGroup } from 'react-bootstrap';
import './Filter.css'


function Filter({ icon, placeholder, filterText, filterTextChange }) {
    return (
        <div className="c-filter">
            <Form.Group controlId="formFilter">
                <InputGroup>
                    <Form.Control type="text" placeholder={placeholder}
                        value={filterText} onChange={e => filterTextChange(e.target.value)} />
                    <InputGroup.Append>
                        <InputGroup.Text id="basic-addon1">{icon}</InputGroup.Text>
                    </InputGroup.Append>
                </InputGroup>
            </Form.Group>
        </div>
    );
}

export default Filter;