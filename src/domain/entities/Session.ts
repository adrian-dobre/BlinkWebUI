import AuthToken from './AuthToken';
import Client from './Client';
import Network from './Network';
import Region from './Region';
import Account from './Account';

export default class Session {
    authtoken: AuthToken;
    account: Account;
    client: Client;
    networks?: Network[];
    region: Region;

    constructor(jsonBody: Session) {
        this.authtoken = new AuthToken(jsonBody.authtoken);
        this.account = new Account(jsonBody.account);
        this.client = new Client(jsonBody.client);
        this.networks = jsonBody.networks?.map((network) => new Network(network));
        this.region = new Region(jsonBody.region);
    }
}
