import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import './LoginPage.css'

function LoginPage(props) {
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");

    function login(e) {
        e.preventDefault();
        console.log(email);
        console.log(pwd);
    }

    return (
        <div className="p-login">
            <h1>Login to Milahan</h1>
            <Form onSubmit={login}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter email"
                        value={email} onChange={e => setEmail(e.target.value)} />
                    <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password"
                        value={pwd} onChange={e => setPwd(e.target.value)} />
                </Form.Group>
                <Button variant="success" type="submit" block>
                    Login
                </Button>
            </Form>
        </div>
    );
}

export default LoginPage;