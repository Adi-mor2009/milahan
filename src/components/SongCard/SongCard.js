import { Button, Card, Col, Row } from "react-bootstrap";
import './SongCard.css';
import image from '../../asserts/songCardImg.png';
// import image from '../../asserts/notes.png';
// import image from '../../asserts/colorNotes.png';
// import image from '../../asserts/colorNote.png';
// import image from '../../asserts/iStock-185090272.jpg';

function SongCard({ song, isEditable, onEdit, onDelete}) {
    console.log(isEditable);
    // const accordionPart = song.books.map((book, index) => <Accordion key={index.toString()} defaultActiveKey="0">
    //     <Card>
    //         <Accordion.Toggle as={Card.Header} eventKey={index.toString()}>
    //             {card.props.tenant.name}
    //         </Accordion.Toggle>
    //         <Accordion.Collapse eventKey={index.toString()}>
    //             <Card.Body>{card}</Card.Body>
    //         </Accordion.Collapse>
    //     </Card>
    // </Accordion>)
    return (
        <div className="c-song-card">
            <Card>
                <Card.Header>
                    { isEditable && <div className="song-card-bottons">
                        <Button variant="light" onClick={() => onEdit(song.id)}><i className="bi bi-pencil" style={{ color: 'lightskyblue', fontWeight: 'bold' }}></i></Button>
                        <Button variant="light" onClick={() => onDelete(song.id)}><i className="bi bi-trash" style={{ color: 'red' }}></i></Button>
                        <Card.Title>{song.title}</Card.Title>
                    </div>}
                </Card.Header>
                <Row className='no-gutters'>
                    <Col className="col-md-4 c-song-img">
                        {!song.img && <Card.Img variant="top" src={image} />}
                        {song.img && <Card.Img variant="top" src={song.img} />}
                    </Col>
                    <Col className="col-md-8 c-song-info">
                        <Card.Body>
                            <Card.Title> שם: {song.title}</Card.Title>
                            <Card.Text>מחבר: {song.lyrics}</Card.Text>
                            <Card.Text>מלחין: {song.composer}</Card.Text>
                            <Card.Text>מילים ראשונות: {song.firstWords}</Card.Text>
                            {/* {accordionPart} */}
                            {/* <div className="song-card-bottons">
                                <Button variant="light"><i className="bi bi-pencil" style={{color: 'lightskyblue'}}></i></Button>
                                <Button variant="light"><i className="bi bi-trash" style={{color: 'red'}}></i></Button>
                            </div> */}
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </div>
    )
}

export default SongCard;