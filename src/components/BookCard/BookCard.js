import { Accordion, Button, Card, Col, Row } from "react-bootstrap";
import './BookCard.css';
//import image from '../../asserts/songBookCardImg.png';
//import image from '../../asserts/istockphoto-450576849-1024x1024.jpg';
//import image from '../../asserts/istockphoto-457231929-1024x1024.jpg';
//iStock-1146829288.png'
//iStock-1146829288.jpeg'
import image from '../../asserts/book.png';
import ContextAwareToggle from "../ContextAwareToggle/ContexAwareToggle";

function BookCard({ book, isEditable, onEdit, onDelete, onSongDelete, onSongAdd }) {
    const bookSongs = book.songs.map(
        (songItem) =>
            <div>
                <i class="bi bi-music-note-list"></i>
                <span style={{ fontWeight: 'bold' }}> {songItem.title}</span> עמוד: {songItem.page}
            </div>
    );
    const accordionPart = book.songs.map((song, index) => <Accordion key={index.toString()}>
        <Card>
            <Accordion.Toggle as={Card.Header} eventKey={index.toString()}>
                <ContextAwareToggle as={Button} style={{ color: 'black' }} variant="link" eventKey={index.toString()}
                // style={currentActiveKey === index.toString() ? { backgroundColor: "lightskyblue" } : null}
                >
                    <Button variant="light" onClick={() => onSongDelete(song.id)}><i className="bi bi-x" style={{ color: 'red' }}></i></Button>
                    <span style={{ color: 'black' }}><i class="bi bi-music-note-list"></i></span>
                    <span style={{ fontWeight: 'bold', color: 'black' }}> {song.title}</span> <span style={{ color: 'black' }}>עמוד: {song.page} </span>
                </ContextAwareToggle>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={index.toString()}>
                <Card.Body>
                    {song.title && <Card.Text>שם: {song.title}</Card.Text>}
                    {song.lyrics && <Card.Text>מחבר: {song.lyrics}</Card.Text>}
                    {song.composer && <Card.Text>מלחין: {song.composer}</Card.Text>}
                    {song.firstWords && <Card.Text> מילים ראשונות: {song.firstWords}</Card.Text>}
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    </Accordion>)

    return (
        <div className="c-book-card">
            <Card>
                <Card.Header>
                    {isEditable && <div className="book-card-bottons">
                        <Button variant="light" onClick={() => onEdit(book.id)}><i className="bi bi-pencil" style={{ color: 'lightskyblue', fontWeight: 'bold' }}></i></Button>
                        <Button variant="light" onClick={() => onDelete(book.id)}><i className="bi bi-trash" style={{ color: 'red' }}></i></Button>
                        <Card.Title>{book.title}</Card.Title>
                    </div>}
                    {!isEditable && <div className="song-card-bottons">
                        <Card.Title>{book.title}</Card.Title>
                    </div>}
                </Card.Header>
                <Row className='no-gutters'>
                    <Col className="col-md-4 c-book-img">
                        {!book.img && <Card.Img variant="top" src={image} />}
                        {book.img && <Card.Img variant="top" src={book.img} />}
                    </Col>
                    <Col className="col-md-8 c-book-info">
                        <Card.Body>
                            <Card.Title>שם: {book.title}</Card.Title>
                            {book.subTitle && <Card.Text>תת כותרת: {book.subTitle}</Card.Text>}
                            {book.author && <Card.Text>מחבר: {book.author}</Card.Text>}
                            {book.series && <Card.Text>סדרה: {book.series}</Card.Text>}
                            {book.publisher && <Card.Text>הוצאה לאור: {book.publisher}</Card.Text>}
                            {book.publishPlace && <Card.Text>מקום הוצאה לאור: {book.publishPlace}</Card.Text>}
                            {book.publishYear && <Card.Text>שנת הוצאה לאור: {book.publishYear}</Card.Text>}
                            {book.mmsid && <Card.Link href={"https://haifa-primo.hosted.exlibrisgroup.com/primo-explore/search?query=any,contains," + book.mmsid+ "&tab=haifa_all&vid=HAU&lang=iw_IL"} target="_blank"><Card.Text>הספר בקטלוג אוניברסיטת חיפה </Card.Text></Card.Link>}
                            {isEditable && <Card.Text> {book.isInPrivateCollection && book.isInPrivateCollection == 1 ? <span>האם נמצא באוסף פרטי? כן</span> : ""}</Card.Text>}
                            {isEditable && <Card.Text>{book.isInPrivateCollection && book.isInPrivateCollection == 0 ? <span>האם נמצא באוסף פרטי? לא</span> : ""}</Card.Text>}
                            {isEditable && <Button variant="link" onClick={() => onSongAdd(book.id)}><i className="bi bi-plus-circle-fill" style={{ color: 'lightskyblue' }}></i> הוספת שיר לספר </Button>}
                            {book.songs && book.songs.length > 0 && <div>
                                <Accordion key={"songMainList"}>
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey={"songMainList"}>
                                            <ContextAwareToggle as={Button} variant="link" eventKey={"songMainList"}
                                            // style={currentActiveKey === index.toString() ? { backgroundColor: "lightskyblue" } : null}
                                            >
                                                <span style={{ fontWeight: 'bold' }}> שירים: </span>
                                            </ContextAwareToggle>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey={"songMainList"}>
                                            <Card.Body>
                                                {accordionPart}
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                            </div>}

                            {/* {accordionPart} */}
                            {/* <div className="book-card-bottons">
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

export default BookCard;