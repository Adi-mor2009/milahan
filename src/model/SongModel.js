export default class SongModel {
    constructor(plainSong) {
        this.id = plainSong.id;
        this.title = plainSong.title;
        this.lyrics = plainSong.lyrics;
        this.composer = plainSong.composer;
        this.firstWords = plainSong.firstWords;
    }
}