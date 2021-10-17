import React from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import './SearchBox.css'


function SearchBox({placeholder, searchText, onSearchChange, results, onResultSelected}) {
    return (
        <div className="c-searchbox">
            <Form.Control type="text" placeholder={placeholder} value={searchText} 
                onChange={e => onSearchChange(e.target.value)}/>
            <ListGroup className="result-box">
                {results.map((result, index) => 
                    <ListGroup.Item action onClick={() => onResultSelected(index)}>
                        {result}
                    </ListGroup.Item>)}
            </ListGroup>
        </div>
    );
}

export default SearchBox;