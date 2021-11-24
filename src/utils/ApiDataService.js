import axios from "axios";

const SERVER_URL = "http://localhost:8080/";
const types = {
    SONG: "songs",
    BOOK: "books"
}

async function getData(type, pageNum) {
    const getURL = SERVER_URL + type + "?pageNo=" + (pageNum - 1);
    try {
        const res = await axios.get(getURL);
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
        const res = await axios.post(postURL, data);
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