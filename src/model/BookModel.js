import BookSongModel from "./BookSongModel";

export default class BookModel {
    constructor(plainBook) {
        this.id = plainBook.id;
        this.title = plainBook.title;
        this.subTitle = plainBook.subTitle;
        this.author = plainBook.author;
        this.series = plainBook.series;
        this.publisher = plainBook.publisher;
        this.publishPlace = plainBook.publishPlace;
        this.publishYear = plainBook.publishYear;
        this.mmsid = plainBook.mmsid;
        this.isInPrivateCollection = plainBook.isInPrivateCollection ? (plainBook.isInPrivateCollection == 1 ? true : false) : undefined;
        this.songs = plainBook.songs ? plainBook.songs.map((plainBook) => new BookSongModel(plainBook)) : undefined;//plainBook.songs;
    }
}