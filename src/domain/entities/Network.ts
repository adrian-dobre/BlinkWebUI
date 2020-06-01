/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

export default class Network {
    id: number;
    name: string;
    onboarded: boolean;
    armed: boolean;
    timeZone: string;
    dst: boolean;
    lvSave: boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(jsonBody: Network) {
        this.id = jsonBody.id;
        this.name = jsonBody.name;
        this.onboarded = jsonBody.onboarded;
        this.armed = jsonBody.armed;
        this.timeZone = jsonBody.timeZone;
        this.dst = jsonBody.dst;
        this.lvSave = jsonBody.lvSave;
        this.createdAt = jsonBody.createdAt;
        this.updatedAt = jsonBody.updatedAt;
    }
}
