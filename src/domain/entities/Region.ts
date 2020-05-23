export default class Region {
    tier: string;
    description: string;
    code: string;

    constructor(jsonBody: Region) {
        this.tier = jsonBody.tier;
        this.description = jsonBody.description;
        this.code = jsonBody.code;
    }
}
