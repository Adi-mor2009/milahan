import { Card } from "react-bootstrap";
import './SongCard.css';

function SongCard({song}){
    function getActorName () {
        return `${actor.firstName} ${actor.lastName}`;
    }
    function getImg() {
        return actor.img;
    }
    function getImdbLink() {
        return actor.imdbLink;
    }
    return(
        <div className="c-song">
            <Card style={{ width: '14rem' }}>
                <Card.Link href={getImdbLink()} target="_blank"><Card.Img variant="top" src={getImg()} /></Card.Link>
                <Card.Body>
                    <Card.Title>{getActorName()}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{actor.age()}</Card.Subtitle>
                </Card.Body>
            </Card>
        </div>
    )
}

export default SongCard;