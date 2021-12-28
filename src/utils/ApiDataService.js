import axios from "axios";

const SERVER_URL = "http://localhost:8080/";
const types = {
    SONG: "songs",
    BOOK: "books",
    BOOK_TITLE: "books_title",
    SONG_TITLE: "songs_title",
    SUBJECT: "subjects",
    SONG_BOOK: "songbook"
}

async function getData(type, pageNum, pageSize, filter) {
    //GET /cars?country=USA&sort=createDate:desc&size=100&offset=2&pageSize=5&pageNo=1
    const dynamicUrlPart = (filter || pageNum) ? "?" : "";
    const filterUrlPart = filter ? "name=" + filter : "";
    const pageUrlPart = (filter && pageNum) ? "&pageNo=" + (pageNum - 1) : pageNum ? "pageNo=" + (pageNum - 1) : "";
    const pageSizePart = pageSize ? (dynamicUrlPart == "?" ? "&pageSize=" + pageSize: "?pageSize=" + pageSize) : "";
    
    //const getURL = SERVER_URL + type + "?pageNo=" + (pageNum - 1);
    const getURL = SERVER_URL + type + dynamicUrlPart + filterUrlPart + pageUrlPart + pageSizePart;
    console.log(getURL);
    try {
        const res = await axios.get(getURL);
        debugger
        return({response: res, error: null});
    } catch (err) {
        console.error('Error while geting ' + type, err);
        return({response: null, error: err});
    }
}

async function getDataById(type, id) {
    const getURL = SERVER_URL + type + "/" + id;
    try {
        const res = await axios.get(getURL);
        return({response: res, error: null});
    } catch (err) {
        console.error('Error while geting ' + type + " with id= " + id, err);
        return({response: null, error: err});
    }
}

async function postData(type, data) {
    const postURL = SERVER_URL + type;
    try {
        debugger
        const res = await axios.post(postURL, data);
        debugger
        return({response: res, error: null});
    } catch (err) {
        console.error('Error while creating ' + type + " with data:" + data, err);
        return({response: null, error: err});
    }
}

async function putData(type, id, data) {
    const putURL = SERVER_URL + type + "/" + id;
    try {
        const res = await axios.put(putURL, data);
        debugger
        return({response: res, error: null});
    } catch (err) {
        console.error('Error while editing ' + type + " " + id, err);
        return({response: null, error: err});
    }
}

async function deleteData(type, id) {
    const deleteURL = SERVER_URL + type + "/" + id;
    try {
        const res = await axios.delete(deleteURL);
        return({response: res, error: null});
    } catch (err) {
        console.error('Error while deleting ' + type + " " + id, err);
        return({response: null, error: err});
    }
}

export default { types, getData, getDataById, postData, putData, deleteData }