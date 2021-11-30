import { useState, useEffect, lazy } from 'react';
import { Container, Form, InputGroup, Modal, Alert, Button, Spinner } from "react-bootstrap";
import SearchBox from "../../components/SearchBox/SearchBox";
import Filter from "../../components/Filter/Filter";
import SongCard from "../../components/SongCard/SongCard";
import SongModel from '../../model/SongModel';
import { Pagination } from 'semantic-ui-react';
import './HomePage.css';
import ApiDataService from '../../utils/ApiDataService';

function HomePage({ activeUser }) {
    const [songs, setSongs] = useState();
    const [searchSongText, setSearchSongText] = useState("");
    const [songResults, setSongResults] = useState([]);
    const [showModalNewSong, setShowModalNewSong] = useState(false);
    const [showModalEditSong, setShowModalEditSong] = useState(false);
    const [showModalRemoveSong, setShowModalRemoveSong] = useState(false);
    const [showSignupError, setShowSignupError] = useState(false)
    const [showRemoveError, setShowRemoveError] = useState(false);
    const [showEditError, setShowEditError] = useState(false);
    const [title, setTitle] = useState("");
    const [lyrics, setLyrics] = useState("");
    const [composer, setComposer] = useState("");
    const [firstWords, setFirstWords] = useState(undefined);
    const [songForDel, setSongForDel] = useState(undefined);
    const [songForEdit, setSongForEdit] = useState(undefined);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [boundaryRange, setBoundaryRange] = useState(1);
    const [loading, setLoading] = useState(false);
    const [globalError, setGlobalError] = useState(false);
    let editable = false;

    const operations = {
        CREATE: "create",
        UPDATE: "update",
        DELETE: "delete"
    }

    useEffect(() => {
        (async () => {
            setLoading(true);
            const response = (await ApiDataService.getData(ApiDataService.types.SONG, page, undefined)).response;
            setLoading(false);
            if (response) {
                const data = response.data.content;
                console.log(data);
                setTotalPages(response.data.totalPages);
                setSongs(data.map((plainSong) => new SongModel(plainSong)));
            }
        })()
    }, [])

    if (activeUser && activeUser.role == 0) {
        editable = true;
    }

    const songsCards = songs !== undefined ? songs.map((song, index) => <SongCard key={index.toString()} song={song} isEditable={editable} onDelete={preperFotSongDelete} onEdit={preperForSongEdit}></SongCard>) : [];

    async function handleSongSearchChange(newSearchText) {
        setSearchSongText(newSearchText);

        if (newSearchText) {
            setLoading(true);
            const response = await ApiDataService.getData(ApiDataService.types.SONG, undefined, 100, newSearchText);
            setLoading(false);
            if (response.error) {
                setGlobalError(true);
            }
            else {
                if (response.response) {
                    const data = response.response.data.content;
                    setSongResults(data);
                }
            }
        } else {
            setSongResults([]);
        }
    }

    function handleSongCheckBySearch(result) {
        debugger
        setSearchSongText("");
        setSongs(songResults.filter((plainSong, index) => index==result).map((plainSong) => new SongModel(plainSong)));
        setSongResults([]);
    }

    function handleSearchEnter() {
        debugger
        setSearchSongText("");
        setSongs(songResults.map((plainSong) => new SongModel(plainSong)));
        setSongResults([]);
    }

    // function addSong(resultIndex) {
    //     //Get more info of actor
    //     // const songId = songResults[resultIndex].id;
    //     // const getURL = "https://api.themoviedb.org/3/movie/" + songId + "?api_key=c87aac96194f8ffb8edc34a066fa92de&language=en-US";
    //     // axios.get(getURL).then(response => {
    //     //     const songToAdd = response.data;
    //     //     // Adding the movie to the view
    //     //     setSongs(songs.concat(new SongModel(songToAdd.title, songToAdd.runtime, "bla bla", songToAdd.vote_average, songToAdd.overview, "https://image.tmdb.org/t/p/w500" + songToAdd.poster_path, songToAdd.homepage)));

    //     //     // Cleaning up the SearchBox
    //     //     setSongResults([]);
    //     //     setSearchSongText("");
    //     // });
    // }

    async function addSong() {
        // validation code is missing here...
        debugger
        const data = { title: title, lyrics: lyrics, composer: composer, firstWords: firstWords };
        setLoading(true);
        const response = await ApiDataService.postData(ApiDataService.types.SONG, data);
        setLoading(false);
        if (response.response) {
            const data = response.response.data;
            setShowModalNewSong(false);
            // inorder to render it we should do setSongs appending new song setSongs(data.map((plainSong) => new SongModel(plainSong)));
            //jump to last page setPage(totalPages)
        }
        else {
            if (response.error) {
                setShowSignupError(true);
            }
        }
        // Cleaning up
        setTitle("");
        setLyrics("");
        setComposer("");
        setFirstWords("");
    }

    async function removeSong() {
        //e.preventDefault();
        console.log("song to be deleted " + songForDel)
        setLoading(true);
        const songToRemove = await ApiDataService.deleteData(ApiDataService.types.SONG, songForDel);
        setLoading(false);
        if (songToRemove.error) {
            setShowRemoveError(true);
        }
        else {
            setShowModalRemoveSong(false);
        }
    }

    async function editSong() {
        const data = { title: title, lyrics: lyrics, composer: composer, firstWords: firstWords };
        setLoading(true);
        const songToUpdate = await ApiDataService.putData(ApiDataService.types.SONG, songForEdit, data);
        setLoading(false);
        if (songToUpdate.error) {
            setShowEditError(true);
        }
        else {
            handleClose(operations.UPDATE);
            //should do setSongs inorder to render
        }
    }

    async function preperForSongEdit(id) {
        setLoading(true);
        const response = await ApiDataService.getDataById(ApiDataService.types.SONG, id, undefined);
        setLoading(false);
        if (response.error) {
            setShowEditError(true);
        }
        else {
            debugger
            const songToEdit = response.response.data;
            setTitle(songToEdit.title);
            setLyrics(songToEdit.lyrics);
            setComposer(songToEdit.composer);
            setFirstWords(songToEdit.firstWords);
            setSongForEdit(id);
            setShowModalEditSong(true);
        }
    }

    function preperFotSongDelete(id) {
        setSongForDel(id);
        setShowModalRemoveSong(true);
    }

    function handleClose(operation) {
        switch (operation) {
            case operations.CREATE:
                setShowModalNewSong(false);
                setShowSignupError(false);//Clear also errors
                setTitle("");
                setLyrics("");
                setComposer("");
                setFirstWords("");
                break;
            case operations.UPDATE:
                setShowModalEditSong(false);
                setShowEditError(false);
                setSongForEdit(undefined);
                setTitle("");
                setLyrics("");
                setComposer("");
                setFirstWords("");
                break;
            case operations.DELETE:
                setShowModalRemoveSong(false);
                setShowRemoveError(false);
                setSongForDel(undefined);
                break;
        }
    }

    async function handlePaginationChange(e, activePage) {
        setLoading(true);
        const response = (await ApiDataService.getData(ApiDataService.types.SONG, activePage.activePage, undefined)).response;
        setLoading(false);
        if (response) {
            const data = response.data.content;
            setTotalPages(response.data.totalPages);
            setPage(activePage.activePage);
            setSongs(data.map((plainSong) => new SongModel(plainSong)));
        }
    }

    return (
        <div className="p-home">
            <Container>
                {/* <Form>
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
                    </Form> */}
                <SearchBox
                    placeholder="חיפוש שיר ..."
                    searchText={searchSongText}
                    onSearchChange={handleSongSearchChange}
                    onEnter={handleSearchEnter}
                    results={songResults.map(result => result.title +", " + result.lyrics+", " + result.composer+", " +  result.firstWords)}
                    onResultSelected={handleSongCheckBySearch} />
                {/* <Filter
                    icon={<i className="bi bi-music-note"></i>}
                    // <i className="bi bi-funnel-fill"></i><i className="bi bi-search"></i>
                    placeholder="חיפוש שיר ..."
                    filterText={searchSongText}
                    filterTextChange={(text) => songResults(text)}
                /> */}
                {!loading && <div className="new-song">
                    <Button variant="link" onClick={() => setShowModalNewSong(true)}><i className="bi bi-plus-circle-fill" style={{ color: 'lightskyblue' }}></i> הוספת שיר חדש </Button>
                </div>}
                <Modal show={showModalNewSong} onHide={() => handleClose(operations.CREATE)} backdrop="static" keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>הוספת שיר חדש</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {showSignupError ? <Alert variant="danger">שגיאה בהוספה!</Alert> : null}
                        <Form>
                            <Form.Group controlId="formBasicTitel">
                                <Form.Label>שם השיר</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-music-note-list"></i></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control type="text" placeholder="הכנסת שם שיר" required
                                        value={title} onChange={e => setTitle(e.target.value)} />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter email address.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicLyrics">
                                <Form.Label>משורר</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i className="bi bi-person-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control type="text" placeholder="שם משורר"
                                        value={lyrics} onChange={e => setLyrics(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicComposer">
                                <Form.Label>מלחין</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i className="bi bi-person-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="שם מלחין"
                                        value={composer} onChange={e => setComposer(e.target.value)} />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group controlId="formBasicFirstWords">
                                <Form.Label>מילים ראשונות</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-disc-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="שלוש מילים ראשונות בשיר"
                                        value={firstWords} onChange={e => setFirstWords(e.target.value)} />
                                </InputGroup>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose(operations.CREATE)}>
                            סגירה
                        </Button>
                        <Button variant="primary" onClick={addSong}>
                            שמירה
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div className="p-home-cards">
                    {loading && <div className="p-home-spinner"><Spinner animation="border" variant="primary" /></div>}
                    {songsCards}
                </div>
                <Modal show={showModalRemoveSong} onHide={() => handleClose(operations.DELETE)} backdrop="static" keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>מחיקת שיר</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {showRemoveError ? <Alert variant="danger">שגיאה בהסרה!</Alert> : null}
                        האם פעולת מחיקת השיר רצויה?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={removeSong}>
                            כן
                        </Button>
                        <Button variant="primary" onClick={() => handleClose(operations.DELETE)}>
                            לא
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showModalEditSong} onHide={() => handleClose(operations.UPDATE)} backdrop="static" keyboard={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>עריכת שיר</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {showEditError ? <Alert variant="danger">שגיאה בעדכון</Alert> : null}
                        <Form>
                            <Form.Group controlId="formBasicTitle">
                                <Form.Label>שם</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-music-note-list"></i></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control type="text" placeholder="הכנסת שם השיר" required
                                        value={title} onChange={e => setTitle(e.target.value)} />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter a song title.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicLyrics">
                                <Form.Label>משורר</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i className="bi bi-person-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="שם המשורר"
                                        value={lyrics} onChange={e => setLyrics(e.target.value)} />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group controlId="formBasicComposer">
                                <Form.Label>מלחין</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i className="bi bi-person-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="שם המלחין"
                                        value={composer} onChange={e => setComposer(e.target.value)} />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group controlId="formBasicFirstWords">
                                <Form.Label>מילים ראשונות</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-disc-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="3 מילים ראשונות בשיר"
                                        value={firstWords} onChange={e => setFirstWords(e.target.value)} />
                                </InputGroup>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose(operations.UPDATE)}>
                            סגירה
                        </Button>
                        <Button variant="primary" onClick={editSong}>
                            שמירת שינויים
                        </Button>
                    </Modal.Footer>
                </Modal>
                {!loading && <Pagination className="p-2"
                    activePage={page}
                    boundaryRange={boundaryRange}
                    onPageChange={handlePaginationChange}
                    size='mini'
                    siblingRange={boundaryRange}
                    totalPages={totalPages}
                    // Heads up! All items are powered by shorthands, if you want to hide one of them, just pass `null` as value
                    ellipsisItem={undefined}
                    firstItem={undefined}
                    lastItem={undefined}
                    prevItem={undefined}
                    nextItem={undefined}
                />}
            </Container>
        </div>
    )
}

export default HomePage;