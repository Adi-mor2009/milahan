import React from 'react';
import { Form, ListGroup } from 'react-bootstrap';
import './SearchBox.css'


function SearchBox({placeholder, searchText, onSearchChange, onEnter, results, onResultSelected}) {
    return (
        <div className="c-searchbox">
            <Form.Control type="text" placeholder={placeholder} value={searchText} 
                onChange={e => onSearchChange(e.target.value)} onKeyPress={e => e.key === 'Enter' && e.target.value.length > 0 ? onEnter(e.target.value) : null}/>
            <ListGroup className="result-box">
                {results.map((result, index) => 
                    // <ListGroup.Item action onClick={() => onResultSelected(index)}>
                    <ListGroup.Item action onClick={() => onResultSelected(index)}>
                        {result}
                    </ListGroup.Item>)}
            </ListGroup>
        </div>
    );
}

export default SearchBox;