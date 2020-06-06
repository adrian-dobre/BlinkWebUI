/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

import Camera from '../../domain/entities/Camera';
import CommandStatus from '../../domain/entities/CommandStatus';
import CameraSettings from '../../domain/entities/CameraSettings';

export interface CameraRepository {
    getCameraList(regionId: string, accountId: string, authToken: string): Promise<Camera[]>;
    updateCameraSettings(
        regionId: string,
        networkId: string,
        cameraId: string,
        cameraSettings: CameraSettings,
        authToken: string
    ): Promise<CommandStatus>;
}
