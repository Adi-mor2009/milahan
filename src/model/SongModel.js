import SongBookModel from "./SongBookModel";
import SubjectModel from "./SubjectModel";

export default class SongModel {
    constructor(plainSong) {
        this.id = plainSong.id;
        this.title = plainSong.title;
        this.lyrics = plainSong.lyrics;
        this.composer = plainSong.composer;
        this.firstWords = plainSong.firstWords;
        this.books = plainSong.books ? (plainSong.books.map((plainBook) => new SongBookModel(plainBook))) : undefined;
        this.subjects = plainSong.subjects ? (plainSong.subjects.map((plainSubject) => new SubjectModel(plainSubject))) : undefined;
    }
}