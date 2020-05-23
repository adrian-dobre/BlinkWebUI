export default class AuthToken {
    authtoken: string;
    message: string;

    constructor(jsonBody: AuthToken) {
        this.authtoken = jsonBody.authtoken;
        this.message = jsonBody.message;
    }
}
