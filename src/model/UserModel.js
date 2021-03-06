import md5 from "md5";

export default class UserModel {
    #password;   // pwd is a private property
    constructor(plainUser) {
        this.id = plainUser.id;
        this.name = plainUser.name;
        this.email = plainUser.email;
        this.role = plainUser.role;
        this.#password = plainUser.password;
    }

    login(email, password) {
        return email.toLowerCase() === this.email.toLowerCase() && md5(password) === this.#password;
    }
} 