/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

import { BaseServiceClient } from '../../../helpers/BaseServiceClient';
import { CameraRepository } from '../../CameraRepository';
import Camera from '../../../../domain/entities/Camera';

export default class CameraRepositoryImpl implements CameraRepository {
    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    getCameraList(regionId: string, accountId: string, authToken: string): Promise<Camera[]> {
        return new BaseServiceClient(this.baseUrl)
            .get(
                `/regions/${regionId}/accounts/${accountId}/home-screen`,
                {
                    headers: {
                        authToken: authToken
                    }
                }
            )
            .then((response) => response
                .data
                .cameras
                .map((camera: Camera) => new Camera(camera)));
    }
}
