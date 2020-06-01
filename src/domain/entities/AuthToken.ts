/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

export default class AuthToken {
    authtoken: string;
    message: string;

    constructor(jsonBody: AuthToken) {
        this.authtoken = jsonBody.authtoken;
        this.message = jsonBody.message;
    }
}
