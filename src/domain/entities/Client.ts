export default class Client {
    id: string;

    constructor(jsonBody: Client) {
        this.id = jsonBody.id;
    }
}
