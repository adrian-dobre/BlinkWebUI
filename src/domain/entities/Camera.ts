/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

class Signals {
    battery: number
    lfr: number
    temp: number
    wifi: number

    constructor(jsonBody: Signals) {
        this.battery = jsonBody.battery;
        this.lfr = jsonBody.lfr;
        this.temp = jsonBody.temp;
        this.wifi = jsonBody.wifi;
    }
}

export default class Camera {
    battery: string
    createdAt: Date
    updatedAt: Date
    enabled: boolean
    fwVersion: string
    id: number
    name: string
    networkId: number
    serial: string
    signals: Signals
    status: string
    thumbnail: string
    type: string

    constructor(jsonBody: Camera) {
        this.battery = jsonBody.battery;
        this.createdAt = jsonBody.createdAt;
        this.updatedAt = jsonBody.updatedAt;
        this.enabled = jsonBody.enabled;
        this.fwVersion = jsonBody.fwVersion;
        this.id = jsonBody.id;
        this.name = jsonBody.name;
        this.networkId = jsonBody.networkId;
        this.serial = jsonBody.serial;
        this.signals = new Signals(jsonBody.signals);
        this.status = jsonBody.status;
        this.thumbnail = jsonBody.thumbnail;
        this.type = jsonBody.type;
    }
}
