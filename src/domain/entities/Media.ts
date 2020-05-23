export default class Media {
    id: number;
    created_at: Date;
    updatedAt: Date;
    deleted: boolean;
    device: string;
    deviceId: number;
    deviceName: string;
    networkId: number;
    networkName: string;
    type: string;
    source: string;
    watched: boolean;
    partial: boolean;
    thumbnail: string;
    media: string;

    constructor(jsonBody: Media) {
        this.id = jsonBody.id;
        // eslint-disable-next-line @typescript-eslint/camelcase
        this.created_at = jsonBody.created_at;
        this.updatedAt = jsonBody.updatedAt;
        this.deleted = jsonBody.deleted;
        this.device = jsonBody.device;
        this.deviceId = jsonBody.deviceId;
        this.deviceName = jsonBody.deviceName;
        this.networkId = jsonBody.networkId;
        this.networkName = jsonBody.networkName;
        this.type = jsonBody.type;
        this.source = jsonBody.source;
        this.watched = jsonBody.watched;
        this.partial = jsonBody.partial;
        this.thumbnail = jsonBody.thumbnail;
        this.media = jsonBody.media;
    }
}
