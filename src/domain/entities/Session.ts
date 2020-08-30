/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

import AuthToken from './AuthToken';
import Client from './Client';
import Region from './Region';
import Account from './Account';

export default class Session {
    authtoken: AuthToken;
    account: Account;
    client: Client;
    region: Region;
    allowPinResendSeconds: number;
    forcePasswordReset: boolean;
    lockoutTimeRemaining: number

    constructor(jsonBody: Session) {
        this.authtoken = new AuthToken(jsonBody.authtoken);
        this.account = new Account(jsonBody.account);
        this.client = new Client(jsonBody.client);
        this.region = new Region(jsonBody.region);
        this.allowPinResendSeconds = jsonBody.allowPinResendSeconds;
        this.forcePasswordReset = jsonBody.forcePasswordReset;
        this.lockoutTimeRemaining = jsonBody.lockoutTimeRemaining;
    }
}
