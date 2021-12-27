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

    const booksCards = books !== undefined ? books.map((book, index) => <BookCard key={index.toString()} book={book} isEditable={editable} onDelete={preperFotBookDelete} onEdit={preperForBookEdit} onSongDelete={deleteSong} onSongAdd={addSong}></BookCard>) : [];

    async function handleBookSearchChange(newSearchText) {
        setSearchBookText(newSearchText);

        if (newSearchText && newSearchText.length > 3) {
            setLoading(true);
            const response = await ApiDataService.getData(ApiDataService.types.BOOK, undefined, 5000, newSearchText);
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

    function handleSearchEnter() {
        debugger
        setSearchBookText("");
        setBooks(bookResults.map((plainBook) => new BookModel(plainBook)));
        setBookResults([]);
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
        debugger
        const data = { song: { id: songToBeAdded }, book: { id: bookToBeAdded }, page: bookPage };
        setLoading(true);
        const response = await ApiDataService.postData(ApiDataService.types.SONG_BOOK, data);
        setLoading(false);
        if (response.response) {
            const data = response.response.data;
            setShowModalAddBookSong(false);
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
        const allSongResponse = (await ApiDataService.getData(ApiDataService.types.SONG, undefined, 50000)).response;
        setLoading(false);
        if (allSongResponse) {
            const data = allSongResponse.data.content;
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
                    placeholder="חיפוש ספר ..."
                    searchText={searchBookText}
                    onSearchChange={handleBookSearchChange}
                    onEnter={handleSearchEnter}
                    results={bookResults.map(result => result.title)}
                    onResultSelected={handleBookCheckBySearch} />
                {/* <Filter
                    icon={<i className="bi bi-music-note"></i>}
                    // <i className="bi bi-funnel-fill"></i><i className="bi bi-search"></i>
                    placeholder="חיפוש שיר ..."
                    filterText={searchBookText}
                    filterTextChange={(text) => bookResults(text)}
                /> */}
                {!loading && editable && <div className="new-book">
                    <Button variant="link" onClick={() => setShowModalNewBook(true)}><i className="bi bi-plus-circle-fill" style={{ color: 'lightskyblue' }}></i> הוספת ספר חדש </Button>
                </div>}
                <Modal show={showModalNewBook} onHide={() => handleClose(operations.CREATE)} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>הוספת ספר חדש</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {showSignupError ? <Alert variant="danger">שגיאה בהוספה!</Alert> : null}
                        <Form>
                            <Form.Group controlId="formBasicTitel">
                                <Form.Label>שם הספר</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-book-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control type="text" placeholder="הכנסת שם ספר" required
                                        value={title} onChange={e => setTitle(e.target.value)} />
                                    <Form.Control.Feedback type="invalid">
                                        אנא להכניס שם ספר
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicSubTitle">
                                <Form.Label>תת כותרת</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-book-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control type="text" placeholder="תת כותרת"
                                        value={subTitle} onChange={e => setSubTitle(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicAuthor">
                                <Form.Label>מחבר</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i className="bi bi-person-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="שם מחבר"
                                        value={author} onChange={e => setAuthor(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicSeries">
                                <Form.Label>סדרה</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-stack"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="סדרה"
                                        value={series} onChange={e => setSeries(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicPublisher">
                                <Form.Label>הוצאה לאור</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-file-earmark-ppt-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="הוצאת לאור"
                                        value={publisher} onChange={e => setPublisher(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicPublishPlace">
                                <Form.Label>מקום הוצאה לאור</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-geo-alt-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="מקום הוצאה לאור"
                                        value={publishPlace} onChange={e => setPublishPlace(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicPublishYear">
                                <Form.Label>שנת הוצאה לאור</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-calendar-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="שנת הוצאה לאור"
                                        value={publishYear} onChange={e => setPublishYear(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicMmsid">
                                <Form.Label>מספר מערכת</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-123"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="מספר מערכת"
                                        value={mmsid} onChange={e => setMmsid(e.target.value)} />
                                </InputGroup>
                            </Form.Group>
                            {/* <Form.Group controlId="formBasicIsInPrivateCollection">
                                <Form.Label>האם באוסף פרטי</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-lock-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="האם נמצא באוסף פרטי?"
                                        value={isInPrivateCollection} onChange={e => setIsInPrivateCollection(e.target.value)} />
                                </InputGroup>
                            </Form.Group> */}
                            <Form.Group className="mb-3" controlId="formGridCheckbox">
                                <Form.Check type="checkbox" label="אוסף פרטי" value={isInPrivateCollection ? "Yes" : "No"} checked={isInPrivateCollection} onChange={e => setIsInPrivateCollection(e.target.checked)} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose(operations.CREATE)}>
                            סגירה
                        </Button>
                        <Button variant="primary" onClick={addBook}>
                            שמירה
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div className="p-book-cards">
                    {loading && <div className="p-book-spinner"><Spinner animation="border" variant="primary" /></div>}
                    {booksCards}
                </div>
                <Modal show={showModalRemoveBook} onHide={() => handleClose(operations.DELETE)} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>מחיקת ספר</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {showRemoveError ? <Alert variant="danger">שגיאה בהסרה!</Alert> : null}
                        האם פעולת מחיקת הספר רצויה?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={removeBook}>
                            כן
                        </Button>
                        <Button variant="primary" onClick={() => handleClose(operations.DELETE)}>
                            לא
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showModalRemoveBookSong} onHide={() => handleClose(operations.DELETE)} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>מחיקת שיר לספר</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {showRemoveBookSongError ? <Alert variant="danger">שגיאה בהסרה!</Alert> : null}
                        האם פעולת מחיקת השיר לספר רצויה?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={removeBookSong}>
                            כן
                        </Button>
                        <Button variant="primary" onClick={() => handleClose(operations.DELETE)}>
                            לא
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showModalAddBookSong} onHide={() => handleClose(operations.CREATE)} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>הוספת שיר לספר</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {showAddBookSongError ? <Alert variant="danger">שגיאה בהוספה!</Alert> : null}
                        <Form>
                            <Form.Group as={Col} controlId="bookSearchSelectField">
                                <Form.Label>בחירת שיר להוספה</Form.Label>
                                <Dropdown
                                    placeholder='בחירת שיר'
                                    fluid
                                    search
                                    selection
                                    options={allSongsNames}
                                    onChange={(props, data) => { handleSongSelect(props, data) }} />
                            </Form.Group>

                            <Form.Group controlId="formBasicPage">
                                <Form.Label>עמוד</Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Control type="number" placeholder="הכנסת מספר עמוד"
                                        value={bookPage} onChange={e => setBookPage(e.target.value)} />
                                </InputGroup>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose(operations.CREATE)}>
                            סגירה
                        </Button>
                        <Button variant="primary" onClick={addBookSong}>
                            שמירה
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showModalEditBook} onHide={() => handleClose(operations.UPDATE)} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>עריכת ספר</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {showEditError ? <Alert variant="danger">שגיאה בעדכון</Alert> : null}
                        <Form>
                            <Form.Group controlId="formBasicTitle">
                                <Form.Label>שם הספר</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-book-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control type="text" placeholder="הכנסת שם הספר" required
                                        value={title} onChange={e => setTitle(e.target.value)} />
                                    <Form.Control.Feedback type="invalid">
                                        בבקשה להכניס שם ספר
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicSubTitle">
                                <Form.Label>תת כותרת</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-book-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control type="text" placeholder="תת כותרת"
                                        value={subTitle} onChange={e => setSubTitle(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicAuthor">
                                <Form.Label>מחבר</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i className="bi bi-person-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="שם מחבר"
                                        value={author} onChange={e => setAuthor(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicSeries">
                                <Form.Label>סדרה</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-stack"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="סדרה"
                                        value={series} onChange={e => setSeries(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicPublisher">
                                <Form.Label>הוצאה לאור</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-file-earmark-ppt-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="הוצאת לאור"
                                        value={publisher} onChange={e => setPublisher(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicPublishPlace">
                                <Form.Label>מקום הוצאה לאור</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-geo-alt-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="מקום הוצאה לאור"
                                        value={publishPlace} onChange={e => setPublishPlace(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicPublishYear">
                                <Form.Label>שנת הוצאה לאור</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-calendar-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="שנת הוצאה לאור"
                                        value={publishYear} onChange={e => setPublishYear(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formBasicMmsid">
                                <Form.Label>מספר מערכת</Form.Label>
                                <InputGroup className="mb-3">
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-book-fill"></i></InputGroup.Text>
                                    </InputGroup.Prepend>

                                    <Form.Control type="text" placeholder="מספר מערכת"
                                        value={mmsid} onChange={e => setMmsid(e.target.value)} />
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-3" id="formGridCheckbox">
                                <Form.Check type="checkbox" label="אוסף פרטי" value={isInPrivateCollection ? "Yes" : "No"} checked={isInPrivateCollection} onChange={e => setIsInPrivateCollection(e.target.checked)} />
                            </Form.Group>

                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose(operations.UPDATE)}>
                            סגירה
                        </Button>
                        <Button variant="primary" onClick={editBook}>
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

export default BookPage;