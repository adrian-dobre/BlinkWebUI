/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

export default class Client {
    id: string;
    verificationRequired: boolean;

    constructor(jsonBody: Client) {
        this.id = jsonBody.id;
        this.verificationRequired = jsonBody.verificationRequired;
    }
}
