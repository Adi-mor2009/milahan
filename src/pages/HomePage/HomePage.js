import { useState, useEffect, lazy } from 'react';
import { Container, Form, InputGroup, Modal, Alert, Button, Spinner, Col } from "react-bootstrap";
import SearchBox from "../../components/SearchBox/SearchBox";
import { Dropdown } from 'semantic-ui-react'
import Filter from "../../components/Filter/Filter";
import SongCard from "../../components/SongCard/SongCard";
import SongModel from '../../model/SongModel';
import { Pagination } from 'semantic-ui-react';
import './HomePage.css';
import ApiDataService from '../../utils/ApiDataService';
import SubjectModel from '../../model/SubjectModel';

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
    const [subjects, setSubjects] = useState([]);
    const [songForDel, setSongForDel] = useState(undefined);
    const [songForEdit, setSongForEdit] = useState(undefined);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [boundaryRange, setBoundaryRange] = useState(1);
    const [loading, setLoading] = useState(false);
    const [globalError, setGlobalError] = useState(false);
    const [subjectMultiSelectValues, setSubjectMultiSelectValues] = useState([]);
    const [subjectsValues, setSubjectsValues] = useState([]);
    const stateOptions = subjectsValues.map((subjectsValue, index) => ({
        key: subjectsValue.id,
        text: subjectsValue.name,
        value: subjectsValue.name,
    }))
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
                debugger
                setTotalPages(response.data.totalPages);
                setSongs(data.map((plainSong) => new SongModel(plainSong)));
                // debugger
                // const subjectArr = data.map((plainSong) => plainSong.subjects);
                // setSubjectMultiSelectValues(subjectArr.map((plainSubject) => new SubjectModel(plainSubject)));
            }

            setLoading(true);
            const subjectsResponse = (await ApiDataService.getData(ApiDataService.types.SUBJECT, undefined, 5000)).response;
            setLoading(false);
            if (subjectsResponse) {
                const data = subjectsResponse.data.content;
                debugger
                setSubjectsValues(data.map((plainSubject) => new SubjectModel(plainSubject)));
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
            const response = await ApiDataService.getData(ApiDataService.types.SONG, undefined, 5000, newSearchText);
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
        setSongs(songResults.filter((plainSong, index) => index == result).map((plainSong) => new SongModel(plainSong)));
        setSongResults([]);
    }

    function handleSearchEnter() {
        debugger
        setSearchSongText("");
        setSongs(songResults.map((plainSong) => new SongModel(plainSong)));
        setSongResults([]);
    }

    async function addSong() {
        // validation code is missing here...
        debugger
        const data = { title: title, lyrics: lyrics, composer: composer, firstWords: firstWords, subjects: subjectMultiSelectValues };
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
        setSubjectMultiSelectValues([]);
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
        const data = { title: title, lyrics: lyrics, composer: composer, firstWords: firstWords, subjects: subjectMultiSelectValues };
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
            setSubjectMultiSelectValues(songToEdit.subjects);
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
                setSubjectMultiSelectValues([]);
                break;
            case operations.UPDATE:
                setShowModalEditSong(false);
                setShowEditError(false);
                setSongForEdit(undefined);
                setTitle("");
                setLyrics("");
                setComposer("");
                setFirstWords("");
                setSubjectMultiSelectValues([]);
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

    function onSelectedSubjectsChange(prop, data) {
        console.log(prop);
        console.log(data);
        debugger
        var toRemoveArr = subjectMultiSelectValues.filter(val => !data.value.includes(val.id));
        console.log(toRemoveArr);
        var toAddArr = data.value.filter(item => !((subjectMultiSelectValues.map(x => x.id)).includes(item)));
        console.log(toAddArr);

        toRemoveArr.forEach(function (item) {
            let index = subjectMultiSelectValues.findIndex(x => x.id == item.id);
            setSubjectMultiSelectValues(subjectMultiSelectValues => subjectMultiSelectValues.slice(0, index).concat(subjectMultiSelectValues.slice(index + 1, subjectMultiSelectValues.length)));
        });

        for (let j = 0; j < toAddArr.length; j++) {
            for (let i = 0; i < data.options.length; i++) {
                if (data.options[i].value == toAddArr[j]) {
                    const name = data.options[i].text;
                    setSubjectMultiSelectValues(subjectMultiSelectValues => subjectMultiSelectValues.concat({ id: toAddArr[j], name: name }));
                    break;
                }
            }
        }
    }

    const subjectsValuesNames = subjectsValues.map((option, index) => (
        { key: option.id, text: option.name, value: option.id }
    ));

    const subjectDefaultValuesToShow = subjectMultiSelectValues.map((option, index) => (
        option.id
    ));

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
                    results={songResults.map(result => result.title + ", " + result.lyrics + ", " + result.composer + ", " + result.firstWords)}
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
                    <Modal.Header>
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

                            <Form.Group as={Col} controlId="subjectMultiSelectField">
                                <Form.Label>בחירת נושאי שירים</Form.Label>
                                <Dropdown
                                    placeholder='נושאי שיר'
                                    fluid
                                    multiple
                                    selection
                                    options={subjectsValuesNames}
                                    onChange={(props, data) => { onSelectedSubjectsChange(props, data) }} />
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
                    <Modal.Header>
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

                            <Form.Group as={Col} controlId="subjectMultiSelectField">
                                <Form.Label>בחירת נושאי שירים</Form.Label>
                                <Dropdown
                                    placeholder='נושאי שיר'
                                    fluid
                                    multiple
                                    selection
                                    options={subjectsValuesNames}
                                    onChange={(props, data) => { onSelectedSubjectsChange(props, data) }}
                                    defaultValue={subjectDefaultValuesToShow} />
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