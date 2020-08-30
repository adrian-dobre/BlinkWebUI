/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

export default class ClientVerification {
    valid: boolean;
    requireNewPin: boolean;
    message: string;
    code: number;

    constructor(jsonBody: ClientVerification) {
        this.valid = jsonBody.valid;
        this.requireNewPin = jsonBody.requireNewPin;
        this.message = jsonBody.message;
        this.code = jsonBody.code;
    }
}
