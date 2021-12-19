export default class SongBookModel {
    constructor(plainBook) {
        this.id = plainBook.book.id;
        this.title = plainBook.book.title;
        this.subTitle = plainBook.book.subTitle;
        this.author = plainBook.book.author;
        this.series = plainBook.book.series;
        this.publisher = plainBook.book.publisher;
        this.publishPlace = plainBook.book.publishPlace;
        this.publishYear = plainBook.book.publishYear;
        this.mmsid = plainBook.book.mmsid;
        this.isInPrivateCollection = plainBook.book.isInPrivateCollection == 1 ? true : false;
        this.page = plainBook.page;
        this.id = plainBook.id;
        //this.song = null;
    }

    // setSong(song) {
    //     this.song = song;
    // }
}