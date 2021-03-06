import { useState, useEffect, lazy } from 'react';
import { Container, Form, InputGroup, Modal, Alert, Button, Spinner, Col } from "react-bootstrap";
import SearchBox from "../../components/SearchBox/SearchBox";
import { Dropdown } from 'semantic-ui-react'
import BookCard from "../../components/BookCard/BookCard";
import BookModel from '../../model/BookModel';
import { Pagination } from 'semantic-ui-react';
import './BookPage.css';
import ApiDataService from '../../utils/ApiDataService';
import SongModel from '../../model/SongModel';

function BookPage({ activeUser }) {
    const [books, setBooks] = useState();
    const [searchBookText, setSearchBookText] = useState("");
    const [bookResults, setBookResults] = useState([]);
    const [showModalNewBook, setShowModalNewBook] = useState(false);
    const [showModalEditBook, setShowModalEditBook] = useState(false);
    const [showModalRemoveBook, setShowModalRemoveBook] = useState(false);
    const [showModalRemoveBookSong, setShowModalRemoveBookSong] = useState(false);
    const [showModalAddBookSong, setShowModalAddBookSong] = useState(false);
    const [showSignupError, setShowSignupError] = useState(false)
    const [showRemoveError, setShowRemoveError] = useState(false);
    const [showEditError, setShowEditError] = useState(false);
    const [showRemoveBookSongError, setShowRemoveBookSongError] = useState(false);
    const [showAddBookSongError, setShowAddBookSongError] = useState(false);
    const [title, setTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [series, setSeries] = useState("");
    const [publisher, setPublisher] = useState("");
    const [publishPlace, setPublishPlace] = useState("");
    const [publishYear, setPublishYear] = useState("");
    const [mmsid, setMmsid] = useState("");
    const [isInPrivateCollection, setIsInPrivateCollection] = useState(false);
    const searchByValues = {
        TITLE: 'title',
        SUB_TITLE: 'subTitle',
        AUTHOR: 'author',
        SERIES: 'series',
        PUBLISHER: 'publisher',
        PUBLISH_PLACE: 'publishPlace',
        PUBLISH_YEAR: 'publishYear',
        MMSID: 'mmsid'
    }
    const [searchBy, setSearchBy] = useState(searchByValues.TITLE);
    const searchByDropDwon = [
        { key: 'title', text: '  ???? ????????', value: searchByValues.TITLE, label: <i class="bi bi-book-fill"></i> },
        { key: 'subTitle', text: '  ???? ??????????', value: searchByValues.SUB_TITLE, label: <i class="bi bi-book-fill"></i> },
        { key: 'author', text: '  ????????', value: searchByValues.AUTHOR, label: <i className="bi bi-person-fill"></i> },
        { key: 'series', text: '   ????????', value: searchByValues.SERIES, label: <i class="bi bi-stack"></i> },
        { key: 'publisher', text: '   ?????????? ????????', value: searchByValues.PUBLISHER, label: <i class="bi bi-file-earmark-ppt-fill"></i> },
        { key: 'publishPlace', text: '   ???????? ?????????? ????????', value: searchByValues.PUBLISH_PLACE, label: <i class="bi bi-geo-alt-fill"></i> }, 
        { key: 'publishYear', text: '   ?????? ?????????? ????????', value: searchByValues.PUBLISH_YEAR, label: <i class="bi bi-calendar-fill"></i> },
        { key: 'mmsid', text: '   ???????? ??????????', value: searchByValues.MMSID, label: <i class="bi bi-book-fill"></i> }
    ]
    const [allSongs, setAllSongs] = useState([]);
    const allSongsNames = allSongs.map((song, index) => (
        { key: song.id, text: song.title, value: song.id }
    ));
    const [songs,setSongs] = useState([]);
    const [songToBeDeleted, setSongToBeDeleted] = useState();
    const [bookPage, setBookPage] = useState();
    const [songToBeAdded, setSongToBeAdded] = useState();
    const [bookToBeAdded, setBookToBeAdded] = useState();
    const [bookForDel, setBookForDel] = useState(undefined);
    const [bookForEdit, setBookForEdit] = useState(undefined);
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
            const response = (await ApiDataService.getData(ApiDataService.types.BOOK, page)).response;
            setLoading(false);
            if (response) {
                const data = response.data.content;
                console.log(data);
                setTotalPages(response.data.totalPages);
                setBooks(data.map((plainBook) => new BookModel(plainBook)));
            }
        })()
    }, [])

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
        setBookResults(data);
    }

    const processChange = debounce((data) => updateResults(data));

    const booksCards = books !== undefined ? books.map((book, index) => <BookCard key={index.toString()} book={book} isEditable={editable} onDelete={preperFotBookDelete} onEdit={preperForBookEdit} onSongDelete={deleteSong} onSongAdd={addSong}></BookCard>) : [];

    async function handleBookSearchChange(newSearchText) {
        setSearchBookText(newSearchText);

        if (newSearchText && newSearchText.length > 3) {
            setLoading(true);
            const response = await ApiDataService.getData(ApiDataService.types.BOOK, undefined, 5000, newSearchText, searchBy);
            setLoading(false);
            if (response.error) {
                setGlobalError(true);
            }
            else {
                if (response.response) {
                    const data = response.response.data.content;
                    setBookResults(data);
                }
            }
        } else {
            setBookResults([]);
        }
    }

    function handleBookCheckBySearch(result) {
        debugger
        setSearchBookText("");
        setBooks(bookResults.filter((plainBook, index) => index == result).map((plainBook) => new BookModel(plainBook)));
        setBookResults([]);
    }

    async function handleSearchEnter() {
        debugger
        if (searchBookText.length <= 3 && searchBookText.length > 0) {
            setLoading(true);
            const response = await ApiDataService.getData(ApiDataService.types.BOOK, undefined, 5000, searchBookText, searchBy);
            setLoading(false);
            if (response.error) {
                setGlobalError(true);
            }
            else {
                if (response.response) {
                    const data = response.response.data.content;
                    //processChange(data);
                    setBooks(data.map((plainSong) => new BookModel(plainSong)));
                    setTotalPages(0);
                }
            }
        } else {
            setSearchBookText("");
            setBooks(bookResults.map((plainBook) => new BookModel(plainBook)));
            setBookResults([]);
        }
    }

    function handleSearchBySelect(searchBySelect) {
        setBookResults([]);
        setSearchBy(searchBySelect.value);
        setTotalPages(0);
    }

    async function getAfterAction() {
        //should do setBooks inorder to render
        setLoading(true);
        const response = (await ApiDataService.getData(ApiDataService.types.BOOK, page, undefined)).response;
        setLoading(false);
        if (response) {
            const data = response.data.content;
            setTotalPages(response.data.totalPages);
            setBooks(data.map((plainBook) => new BookModel(plainBook)));
        }
    }

    async function addBook() {
        // validation code is missing here...
        debugger
        const data = { title: title, subTitle: subTitle, author: author, series: series, publisher: publisher, publishPlace: publishPlace, publishYear: publishYear, mmsid: mmsid, isInPrivateCollection: isInPrivateCollection ? 1 : 0 };
        debugger
        setLoading(true);
        const response = await ApiDataService.postData(ApiDataService.types.BOOK, data);
        setLoading(false);
        if (response.response) {
            const data = response.response.data;
            setShowModalNewBook(false);
            // inorder to render it we should do setBooks appending new book setBooks(data.map((plainBook) => new BookModel(plainBook)));
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
        setSubTitle("");
        setAuthor("");
        setSeries("");
        setPublisher("");
        setPublishPlace("");
        setPublishYear("");
        setMmsid("");
        setIsInPrivateCollection(false);
    }

    async function removeBook() {
        //e.preventDefault();
        console.log("book to be deleted " + bookForDel)
        setLoading(true);
        const bookToRemove = await ApiDataService.deleteData(ApiDataService.types.BOOK, bookForDel);
        setLoading(false);
        if (bookToRemove.error) {
            setShowRemoveError(true);
        }
        else {
            setShowModalRemoveBook(false);
            getAfterAction();
        }
    }

    async function editBook() {
        const data = { title: title, subTitle: subTitle, author: author, series: series, publisher: publisher, publishPlace: publishPlace, publishYear: publishYear, mmsid: mmsid, isInPrivateCollection: isInPrivateCollection ? 1 : 0, songs: songs };
        setLoading(true);
        debugger
        const bookToUpdate = await ApiDataService.putData(ApiDataService.types.BOOK, bookForEdit, data);
        setLoading(false);
        if (bookToUpdate.error) {
            setShowEditError(true);
        }
        else {
            handleClose(operations.UPDATE);
            //should do setBooks inorder to render
            getAfterAction();
        }
    }

    async function removeBookSong() {
        console.log("song to be deleted " + songToBeDeleted)
        setLoading(true);
        const bookSongToRemove = await ApiDataService.deleteData(ApiDataService.types.SONG_BOOK, songToBeDeleted);
        setLoading(false);
        if (bookSongToRemove.error) {
            setShowRemoveBookSongError(true);
        }
        else {
            setShowModalRemoveBookSong(false);
            getAfterAction();
        }
    }

    async function preperForBookEdit(id) {
        setLoading(true);
        const response = await ApiDataService.getDataById(ApiDataService.types.BOOK, id);
        setLoading(false);
        if (response.error) {
            setShowEditError(true);
        }
        else {
            debugger
            const bookToEdit = response.response.data;
            setTitle(bookToEdit.title);
            setSubTitle(bookToEdit.subTitle);
            setAuthor(bookToEdit.author);
            setSeries(bookToEdit.series);
            setPublisher(bookToEdit.publisher);
            setPublishPlace(bookToEdit.publishPlace);
            setPublishYear(bookToEdit.publishYear);
            setMmsid(bookToEdit.mmsid);
            setIsInPrivateCollection(bookToEdit.isInPrivateCollection == 1 ? true : false);
            setSongs(bookToEdit.songs);
            setBookForEdit(id);
            setShowModalEditBook(true);
            return bookToEdit;
        }
    }

    function preperFotBookDelete(id) {
        setBookForDel(id);
        setShowModalRemoveBook(true);
    }

    function handleSongSelect(props, data) {
        debugger
        console.log(props);
        console.log(data);
        setSongToBeAdded(data.value);
    }

    async function addBookSong() {
        // const songIndex = allSongs.findIndex(s => s.id == songToBeAdded);
        // const songToAddObj = allSongs[songIndex];
        // const bookIndex = books.findIndex(b => b.id == bookToBeAdded);
        // const bookToAddObj = books[bookIndex];
        //const songBook = new SongsBooksModel(songToAddObj, bookToAddObj, bookPage);
        if (!songToBeAdded || !bookPage) {
            setShowAddBookSongError(true);
            return
        }
        const data = { song: { id: songToBeAdded }, book: { id: bookToBeAdded }, page: bookPage };
        setLoading(true);
        const response = await ApiDataService.postData(ApiDataService.types.SONG_BOOK, data);
        setLoading(false);
        if (response.response) {
            const data = response.response.data;
            setShowModalAddBookSong(false);
            setShowAddBookSongError(false);
            // inorder to render it we should do setSongs appending new song setSongs(data.map((plainSong) => new SongModel(plainSong)));
            //jump to last page setPage(totalPages)
            getAfterAction();
        }
        else {
            if (response.error) {
                setShowAddBookSongError(true);
            }
        }
        // Cleaning up
        setBookToBeAdded();
        setSongToBeAdded();
        setBookPage();
    }

    async function deleteSong(bookSongId) {
        console.log("Delete book song id=" + bookSongId);
        debugger
        setSongToBeDeleted(bookSongId);
        setShowModalRemoveBookSong(true);
        // const bookToEdit = await preperForBookEdit(bookId, true);
        // const songToDeleteIndex = bookToEdit.songs.findIndex(s => s.song.id == songId);
        // setSongs(bookToEdit.songs.slice(0, songToDeleteIndex).concat(bookToEdit.songs.slice(songToDeleteIndex + 1, bookToEdit.songs.length)));
        // setShowModalRemoveBookSong(true);
        // getAfterAction();
        // setBooks(books => books.slice(0, bookToDeleteIndex).concat(books.slice(bookToDeleteIndex + 1, books.length)));
        //editSong();
    }

    async function addSong(bookId) {
        console.log("Book " + bookId + " going to add a new song");
        setBookToBeAdded(bookId);
        setLoading(true);
        const allSongResponse = (await ApiDataService.getData(ApiDataService.types.SONG_TITLE)).response;
        setLoading(false);
        if (allSongResponse) {
            const data = allSongResponse.data;
            debugger
            setAllSongs(data.map((plainSong) => new SongModel(plainSong)));
        }
        setShowModalAddBookSong(true);
    }

    function handleClose(operation) {
        switch (operation) {
            case operations.CREATE:
                setShowModalNewBook(false);
                setShowSignupError(false);//Clear also errors
                setTitle("");
                setSubTitle("");
                setAuthor("");
                setSeries("");
                setPublisher("");
                setPublishPlace("");
                setPublishYear("");
                setMmsid("");
                setIsInPrivateCollection(false);
                setBookToBeAdded();
                setSongToBeAdded();
                setBookPage();
                setShowModalAddBookSong(false);
                setShowAddBookSongError(false);
                break;
            case operations.UPDATE:
                setShowModalEditBook(false);
                setShowEditError(false);
                setShowModalRemoveBookSong(false);
                setBookForEdit(undefined);
                setTitle("");
                setSubTitle("");
                setAuthor("");
                setSeries("");
                setPublisher("");
                setPublishPlace("");
                setPublishYear("");
                setMmsid("");
                setIsInPrivateCollection(false);
                setSongs([]);
                break;
            case operations.DELETE:
                setShowModalRemoveBook(false);
                setShowRemoveError(false);
                setBookForDel(undefined);
                setShowModalRemoveBookSong(false);
                setShowRemoveBookSongError(false);
                setSongToBeDeleted(undefined);
                break;
        }
    }

    async function handlePaginationChange(e, activePage) {
        setLoading(true);
        const response = (await ApiDataService.getData(ApiDataService.types.BOOK, activePage.activePage)).response;
        setLoading(false);
        if (response) {
            const data = response.data.content;
            setTotalPages(response.data.totalPages);
            setPage(activePage.activePage);
            setBooks(data.map((plainBook) => new BookModel(plainBook)));
        }
    }

    return (
        <div className="p-book">
            <Container>
                <SearchBox
                    placeholder="?????????? ?????? ..."
                    searchText={searchBookText}
                    onSearchChange={debounce((data) => handleBookSearchChange(data))}
                    onEnter={handleSearchEnter}
                    results={bookResults.map(result => result.title)}
                    onResultSelected={handleBookCheckBySearch} 
                    searchBy={searchBy}
                    searchByItems={searchByDropDwon}
                    onSearchBySelect={handleSearchBySelect}/>
                {/* <Filter
                    icon={<i className="bi bi-music-note"></i>}
                    // <i className="bi bi-funnel-fill"></i><i className="bi bi-search"></i>
                    placeholder="?????????? ?????? ..."
                    filterText={searchBookText}
                    filterTextChange={(text) => bookResults(text)}
                /> */}
                {!loading && editable && <div className="new-book">
                    <Button variant="link" onClick={() => setShowModalNewBook(true)}><i className="bi bi-plus-circle-fill" style={{ color: 'lightskyblue' }}></i> ?????????? ?????? ?????? </Button>
                </div>}
                <Modal show={showModalNewBook} onHide={() => handleClose(operations.CREATE)} backdrop="static" keyboard={false}>
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
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-book-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control type="text" placeholder="?????????? ???? ??????" required
                                        value={title} onChange={e => setTitle(e.target.value)} />
                                    <Form.Control.Feedback type="invalid">
                                        ?????? ???????????? ???? ??????
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicSubTitle">
                                <Form.Label>???? ??????????</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-book-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control type="text" placeholder="???? ??????????"
                                        value={subTitle} onChange={e => setSubTitle(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicAuthor">
                                <Form.Label>????????</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i className="bi bi-person-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="???? ????????"
                                        value={author} onChange={e => setAuthor(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicSeries">
                                <Form.Label>????????</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-stack"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="????????"
                                        value={series} onChange={e => setSeries(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicPublisher">
                                <Form.Label>?????????? ????????</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-file-earmark-ppt-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="?????????? ????????"
                                        value={publisher} onChange={e => setPublisher(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicPublishPlace">
                                <Form.Label>???????? ?????????? ????????</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-geo-alt-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="???????? ?????????? ????????"
                                        value={publishPlace} onChange={e => setPublishPlace(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicPublishYear">
                                <Form.Label>?????? ?????????? ????????</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-calendar-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="?????? ?????????? ????????"
                                        value={publishYear} onChange={e => setPublishYear(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicMmsid">
                                <Form.Label>???????? ??????????</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-123"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="???????? ??????????"
                                        value={mmsid} onChange={e => setMmsid(e.target.value)} />
                                </InputGroup>
                            </Form.Group>
                            {/* <Form.Group controlId="formBasicIsInPrivateCollection">
                                <Form.Label>?????? ?????????? ????????</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-lock-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="?????? ???????? ?????????? ?????????"
                                        value={isInPrivateCollection} onChange={e => setIsInPrivateCollection(e.target.value)} />
                                </InputGroup>
                            </Form.Group> */}
                            <Form.Group className="mb-3" controlId="formGridCheckbox">
                                <Form.Check type="checkbox" label="???????? ????????" value={isInPrivateCollection ? "Yes" : "No"} checked={isInPrivateCollection} onChange={e => setIsInPrivateCollection(e.target.checked)} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose(operations.CREATE)}>
                            ??????????
                        </Button>
                        <Button variant="primary" onClick={addBook}>
                            ??????????
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div className="p-book-cards">
                    {loading && <div className="p-book-spinner"><Spinner animation="border" variant="primary" /></div>}
                    {booksCards}
                </div>
                <Modal show={showModalRemoveBook} onHide={() => handleClose(operations.DELETE)} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>?????????? ??????</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {showRemoveError ? <Alert variant="danger">?????????? ??????????!</Alert> : null}
                        ?????? ?????????? ?????????? ???????? ???????????
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={removeBook}>
                            ????
                        </Button>
                        <Button variant="primary" onClick={() => handleClose(operations.DELETE)}>
                            ????
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showModalRemoveBookSong} onHide={() => handleClose(operations.DELETE)} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>?????????? ?????? ????????</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {showRemoveBookSongError ? <Alert variant="danger">?????????? ??????????!</Alert> : null}
                        ?????? ?????????? ?????????? ???????? ???????? ???????????
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={removeBookSong}>
                            ????
                        </Button>
                        <Button variant="primary" onClick={() => handleClose(operations.DELETE)}>
                            ????
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showModalAddBookSong} onHide={() => handleClose(operations.CREATE)} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>?????????? ?????? ????????</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {showAddBookSongError ? <Alert variant="danger">?????????? ????????????!</Alert> : null}
                        <Form>
                            <Form.Group as={Col} controlId="bookSearchSelectField">
                                <Form.Label>?????????? ?????? ????????????</Form.Label>
                                <Dropdown
                                    placeholder='?????????? ??????'
                                    fluid
                                    search
                                    selection
                                    options={allSongsNames}
                                    onChange={(props, data) => { handleSongSelect(props, data) }} />
                            </Form.Group>

                            <Form.Group controlId="formBasicPage">
                                <Form.Label>????????</Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Control type="number" placeholder="?????????? ???????? ????????"
                                        value={bookPage} onChange={e => setBookPage(e.target.value)} />
                                </InputGroup>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose(operations.CREATE)}>
                            ??????????
                        </Button>
                        <Button variant="primary" onClick={addBookSong}>
                            ??????????
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showModalEditBook} onHide={() => handleClose(operations.UPDATE)} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>?????????? ??????</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {showEditError ? <Alert variant="danger">?????????? ????????????</Alert> : null}
                        <Form>
                            <Form.Group controlId="formBasicTitle">
                                <Form.Label>???? ????????</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-book-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control type="text" placeholder="?????????? ???? ????????" required
                                        value={title} onChange={e => setTitle(e.target.value)} />
                                    <Form.Control.Feedback type="invalid">
                                        ?????????? ???????????? ???? ??????
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicSubTitle">
                                <Form.Label>???? ??????????</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-book-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control type="text" placeholder="???? ??????????"
                                        value={subTitle} onChange={e => setSubTitle(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicAuthor">
                                <Form.Label>????????</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i className="bi bi-person-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="???? ????????"
                                        value={author} onChange={e => setAuthor(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicSeries">
                                <Form.Label>????????</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-stack"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="????????"
                                        value={series} onChange={e => setSeries(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicPublisher">
                                <Form.Label>?????????? ????????</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-file-earmark-ppt-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="?????????? ????????"
                                        value={publisher} onChange={e => setPublisher(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicPublishPlace">
                                <Form.Label>???????? ?????????? ????????</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-geo-alt-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="???????? ?????????? ????????"
                                        value={publishPlace} onChange={e => setPublishPlace(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicPublishYear">
                                <Form.Label>?????? ?????????? ????????</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-calendar-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="?????? ?????????? ????????"
                                        value={publishYear} onChange={e => setPublishYear(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicMmsid">
                                <Form.Label>???????? ??????????</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-book-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="???????? ??????????"
                                        value={mmsid} onChange={e => setMmsid(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-3" id="formGridCheckbox">
                                <Form.Check type="checkbox" label="???????? ????????" value={isInPrivateCollection ? "Yes" : "No"} checked={isInPrivateCollection} onChange={e => setIsInPrivateCollection(e.target.checked)} />
                            </Form.Group>

                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose(operations.UPDATE)}>
                            ??????????
                        </Button>
                        <Button variant="primary" onClick={editBook}>
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

export default BookPage;