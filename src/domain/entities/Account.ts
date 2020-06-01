/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

export default class Account {
    id: number;
    emailVerified: boolean;
    emailVerificationRequired: boolean;
    email?: string;
    timeZone?: string;
    owner?: boolean;
    name?: string;
    userAccess?: string;
    tempUnits?: string;
    type?: string;
    pinFailures?: number;
    accountId?: number;
    createdAt: string;
    updatedAt: string;

    constructor(jsonBody: Account) {
        this.id = jsonBody.id;
        this.emailVerified = jsonBody.emailVerified;
        this.emailVerificationRequired = jsonBody.emailVerificationRequired;
        this.email = jsonBody.email;
        this.timeZone = jsonBody.timeZone;
        this.owner = jsonBody.owner;
        this.name = jsonBody.name;
        this.userAccess = jsonBody.userAccess;
        this.tempUnits = jsonBody.tempUnits;
        this.type = jsonBody.type;
        this.pinFailures = jsonBody.pinFailures;
        this.accountId = jsonBody.accountId;
        this.createdAt = jsonBody.createdAt;
        this.updatedAt = jsonBody.updatedAt;
    }
}
