import { useState, useEffect } from 'react';
import { Container, Form, InputGroup, Modal, Alert, Button, Spinner } from "react-bootstrap";
import SearchBox from "../../components/SearchBox/SearchBox";
import SubjectCard from "../../components/SubjectCard/SubjectCard";
import SubjectModel from '../../model/SubjectModel';
import { Pagination } from 'semantic-ui-react';
import './SubjectPage.css';
import ApiDataService from '../../utils/ApiDataService';
import { Redirect } from 'react-router';

function SubjectPage({ activeUser }) {
    const [subjects, setSubjects] = useState();
    const [searchSubjectText, setSearchSubjectText] = useState("");
    const [subjectResults, setSubjectResults] = useState([]);
    const [showModalNewSubject, setShowModalNewSubject] = useState(false);
    const [showModalEditSubject, setShowModalEditSubject] = useState(false);
    const [showModalRemoveSubject, setShowModalRemoveSubject] = useState(false);
    const [showSignupError, setShowSignupError] = useState(false)
    const [showRemoveError, setShowRemoveError] = useState(false);
    const [showEditError, setShowEditError] = useState(false);
    const [name, setName] = useState("");
    const [subjectForDel, setSubjectForDel] = useState(undefined);
    const [subjectForEdit, setSubjectForEdit] = useState(undefined);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [boundaryRange, setBoundaryRange] = useState(1);
    const [loading, setLoading] = useState(false);
    const [globalError, setGlobalError] = useState(false);
    let editable = true;

    const operations = {
        CREATE: "create",
        UPDATE: "update",
        DELETE: "delete"
    }

    const searchByValues = {
        SUBJECTS: 'subjects'
    }

    useEffect(() => {
        (async () => {
            setLoading(true);
            const response = (await ApiDataService.getData(ApiDataService.types.SUBJECT, page)).response;
            setLoading(false);
            if (response) {
                const data = response.data.content;
                console.log(data);
                setTotalPages(response.data.totalPages);
                setSubjects(data.map((plainSubject) => new SubjectModel(plainSubject)));
            }
        })()
    }, [])

    if (!activeUser || activeUser.role != 0) {
        return <Redirect to="/" />
    }

    const subjectsCards = subjects !== undefined ? subjects.map((subject, index) => <SubjectCard key={index.toString()} subject={subject} isEditable={editable} onDelete={preperFotSubjectDelete} onEdit={preperForSubjectEdit}></SubjectCard>) : [];

    async function handleSubjectSearchChange(newSearchText) {
        setSearchSubjectText(newSearchText);

        if (newSearchText) {
            setLoading(true);
            const response = await ApiDataService.getData(ApiDataService.types.SUBJECT, undefined, 5000, newSearchText, searchByValues.SUBJECTS);
            setLoading(false);
            if (response.error) {
                setGlobalError(true);
            }
            else {
                if (response.response) {
                    const data = response.response.data.content;
                    setSubjectResults(data);
                }
            }
        } else {
            setSubjectResults([]);
        }
    }

    function handleSubjectCheckBySearch(result) {
        debugger
        setSearchSubjectText("");
        setSubjects(subjectResults.filter((plainSubject, index) => index==result).map((plainSubject) => new SubjectModel(plainSubject)));
        setSubjectResults([]);
    }

    function handleSearchEnter() {
        debugger
        setSearchSubjectText("");
        setSubjects(subjectResults.map((plainSubject) => new SubjectModel(plainSubject)));
        setSubjectResults([]);
    }

    // function addSubject(resultIndex) {
    //     //Get more info of actor
    //     // const subjectId = subjectResults[resultIndex].id;
    //     // const getURL = "https://api.themoviedb.org/3/movie/" + subjectId + "?api_key=c87aac96194f8ffb8edc34a066fa92de&language=en-US";
    //     // axios.get(getURL).then(response => {
    //     //     const subjectToAdd = response.data;
    //     //     // Adding the movie to the view
    //     //     setSubjects(subjects.concat(new SubjectModel(subjectToAdd.name, subjectToAdd.runtime, "bla bla", subjectToAdd.vote_average, subjectToAdd.overview, "https://image.tmdb.org/t/p/w500" + subjectToAdd.poster_path, subjectToAdd.homepage)));

    //     //     // Cleaning up the SearchBox
    //     //     setSubjectResults([]);
    //     //     setSearchSubjectText("");
    //     // });
    // }

    async function addSubject() {
        // validation code is missing here...
        const data = { name: name};
        setLoading(true);
        const response = await ApiDataService.postData(ApiDataService.types.SUBJECT, data);
        setLoading(false);
        if (response.response) {
            const data = response.response.data;
            setShowModalNewSubject(false);
            // inorder to render it we should do setSubjects appending new subject setSubjects(data.map((plainSubject) => new SubjectModel(plainSubject)));
            //jump to last page setPage(totalPages)
        }
        else {
            if (response.error) {
                setShowSignupError(true);
            }
        }
        // Cleaning up
        setName("");
    }

    async function removeSubject() {
        //e.preventDefault();
        console.log("subject to be deleted " + subjectForDel)
        setLoading(true);
        const subjectToRemove = await ApiDataService.deleteData(ApiDataService.types.SUBJECT, subjectForDel);
        setLoading(false);
        if (subjectToRemove.error) {
            setShowRemoveError(true);
        }
        else {
            setShowModalRemoveSubject(false);
        }
    }

    async function editSubject() {
        const data = { name: name};
        setLoading(true);
        const subjectToUpdate = await ApiDataService.putData(ApiDataService.types.SUBJECT, subjectForEdit, data);
        setLoading(false);
        if (subjectToUpdate.error) {
            setShowEditError(true);
        }
        else {
            handleClose(operations.UPDATE);
            //should do setSubjects inorder to render
        }
    }

    async function preperForSubjectEdit(id) {
        setLoading(true);
        const response = await ApiDataService.getDataById(ApiDataService.types.SUBJECT, id);
        setLoading(false);
        if (response.error) {
            setShowEditError(true);
        }
        else {
            const subjectToEdit = response.response.data;
            setName(subjectToEdit.name);
            setSubjectForEdit(id);
            setShowModalEditSubject(true);
        }
    }

    function preperFotSubjectDelete(id) {
        setSubjectForDel(id);
        setShowModalRemoveSubject(true);
    }

    function handleClose(operation) {
        switch (operation) {
            case operations.CREATE:
                setShowModalNewSubject(false);
                setShowSignupError(false);//Clear also errors
                setName("");
                break;
            case operations.UPDATE:
                setShowModalEditSubject(false);
                setShowEditError(false);
                setSubjectForEdit(undefined);
                setName("");
                break;
            case operations.DELETE:
                setShowModalRemoveSubject(false);
                setShowRemoveError(false);
                setSubjectForDel(undefined);
                break;
        }
    }

    async function handlePaginationChange(e, activePage) {
        setLoading(true);
        const response = (await ApiDataService.getData(ApiDataService.types.SUBJECT, activePage.activePage)).response;
        setLoading(false);
        if (response) {
            const data = response.data.content;
            setTotalPages(response.data.totalPages);
            setPage(activePage.activePage);
            setSubjects(data.map((plainSubject) => new SubjectModel(plainSubject)));
        }
    }

    return (
        <div className="p-subject">
            <Container>
                <SearchBox
                    placeholder="חיפוש נושא שיר ..."
                    searchText={searchSubjectText}
                    onSearchChange={handleSubjectSearchChange}
                    onEnter={handleSearchEnter}
                    results={subjectResults.map(result => result.name)}
                    onResultSelected={handleSubjectCheckBySearch} />
                {!loading && <div className="new-subject">
                    <Button variant="link" onClick={() => setShowModalNewSubject(true)}><i className="bi bi-plus-circle-fill" style={{ color: 'lightskyblue' }}></i> הוספת נושא שיר חדש </Button>
                </div>}
                <Modal show={showModalNewSubject} onHide={() => handleClose(operations.CREATE)} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>הוספת נושא שיר חדש</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {showSignupError ? <Alert variant="danger">שגיאה בהוספה!</Alert> : null}
                        <Form>
                            <Form.Group controlId="formBasicTitel">
                                <Form.Label>שם הנושא</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-tag"></i></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control type="text" placeholder="הכנסת שם נושא לשיר" required
                                        value={name} onChange={e => setName(e.target.value)} />
                                    <Form.Control.Feedback type="invalid">
                                        אנא להכניס שם נושא
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose(operations.CREATE)}>
                            סגירה
                        </Button>
                        <Button variant="primary" onClick={addSubject}>
                            שמירה
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div className="p-subject-cards">
                    {loading && <div className="p-subject-spinner"><Spinner animation="border" variant="primary" /></div>}
                    {subjectsCards}
                </div>
                <Modal show={showModalRemoveSubject} onHide={() => handleClose(operations.DELETE)} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>מחיקת נושא</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {showRemoveError ? <Alert variant="danger">שגיאה בהסרה!</Alert> : null}
                        האם פעולת מחיקת הנושא רצויה?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={removeSubject}>
                            כן
                        </Button>
                        <Button variant="primary" onClick={() => handleClose(operations.DELETE)}>
                            לא
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showModalEditSubject} onHide={() => handleClose(operations.UPDATE)} backdrop="static" keyboard={false}>
                    <Modal.Header>
                        <Modal.Title>עריכת נושא</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {showEditError ? <Alert variant="danger">שגיאה בעדכון</Alert> : null}
                        <Form>
                            <Form.Group controlId="formBasicName">
                                <Form.Label>שם הנושא</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text id="basic-addon1"><i class="bi bi-tag"></i></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control type="text" placeholder="הכנסת שם נושא השיר" required
                                        value={name} onChange={e => setName(e.target.value)} />
                                    <Form.Control.Feedback type="invalid">
                                        בבקשה להכניס שם נושא
                                    </Form.Control.Feedback>
                                </InputGroup>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => handleClose(operations.UPDATE)}>
                            סגירה
                        </Button>
                        <Button variant="primary" onClick={editSubject}>
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

export default SubjectPage;