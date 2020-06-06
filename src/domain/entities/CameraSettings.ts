/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

export default class CameraSettings {
    videoLength?: number;
    videoQuality?: string;
    recordAudioEnable?: boolean;
    earlyTermination?: boolean;
    illuminatorEnable?: number;
    illuminatorIntensity?: number;
    lfrSyncInterval?: number;
    name?: string;
    earlyNotification?: boolean;
    motionSensitivity?: number;
    motionAlert?: boolean;
    alertInterval?: number;

    constructor(jsonBody: CameraSettings) {
        this.videoLength = jsonBody.videoLength;
        this.videoQuality = jsonBody.videoQuality;
        this.recordAudioEnable = jsonBody.recordAudioEnable;
        this.earlyTermination = jsonBody.earlyTermination;
        this.illuminatorEnable = jsonBody.illuminatorEnable;
        this.illuminatorIntensity = jsonBody.illuminatorIntensity;
        this.lfrSyncInterval = jsonBody.lfrSyncInterval;
        this.name = jsonBody.name;
        this.earlyNotification = jsonBody.earlyNotification;
        this.motionSensitivity = jsonBody.motionSensitivity;
        this.motionAlert = jsonBody.motionAlert;
        this.alertInterval = jsonBody.alertInterval;
    }
}
