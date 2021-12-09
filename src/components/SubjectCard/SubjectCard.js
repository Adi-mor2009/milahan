import { Button, Card, Col, Row } from "react-bootstrap";
import './SubjectCard.css';
import image from '../../asserts/iStock-185090272.jpg';

function SubjectCard({ subject, isEditable, onEdit, onDelete }) {

    return (
        <div className="c-subject-card">
            <Card>
                <Card.Header>
                    {isEditable && <div className="subject-card-bottons">
                        <Button variant="light" onClick={() => onEdit(subject.id)}><i className="bi bi-pencil" style={{ color: 'lightskyblue', fontWeight: 'bold' }}></i></Button>
                        <Button variant="light" onClick={() => onDelete(subject.id)}><i className="bi bi-trash" style={{ color: 'red' }}></i></Button>
                        <Card.Title>{subject.name}</Card.Title>
                    </div>}
                </Card.Header>
                <Row className='no-gutters'>
                    <Col className="col-md-4 c-subject-img">
                        {!subject.img && <Card.Img variant="top" src={image} />}
                        {subject.img && <Card.Img variant="top" src={subject.img} />}
                    </Col>
                    <Col className="col-md-8 c-subject-info">
                        <Card.Body>
                            <Card.Title>שם: {subject.name}</Card.Title>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </div>
    )
}

export default SubjectCard;