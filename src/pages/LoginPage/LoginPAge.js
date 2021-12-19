import React, { useState } from 'react';
import { Alert, Button, Col, Container, Form, FormControl, InputGroup, Row, Spinner } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import './LoginPage.css'

function LoginPage({ activeUser, users, onLogin }) {
    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [showInvalidLogin, setShowInvalidLogin] = useState(false);
    const [loading, setLoading] = useState(false);

    if (activeUser) {
        return <Redirect to="/" />
    }

    function login(e) {
        debugger
        e.preventDefault();
        // console.log(email);
        // console.log(pwd);

        for (const user of users) {
            if (user.login(email, pwd)) {
                activeUser = user;
                break;
            }
        }

        if (activeUser) {
            onLogin(activeUser);
        } else {
            setShowInvalidLogin(true);
        }
    }

    return (
        loading ? <div className="p-login-spinner d-flex justify-content-center align-items-center"><Spinner animation="border" variant="primary" /></div> :
            <Container fluid className="p-login">
                <div className="p-login-bg-img">
                    <Row>
                        <Col>
                            <div className="p-form-login">
                                <h1>כניסה למילחן</h1>
                                {showInvalidLogin ? <Alert variant="danger">Invalid Credentials!</Alert> : null}
                                <Form onSubmit={login}>
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Label>כתובת אימייל</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Prepend>
                                                <InputGroup.Text id="basic-addon1"><i className="bi bi-envelope-fill"></i></InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <Form.Control type="email" placeholder="הכנסת כתובת אימייל"
                                                value={email} onChange={e => setEmail(e.target.value)} />
                                            <InputGroup.Append>
                                                <InputGroup.Text id="basic-addon2">example.com@</InputGroup.Text>
                                            </InputGroup.Append>
                                        </InputGroup>
                                        <Form.Text className="text-muted">
                                            לעולם לא נחלוק את האימייל שלך עם אף אחד
                                        </Form.Text>
                                    </Form.Group>

                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>סיסמא</Form.Label>
                                        <InputGroup className="mb-3">
                                            <InputGroup.Prepend>
                                                <InputGroup.Text id="basic-addon1"><i className="bi bi-lock-fill"></i></InputGroup.Text>
                                            </InputGroup.Prepend>
                                            <Form.Control type="password" placeholder="הכנסת סיסמא"
                                                value={pwd} onChange={e => setPwd(e.target.value)} />
                                            <InputGroup.Append>
                                                <InputGroup.Text id="basic-addon2"><i className="bi bi-unlock-fill"></i></InputGroup.Text>
                                            </InputGroup.Append>
                                        </InputGroup>
                                    </Form.Group>
                                    <Button variant="success" type="submit" block>
                                        כניסה
                                    </Button>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        // loading ? <div class="p-login-spinner d-flex justify-content-center align-items-center"><Spinner animation="border" variant="primary" /></div> :
        //     <div className="p-login">
        //         <h1>Login to Milahan</h1>
        //         {showInvalidLogin ? <Alert variant="danger">Invalid Credentials!</Alert> : null}
        //         <Form onSubmit={login}>
        //             <Form.Group controlId="formBasicEmail">
        //                 <Form.Label>Email address</Form.Label>
        //                 <InputGroup>
        //                     <InputGroup.Prepend>
        //                         <InputGroup.Text id="basic-addon1"><i class="bi bi-envelope-fill"></i></InputGroup.Text>
        //                     </InputGroup.Prepend>
        //                     <Form.Control type="email" placeholder="Enter email"
        //                         value={email} onChange={e => setEmail(e.target.value)} />
        //                     <InputGroup.Append>
        //                         <InputGroup.Text id="basic-addon2">@example.com</InputGroup.Text>
        //                     </InputGroup.Append>
        //                 </InputGroup>
        //                 <Form.Text className="text-muted">
        //                     We'll never share your email with anyone else.
        //                 </Form.Text>
        //             </Form.Group>

        //             <Form.Group controlId="formBasicPassword">
        //                 <Form.Label>Password</Form.Label>
        //                 <InputGroup className="mb-3">
        //                     <InputGroup.Prepend>
        //                         <InputGroup.Text id="basic-addon1"><i class="bi bi-lock-fill"></i></InputGroup.Text>
        //                     </InputGroup.Prepend>
        //                     <Form.Control type="password" placeholder="Password"
        //                         value={pwd} onChange={e => setPwd(e.target.value)} />
        //                     <InputGroup.Append>
        //                         <InputGroup.Text id="basic-addon2"><i class="bi bi-unlock-fill"></i></InputGroup.Text>
        //                     </InputGroup.Append>
        //                 </InputGroup>
        //             </Form.Group>
        //             <Button variant="success" type="submit" block>
        //                 Login
        //             </Button>
        //         </Form>
        //     </div>
    );
}

export default LoginPage;