export default class UserModel {
    #pwd;   // pwd is a private property
    constructor(plainUser) {
        this.id = plainUser.id;
        this.name = plainUser.name;
        this.email = plainUser.email;
        this.role = plainUser.role;
        this.#pwd = plainUser.pwd;
    }

    login(email, pwd) {
        return email.toLowerCase() === this.email.toLowerCase() && pwd === this.#pwd;
    }
} 