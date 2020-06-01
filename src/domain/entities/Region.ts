/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

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
