import { useState, useEffect, lazy, useRef } from 'react';
import { Container, Form, InputGroup, Modal, Alert, Button, Spinner, Col } from "react-bootstrap";
import SearchBox from "../../components/SearchBox/SearchBox";
import { Dropdown, Header } from 'semantic-ui-react'
import Filter from "../../components/Filter/Filter";
import SongCard from "../../components/SongCard/SongCard";
import SongModel from '../../model/SongModel';
import { Pagination } from 'semantic-ui-react';
import './HomePage.css';
import ApiDataService from '../../utils/ApiDataService';
import SubjectModel from '../../model/SubjectModel';
import BookModel from '../../model/BookModel';

function HomePage({ activeUser }) {
    const [songs, setSongs] = useState();
    const [searchSongText, setSearchSongText] = useState("");
    const [songResults, setSongResults] = useState([]);
    const [showModalNewSong, setShowModalNewSong] = useState(false);
    const [showModalEditSong, setShowModalEditSong] = useState(false);
    const [showModalRemoveSong, setShowModalRemoveSong] = useState(false);
    const [showModalRemoveSongBook, setShowModalRemoveSongBook] = useState(false);
    const [showModalAddSongBook, setShowModalAddSongBook] = useState(false);
    const [showSignupError, setShowSignupError] = useState(false)
    const [showRemoveError, setShowRemoveError] = useState(false);
    const [showEditError, setShowEditError] = useState(false);
    const [showRemoveSongBookError, setShowRemoveSongBookError] = useState(false);
    const [showAddSongBookError, setShowAddSongBookError] = useState(false);
    const [title, setTitle] = useState("");
    const [lyrics, setLyrics] = useState("");
    const [composer, setComposer] = useState("");
    const [firstWords, setFirstWords] = useState(undefined);
    const [subjectMultiSelectValues, setSubjectMultiSelectValues] = useState([]);
    const [subjectsValues, setSubjectsValues] = useState([]); //All subjects
    const [allBooks, setAllBooks] = useState([]);
    const allBooksNames = allBooks.map((book, index) => (
        { key: book.id, text: book.title, value: book.id }
    ));
    const subjectsValuesNames = subjectsValues.map((option, index) => (
        { key: option.id, text: option.name, value: option.id }
    ));
    const subjectsValuesNamesFilter = subjectsValues.map((option, index) => (
        { key: option.name, text: option.name, value: option.name }
    ));
    subjectsValuesNamesFilter.unshift({ key: '?????? ??????????', text: '?????? ??????????', value: undefined });
    const subjectDefaultValuesToShow = subjectMultiSelectValues.map((option, index) => (
        option.id
    ));
    const [subjectResults, setSubjectResults] = useState([]);
    const [books, setBooks] = useState([]);
    const [bookToBeDeleted, setBookToBeDeleted] = useState();
    const [bookPage, setBookPage] = useState();
    const [bookToBeAdded, setBookToBeAdded] = useState();
    const [songToBeAdded, setSongToBeAdded] = useState();
    const [songForDel, setSongForDel] = useState(undefined);
    const [songForEdit, setSongForEdit] = useState(undefined);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [boundaryRange, setBoundaryRange] = useState(1);
    const [loading, setLoading] = useState(false);
    const [globalError, setGlobalError] = useState(false);
    const searchByValues = {
        TITLE: 'title',
        LYRICS: 'lyrics',
        COMPOSER: 'composer',
        FIRST_WORDS: 'firstWords',
        SUBJECTS: 'subjects'
    }
    const [searchBy, setSearchBy] = useState(searchByValues.TITLE);
    const searchByDropDwon = [
        { key: 'title', text: '  ???? ????????', value: searchByValues.TITLE, label: <i class="bi bi-music-note-list"></i> },
        { key: 'lyrics', text: '  ????????', value: searchByValues.LYRICS, label: <i className="bi bi-person-fill"></i> },
        { key: 'composer', text: '  ??????????', value: searchByValues.COMPOSER, label: <i className="bi bi-person-fill"></i> },
        { key: 'firstWords', text: '  ?????????? ??????????????', value: searchByValues.FIRST_WORDS, label: <i class="bi bi-disc-fill"></i> },
        { key: 'subjects', text: '   ????????????', value: searchByValues.SUBJECTS, label: <i class="bi bi-signpost-split"></i> }
        // {key: 'FirstWords', text: '  ?????????? ??????????????', value: 'FirstWords', label: { color: 'purple', empty: true, circular: true }}
    ]
    const [filter, setFilter] = useState(undefined);

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

            // setLoading(true);
            // const allBookResponse = (await ApiDataService.getData(ApiDataService.types.BOOK, undefined, 5000)).response;
            // setLoading(false);
            // if (allBookResponse) {
            //     const data = allBookResponse.data.content;
            //     debugger
            //     setAllBooks(data.map((plainBook) => new BookModel(plainBook)));
            // }
        })()
    }, [])

    // useEffect(() => {
    //     debugger
    //     f1();
    //     // if (songResults.length > 0 && searchSongText <= 1) {
    //     //     setSongResults([]);
    //     // }
    // }, [songResults])

    if (activeUser && activeUser.role == 0) {
        editable = true;
    }

    function debounce(func, timeout = 100) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

    function updateResults(data) {
        console.log('Saving data');
        setSongResults(data);
    }

    const processChange = debounce((data) => updateResults(data));

    const songsCards = songs !== undefined ? songs.map((song, index) => <SongCard key={index.toString()} song={song} isEditable={editable} onDelete={preperFotSongDelete} onEdit={preperForSongEdit} onBookDelete={deleteBook} onBookAdd={addBook}></SongCard>) : [];

    function getCardsByFilter() {
        debugger
        return filter ? songsCards.filter((card) => card.props.song.subjects ? (card.props.song.subjects.find(subject => subject.name == filter)) : "") : songsCards;
    }

    async function getBySubject(subjectFilter) {
        debugger
        setFilter(subjectFilter);
        if (subjectFilter) {
            // const filterStr = "{name=" + subjectFilter + "}";{ id: toAddArr[j], name: name }
            //const filterStr = "{ id: 2, name:" + subjectFilter + "}";
            setLoading(true);
            const response = await ApiDataService.getData(ApiDataService.types.SONG, undefined, 5000, subjectFilter, searchByValues.SUBJECTS);
            setLoading(false);
            if (response.error) {
                debugger
                setGlobalError(true);
            }
            else {
                if (response.response) {
                    debugger
                    const data = response.response.data.content;
                    //processChange(data);
                    setSongs(data.map((plainSong) => new SongModel(plainSong)));
                    setTotalPages(0);
                }
            }
        }
    }

    async function handleSongSearchChange(newSearchText) {
        setSearchSongText(newSearchText);

        if (newSearchText && newSearchText.length > 3 && searchBy != searchByValues.SUBJECTS) {
            setLoading(true);
            const response = await ApiDataService.getData(ApiDataService.types.SONG, undefined, 5000, newSearchText, searchBy);
            setLoading(false);
            if (response.error) {
                setGlobalError(true);
            }
            else {
                if (response.response) {
                    const data = response.response.data.content;
                    //processChange(data);
                    setSongResults(data);
                }
            }
        } else {
            if (searchBy == searchByValues.SUBJECTS && newSearchText.length > 0) {
                setLoading(true);
                const response = await ApiDataService.getData(ApiDataService.types.SUBJECT, undefined, 5000, newSearchText, searchBy);
                setLoading(false);
                if (response.error) {
                    setGlobalError(true);
                }
                else {
                    if (response.response) {
                        const data = response.response.data.content;
                        //processChange(data);
                        setSubjectResults(data);
                    }
                }
            } else {
                setSubjectResults([]);
            }
        }
    }

    function handleSongCheckBySearch(result) {
        debugger
        setSearchSongText("");
        if (searchBy == searchByValues.SUBJECTS) {
            setSubjectResults([]);
            getBySubject(subjectResults[result].name);
        }
        else {
            setSongs(songResults.filter((plainSong, index) => index == result).map((plainSong) => new SongModel(plainSong)));
            setSongResults([]);
        }
    }

    async function handleSearchEnter() {
        debugger
        if (searchSongText.length <= 3 && searchSongText.length > 0) {
            setLoading(true);
            const response = await ApiDataService.getData(ApiDataService.types.SONG, undefined, 5000, searchSongText, searchBy);
            setLoading(false);
            if (response.error) {
                setGlobalError(true);
            }
            else {
                if (response.response) {
                    const data = response.response.data.content;
                    //processChange(data);
                    setSongs(data.map((plainSong) => new SongModel(plainSong)));
                    setTotalPages(0);
                }
            }
        }
        else {
            setSearchSongText("");
            setSongs(songResults.map((plainSong) => new SongModel(plainSong)));
            setSongResults([]);
        }
    }

    function handleSearchBySelect(searchBySelect) {
        setSongResults([]);
        setSearchBy(searchBySelect.value);
        setTotalPages(0);
    }

    async function getAfterAction() {
        //should do setSongs inorder to render
        setLoading(true);
        const response = (await ApiDataService.getData(ApiDataService.types.SONG, page, undefined)).response;
        setLoading(false);
        if (response) {
            const data = response.data.content;
            setTotalPages(response.data.totalPages);
            setSongs(data.map((plainSong) => new SongModel(plainSong)));
        }
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
            getAfterAction();
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
            //should do setSongs inorder to render
            getAfterAction();
        }
    }

    async function editSong() {
        debugger
        const data = { title: title, lyrics: lyrics, composer: composer, firstWords: firstWords, subjects: subjectMultiSelectValues, books: books };
        setLoading(true);
        const songToUpdate = await ApiDataService.putData(ApiDataService.types.SONG, songForEdit, data);
        setLoading(false);
        if (songToUpdate.error) {
            setShowEditError(true);
        }
        else {
            handleClose(operations.UPDATE);
            //should do setSongs inorder to render
            getAfterAction();
        }
    }

    async function removeSongBook() {
        console.log("song to be deleted " + bookToBeDeleted)
        setLoading(true);
        const songBookToRemove = await ApiDataService.deleteData(ApiDataService.types.SONG_BOOK, bookToBeDeleted);
        setLoading(false);
        if (songBookToRemove.error) {
            setShowRemoveSongBookError(true);
        }
        else {
            setShowModalRemoveSongBook(false);
            //should do setSongs inorder to render
            getAfterAction();
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
            setBooks(songToEdit.books);
            setSongForEdit(id);
            setShowModalEditSong(true);
            return songToEdit;
        }
    }

    function preperFotSongDelete(id) {
        setSongForDel(id);
        setShowModalRemoveSong(true);
    }

    function handleBookSelect(props, data) {
        debugger
        console.log(props);
        console.log(data);
        setBookToBeAdded(data.value);
    }

    async function addSongBook() {
        // const bookIndex = allBooks.findIndex(b => b.id == bookToBeAdded);
        // const bookToAddObj = allBooks[bookIndex];
        // const songIndex = songs.findIndex(s => s.id == songToBeAdded);
        // const songToAddObj = songs[songIndex];
        //const songBook = new SongsBooksModel(songToAddObj, bookToAddObj, bookPage);
        if (!bookToBeAdded || !bookPage) {
            setShowAddSongBookError(true);
            return
        }
        debugger
        const data = { song: { id: songToBeAdded }, book: { id: bookToBeAdded }, page: bookPage };
        setLoading(true);
        const response = await ApiDataService.postData(ApiDataService.types.SONG_BOOK, data);
        setLoading(false);
        if (response.response) {
            const data = response.response.data;
            setShowModalAddSongBook(false);
            setShowAddSongBookError(false);
            // inorder to render it we should do setSongs appending new song setSongs(data.map((plainSong) => new SongModel(plainSong)));
            //jump to last page setPage(totalPages)
            getAfterAction();
        }
        else {
            if (response.error) {
                setShowAddSongBookError(true);
            }
        }
        // Cleaning up
        setBookToBeAdded();
        setSongToBeAdded();
        setBookPage();
    }

    async function deleteBook(songBookId) {
        console.log("Delete song book id=" + songBookId);
        debugger
        setBookToBeDeleted(songBookId);
        setShowModalRemoveSongBook(true);
        // const songToEdit = await preperForSongEdit(songId, true);
        // debugger
        // const bookToDeleteIndex = songToEdit.books.findIndex(b => b.id == bookId);
        // setBooks(songToEdit.books.slice(0, bookToDeleteIndex).concat(songToEdit.books.slice(bookToDeleteIndex + 1, songToEdit.books.length)));
    }

    async function addBook(songId) {
        console.log("Song " + songId + " going to add a new book");
        setSongToBeAdded(songId);
        setLoading(true);
        const allBookResponse = (await ApiDataService.getData(ApiDataService.types.BOOK_TITLE)).response;
        setLoading(false);
        if (allBookResponse) {
            const data = allBookResponse.data;
            debugger
            setAllBooks(data.map((plainBook) => new BookModel(plainBook)));
        }
        setShowModalAddSongBook(true);
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
                setBookToBeAdded();
                setSongToBeAdded();
                setBookPage();
                setShowModalAddSongBook(false);
                setShowAddSongBookError(false);
                break;
            case operations.UPDATE:
                setShowModalEditSong(false);
                setShowEditError(false);
                setShowModalRemoveSongBook(false);
                setSongForEdit(undefined);
                setTitle("");
                setLyrics("");
                setComposer("");
                setFirstWords("");
                setSubjectMultiSelectValues([]);
                setBooks([]);
                break;
            case operations.DELETE:
                setShowModalRemoveSong(false);
                setShowRemoveError(false);
                setSongForDel(undefined);
                setShowModalRemoveSongBook(false);
                setShowRemoveSongBookError(false);
                setBookToBeDeleted(undefined);
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

    return (
        <div className="p-home">
            <Container>
                {/* <Form>
                        {['radio'].map((type) => (
                            <div key={`inline-${type}`} className="mb-3">
                                <Form.Check
                                    inline
                                    label="?????????? ?????? ??????"
                                    name="group1"
                                    type={type}
                                    id={`inline-${type}-1`}
                                />
                                <Form.Check
                                    inline
                                    label="?????????? ?????? ??????"
                                    name="group1"
                                    type={type}
                                    id={`inline-${type}-2`}
                                />
                            </div>
                        ))}
                    </Form> */}
                <SearchBox
                    placeholder="?????????? ?????? ..."
                    searchText={searchSongText}
                    onSearchChange={debounce((data) => handleSongSearchChange(data))}
                    onEnter={handleSearchEnter}
                    results={searchBy != searchByValues.SUBJECTS ? songResults.map(result => result.title + ", " + result.lyrics + ", " + result.composer + ", " + result.firstWords) : subjectResults.map(result => result.name)}
                    onResultSelected={handleSongCheckBySearch}
                    searchBy={searchBy}
                    searchByItems={searchByDropDwon}
                    onSearchBySelect={handleSearchBySelect} />
                {/* <Filter onSearchBySelect={e => setSearchBy(e.target.value)}/>
                    icon={<i className="bi bi-music-note"></i>}
                    // <i className="bi bi-funnel-fill"></i><i className="bi bi-search"></i>
                    placeholder="?????????? ?????? ..."
                    filterText={searchSongText}
                    filterTextChange={(text) => songResults(text)}
                /> */}
                {/* {!loading && <div className="header-ruler">
                    {!loading && editable && <div className="new-song">
                        <Button variant="link" onClick={() => setShowModalNewSong(true)}><i className="bi bi-plus-circle-fill" style={{ color: 'lightskyblue' }}></i> ?????????? ?????? ?????? </Button>
                    </div>}
                    {!loading &&
                        <Header as='h4'>
                            <Header.Content>
                                {''}
                                <Dropdown
                                    inline
                                    icon='filter'
                                    options={subjectsValuesNamesFilter}
                                    defaultValue={subjectsValuesNamesFilter[0].text}
                                    onChange={(prop, data) => { getBySubject(data.value) }}
                                />
                            </Header.Content>
                        </Header>}
                </div>} */}
                {!loading && editable && <div className="new-song">
                    <Button variant="link" onClick={() => setShowModalNewSong(true)}><i className="bi bi-plus-circle-fill" style={{ color: 'lightskyblue' }}></i> ?????????? ?????? ?????? </Button>
                </div>}
                <Modal show={showModalNewSong} onHide={() => handleClose(operations.CREATE)} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>?????????? ?????? ??????</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {showSignupError ? <Alert variant="danger">?????????? ????????????!</Alert> : null}
                        <Form>
                            <Form.Group controlId="formBasicTitel">
                                <Form.Label>???? ????????</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-music-note-list"></i></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control type="text" placeholder="?????????? ???? ??????" required
                                        value={title} onChange={e => setTitle(e.target.value)} />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter email address.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicLyrics">
                                <Form.Label>??????????</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i className="bi bi-person-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control type="text" placeholder="???? ??????????"
                                        value={lyrics} onChange={e => setLyrics(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicComposer">
                                <Form.Label>??????????</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i className="bi bi-person-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="???? ??????????"
                                        value={composer} onChange={e => setComposer(e.target.value)} />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group controlId="formBasicFirstWords">
                                <Form.Label>?????????? ??????????????</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-disc-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="???????? ?????????? ?????????????? ????????"
                                        value={firstWords} onChange={e => setFirstWords(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group as={Col} controlId="subjectMultiSelectField">
                                <Form.Label>?????????? ?????????? ??????????</Form.Label>
                                <Dropdown
                                    placeholder='?????????? ??????'
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
                            ??????????
                        </Button>
                        <Button variant="primary" onClick={addSong}>
                            ??????????
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div className="p-home-cards">
                    {loading && <div className="p-home-spinner"><Spinner animation="border" variant="primary" /></div>}
                    {songsCards}
                </div>
                <Modal show={showModalRemoveSong} onHide={() => handleClose(operations.DELETE)} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>?????????? ??????</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {showRemoveError ? <Alert variant="danger">?????????? ??????????!</Alert> : null}
                        ?????? ?????????? ?????????? ???????? ???????????
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={removeSong}>
                            ????
                        </Button>
                        <Button variant="primary" onClick={() => handleClose(operations.DELETE)}>
                            ????
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showModalRemoveSongBook} onHide={() => handleClose(operations.DELETE)} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>?????????? ?????? ????????</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {showRemoveSongBookError ? <Alert variant="danger">?????????? ??????????!</Alert> : null}
                        ?????? ?????????? ?????????? ???????? ???????? ???????????
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={removeSongBook}>
                            ????
                        </Button>
                        <Button variant="primary" onClick={() => handleClose(operations.DELETE)}>
                            ????
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showModalAddSongBook} onHide={() => handleClose(operations.CREATE)} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>?????????? ?????? ????????</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {showAddSongBookError ? <Alert variant="danger">?????????? ????????????!</Alert> : null}
                        <Form>
                            <Form.Group as={Col} controlId="bookSearchSelectField">
                                <Form.Label>?????????? ?????? ????????????</Form.Label>
                                <Dropdown
                                    placeholder='?????????? ??????'
                                    fluid
                                    search
                                    selection
                                    options={allBooksNames}
                                    onChange={(props, data) => { handleBookSelect(props, data) }} />
                            </Form.Group>

                            <Form.Group controlId="formBasicPage">
                                <Form.Label>????????</Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Control required type="number" placeholder="?????????? ???????? ????????"
                                        value={bookPage} onChange={e => setBookPage(e.target.value)} />
                                    <Form.Control.Feedback type="invalid">
                                        ?????????? ???????????? ???????? ????????
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose(operations.CREATE)}>
                            ??????????
                        </Button>
                        <Button variant="primary" onClick={addSongBook}>
                            ??????????
                        </Button>
                    </Modal.Footer>
                </Modal>


                <Modal show={showModalEditSong} onHide={() => handleClose(operations.UPDATE)} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>?????????? ??????</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {showEditError ? <Alert variant="danger">?????????? ????????????</Alert> : null}
                        <Form>
                            <Form.Group controlId="formBasicTitle">
                                <Form.Label>????</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-music-note-list"></i></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control type="text" placeholder="?????????? ???? ????????" required
                                        value={title} onChange={e => setTitle(e.target.value)} />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter a song title.
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicLyrics">
                                <Form.Label>??????????</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i className="bi bi-person-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="???? ????????????"
                                        value={lyrics} onChange={e => setLyrics(e.target.value)} />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group controlId="formBasicComposer">
                                <Form.Label>??????????</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i className="bi bi-person-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="???? ????????????"
                                        value={composer} onChange={e => setComposer(e.target.value)} />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group controlId="formBasicFirstWords">
                                <Form.Label>?????????? ??????????????</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-disc-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="3 ?????????? ?????????????? ????????"
                                        value={firstWords} onChange={e => setFirstWords(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group as={Col} controlId="subjectMultiSelectField">
                                <Form.Label>?????????? ?????????? ??????????</Form.Label>
                                <Dropdown
                                    placeholder='?????????? ??????'
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
                            ??????????
                        </Button>
                        <Button variant="primary" onClick={editSong}>
                            ?????????? ??????????????
                        </Button>
                    </Modal.Footer>
                </Modal>
                {!loading && totalPages > 0 && <Pagination className="p-2"
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