import { Accordion, Button, Card, Col, Row } from "react-bootstrap";
import './SongCard.css';
import image from '../../asserts/songCardImg.png';
import ContextAwareToggle from "../ContextAwareToggle/ContexAwareToggle";
// import image from '../../asserts/notes.png';
// import image from '../../asserts/colorNotes.png';
// import image from '../../asserts/colorNote.png';
// import image from '../../asserts/iStock-185090272.jpg';

function SongCard({ song, isEditable, onEdit, onDelete }) {
    const songBooks = song.books.map(
        (bookItem) =>
            <div>
                <i class="bi bi-book"></i>
                <span style={{ fontWeight: 'bold' }}> {bookItem.book.title}</span> עמוד: {bookItem.page}
            </div>
    );
    const songSubjects = song.subjects.map(function(item) {
        return item['name'];
      });
        // (subjectItem) =>
        //     <div>
        //         <i class="bi bi-dot"></i>
        //         <span style={{ fontWeight: 'bold' }}> {subjectItem.name}</span>
        //     </div>
    // );
    console.log("!!!!!" + songBooks);
    const accordionPart = song.books.map((book, index) => <Accordion key={index.toString()}>
        <Card>
            <Accordion.Toggle as={Card.Header} eventKey={index.toString()}>
                <ContextAwareToggle as={Button} style={{color: 'black'}} variant="link" eventKey={index.toString()}
                // style={currentActiveKey === index.toString() ? { backgroundColor: "lightskyblue" } : null}
                >
                    <span style={{ color: 'black' }}><i class="bi bi-book"></i></span>
                    <span style={{ fontWeight: 'bold', color: 'black' }}> {book.book.title}</span> <span style={{ color: 'black' }}>עמוד: {book.page} </span>
                </ContextAwareToggle>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={index.toString()}>
                <Card.Body>
                    {book.book.subTitle && <Card.Text>תת כותרת: {book.book.subTitle}</Card.Text>}
                    {book.book.author && <Card.Text>מחבר: {book.book.author}</Card.Text>}
                    {book.book.series && <Card.Text>סדרה: {book.book.series}</Card.Text>}
                    {book.book.publisher && <Card.Text>הוצאה לאור: {book.book.publisher}</Card.Text>}
                    {book.book.publishPlace && <Card.Text>מקום הוצאה לאור: {book.book.publishPlace}</Card.Text>}
                    {book.book.publishYear && <Card.Text>שנת הוצאה לאור: {book.book.publishYear}</Card.Text>}
                    {book.book.mmsid && <Card.Text>מספר מערכת: {book.book.mmsid}</Card.Text>}
                    {isEditable && <Card.Text> {book.book.isInPrivateCollection && book.isInPrivateCollection == 1 ? <span>האם נמצא באוסף פרטי? כן</span> : ""}</Card.Text>}
                    {isEditable && <Card.Text>{book.book.isInPrivateCollection && book.isInPrivateCollection == 0 ? <span>האם נמצא באוסף פרטי? לא</span> : ""}</Card.Text>}
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    </Accordion>)
    return (
        <div className="c-song-card">
            <Card>
                <Card.Header>
                    {isEditable && <div className="song-card-bottons">
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
                            {songSubjects && songSubjects.length > 0 && <Card.Text>נושאים: {songSubjects.join(', ')}</Card.Text>}
                            {/* <Card.Text className="listSubjects">
                                {songSubjects}
                            </Card.Text> */}
                            {song.books && song.books.length > 0 && <div>
                                <Accordion key={"bookMainList"}>
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey={"bookMainList"}>
                                            <ContextAwareToggle as={Button} variant="link" eventKey={"bookMainList"}
                                            // style={currentActiveKey === index.toString() ? { backgroundColor: "lightskyblue" } : null}
                                            >
                                                <span style={{ fontWeight: 'bold' }}> ספרים: </span>
                                            </ContextAwareToggle>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey={"bookMainList"}>
                                            <Card.Body>
                                                {accordionPart}
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                            </div>}

                            {/* <Card.Text className="listBook">
                                {songBooks}
                            </Card.Text> */}
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