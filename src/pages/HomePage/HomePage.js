import { useState, useEffect } from 'react';
import axios from "axios";
import { CardDeck, Container, Form } from "react-bootstrap";
import SearchBox from "../../components/SearchBox/SearchBox";
import Filter from "../../components/Filter/Filter";
// import SongCard from '../../components/Song/SongCard';
// import SongModel from '../../model/SongModel';

function HomePage() {
    const [songs, setSongs] = useState();
    const [searchSongText, setSearchSongText] = useState("");
    const [songResults, setSongResults] = useState([]);

    const songsCards = songs !== undefined ? songs.map((song) => <SongCard song={song}></SongCard>) : [];

    function handleSongSearchChange(newSearchText) {
        setSearchSongText(newSearchText);

        if (newSearchText) {
            // // Here we should call TMDB
            // const searchURL = "https://api.themoviedb.org/3/search/movie?api_key=c87aac96194f8ffb8edc34a066fa92de&query=" + newSearchText;
            // axios.get(searchURL).then(response => {
            //     setSongResults(response.data.results);
            // });
        } else {
            setSongResults([]);
        }
    }

    function addSong(resultIndex) {
        //Get more info of actor
        // const songId = songResults[resultIndex].id;
        // const getURL = "https://api.themoviedb.org/3/movie/" + songId + "?api_key=c87aac96194f8ffb8edc34a066fa92de&language=en-US";
        // axios.get(getURL).then(response => {
        //     const songToAdd = response.data;
        //     // Adding the movie to the view
        //     setSongs(songs.concat(new SongModel(songToAdd.title, songToAdd.runtime, "bla bla", songToAdd.vote_average, songToAdd.overview, "https://image.tmdb.org/t/p/w500" + songToAdd.poster_path, songToAdd.homepage)));

        //     // Cleaning up the SearchBox
        //     setSongResults([]);
        //     setSearchSongText("");
        // });
    }

    return (
        <div className="p-home">
            <Container>
                <Form>
                    {['radio'].map((type) => (
                        <div key={`inline-${type}`} className="mb-3">
                            <Form.Check
                                inline
                                label="חיפוש לפי שיר"
                                name="group1"
                                type={type}
                                id={`inline-${type}-1`}
                            />
                            <Form.Check
                                inline
                                label="חיפוש לפי ספר"
                                name="group1"
                                type={type}
                                id={`inline-${type}-2`}
                            />
                        </div>
                    ))}
                </Form>
                <SearchBox
                    placeholder="חיפוש שיר ..."
                    searchText={searchSongText}
                    onSearchChange={handleSongSearchChange}
                    results={songResults.map(result => result.title)}
                    onResultSelected={addSong} />
                <Filter
                    icon={<i className="bi bi-music-note"></i>}
                    // <i className="bi bi-funnel-fill"></i><i className="bi bi-search"></i>
                    placeholder="חיפוש שיר ..."
                    filterText={searchSongText}
                    filterTextChange={(text) => songResults(text)}
                />
                {/* <CardDeck>
                    {songs ? songs.map(song => <SongCard song={song} />) : "Loading ..."}
                </CardDeck> */}
            </Container>
        </div>
    )
}

export default HomePage;