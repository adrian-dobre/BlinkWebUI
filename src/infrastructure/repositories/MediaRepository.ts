/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

import Media from '../../domain/entities/Media';

export interface MediaRepository {
    getMediaList(regionId: string, accountId: string, authToken: string, page: number): Promise<Media[]>;
    getMedia(regionId: string, mediaPath: string, authToken: string): Promise<Blob>;
}
