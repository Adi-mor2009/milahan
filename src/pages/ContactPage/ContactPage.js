import React from 'react';
import { Container, Form, Button, InputGroup } from 'react-bootstrap';
import { useState } from 'react';
import './ContactPage.css'

function ContactPage() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    function handleSubmit(e) {
        console.log("hello");
        setMessage("");
    }

    return (
        <Container fluid className="p-contact">
            <div className="p-contact-bg-img">
                <div className="p-contact-form">
                    <Form onSubmit={handleSubmit} method="POST">

                        <Form.Group className="mb-3" controlId="formBasicname">
                            <Form.Label>שם</Form.Label>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon1"><i className="bi bi-person-fill"></i></InputGroup.Text>
                                </InputGroup.Prepend>

                                <Form.Control type="text"
                                    value={name} onChange={e => setName(e.target.value)} />
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>דואר אלקטרוני</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon1"><i className="bi bi-envelope-fill"></i></InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control type="email" required
                                    value={email} onChange={e => setEmail(e.target.value)} />
                                <Form.Control.Feedback type="invalid">
                                    Please enter email address.
                                </Form.Control.Feedback>
                            </InputGroup>
                            <Form.Text className="text-muted">
                                לעולם לא נחלוק את הדואר האלקטרוני שלך עם אף אחד
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>הודעה</Form.Label>
                            <Form.Control as="textarea" rows={5} 
                                value={message} onChange={e => setMessage(e.target.value)}/>
                        </Form.Group>

                        <Button id="sendBtn" variant="light" type="submit" block>
                            שליחה <i class="bi bi-arrow-left-circle"></i>
                        </Button>
                    </Form>
                </div>
            </div>
            {/* <form id="contact-form" onSubmit={handleSubmit} method="POST">
                <div className="form-group">
                    <label htmlFor="name">שם</label>
                    <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">דואר אלקטרוני</label>
                    <input type="email" className="form-control" aria-describedby="emailHelp" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="message">הודעה</label>
                    <textarea className="form-control" rows="5" value={message} onChange={e => setMessage(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">שליחה</button>
            </form> */}
        </Container>
    );
}

export default ContactPage;