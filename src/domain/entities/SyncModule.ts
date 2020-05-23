export default class SyncModule {
    createdAt: string
    enableTempAlerts: boolean
    fwVersion: string
    id: number
    lastHb: Date
    name: string
    networkId: number
    onboarded: boolean
    serial: string
    status: string
    updatedAt: Date
    wifiStrength: number

    constructor(jsonBody: SyncModule) {
        this.createdAt = jsonBody.createdAt;
        this.enableTempAlerts = jsonBody.enableTempAlerts;
        this.fwVersion = jsonBody.fwVersion;
        this.id = jsonBody.id;
        this.lastHb = jsonBody.lastHb;
        this.name = jsonBody.name;
        this.networkId = jsonBody.networkId;
        this.onboarded = jsonBody.onboarded;
        this.serial = jsonBody.serial;
        this.status = jsonBody.status;
        this.updatedAt = jsonBody.updatedAt;
        this.wifiStrength = jsonBody.wifiStrength;
    }
}
