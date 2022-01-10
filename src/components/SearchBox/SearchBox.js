import React from 'react';
import { Form, InputGroup, ListGroup } from 'react-bootstrap';
import { Dropdown, Header, Icon, Input } from 'semantic-ui-react'
import './SearchBox.css'


function SearchBox({ placeholder, searchText, onSearchChange, onEnter, results, onResultSelected, searchBy, searchByItems, onSearchBySelect }) {
    debugger
    const defaultValue = searchByItems ? searchByItems.filter(s => s.key == searchBy) : [];
    // function debounce(func, timeout = 300) {
    //     let timer;
    //     return (...args) => {
    //         clearTimeout(timer);
    //         timer = setTimeout(() => { func.apply(this, args); }, timeout);
    //     };
    // }
    
    // function onSearchTextChanged(e) {
    //     console.log('Saving data');
    //     onSearchChange(e);
    // }

    // const processChange = debounce((e) => onSearchTextChanged(e));

    return (
        <div className="c-searchbox">

            {/* <div className="c-filter">
                <Form.Group controlId="formFilter">
                    <InputGroup>
                        <Form.Control type="text" placeholder={placeholder}
                            value={filterText} onChange={e => filterTextChange(e.target.value)} />
                        <InputGroup.Append>
                            <InputGroup.Text id="basic-addon1">{icon}</InputGroup.Text>
                        </InputGroup.Append>
                    </InputGroup>
                </Form.Group>
            </div> */}

            <Form.Group controlId="formFilter">
                <InputGroup>
                    <Form.Control type="text" placeholder={placeholder} value={searchText}
                        onChange={e => onSearchChange(e.target.value)} onKeyPress={e => e.key === 'Enter' && e.target.value.length > 0 ? onEnter(e.target.value) : null} />
                    {searchByItems && <InputGroup.Append>
                        {/* <Dropdown
                            text={filter}
                            multiple
                            icon='filter'
                            floating
                            labeled
                            button
                        >
                            <Dropdown.Menu>
                                <Dropdown.Header icon='tags' content='פילטור על פי נושאים' />
                                <Dropdown.Divider />
                                <Dropdown.Item text='Important' />
                                <Dropdown.Item text='Announcement' />
                                <Dropdown.Item text='Discussion' />
                            </Dropdown.Menu>
                        </Dropdown> */}
                        {/* <Dropdown text="חיפוש לפי ..." multiple icon='search' onChange={(data) => { onSearchBySelect(data) }}>
                            <Dropdown.Menu>
                                    {searchByItems ? searchByItems.map((option) => (
                                        <Dropdown.Item key={option.value} {...option} />
                                    )) : ""}
                            </Dropdown.Menu>
                        </Dropdown> */}
                        <Header as='h4'>
                            <Header.Content>
                                חיפוש לפי {''}
                                <Dropdown
                                    inline
                                    options={searchByItems}
                                    defaultValue={defaultValue[0].value}
                                    onChange={(prop, data) => { onSearchBySelect(data) }}
                                />
                            </Header.Content>
                        </Header>
                    </InputGroup.Append>}
                </InputGroup>
            </Form.Group>
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