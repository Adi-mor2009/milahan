import React from 'react';
import { Container } from 'react-bootstrap';
import { useState } from 'react';
import './ContactPage.css'

function ContactPage() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    function handleSubmit(e) {
    }

    return (
        <Container className="p-contact">
            <form id="contact-form" onSubmit={handleSubmit} method="POST">
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
            </form>
        </Container>
    );
}

export default ContactPage;