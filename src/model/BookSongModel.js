export default class BookSongModel {
    constructor(plainSong) {
        this.id = plainSong.song.id;
        this.title = plainSong.song.title;
        this.lyrics = plainSong.song.lyrics;
        this.composer = plainSong.song.composer;
        this.firstWords = plainSong.song.firstWords;
        this.page = plainSong.page;
        this.id = plainSong.id;
    }
}