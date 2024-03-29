/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

import { MediaRepository } from '../../MediaRepository';
import Media from '../../../../domain/entities/Media';
import { BaseServiceClient } from '../../../helpers/BaseServiceClient';

export default class MediaRepositoryImpl implements MediaRepository {
    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    getMediaList(
        regionId: string,
        accountId: string,
        authToken: string,
        page = 1
    ): Promise<Media[]> {
        return new BaseServiceClient(this.baseUrl)
            .get(
                `/regions/${regionId}/accounts/${accountId}/media`,
                {
                    params: {
                        page: page
                    },
                    headers: {
                        authToken: authToken
                    }
                }
            )
            .then((response) => {
                const mediaList: Media[] = response
                    .data
                    .media
                    .map((media: Media) => new Media(media));
                return mediaList;
            });
    }

    deleteMediaList(
        regionId: string,
        accountId: string,
        authToken: string,
        mediaList: number[]
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<any> {
        return new BaseServiceClient(this.baseUrl)
            .delete(
                `/regions/${regionId}/accounts/${accountId}/media`,
                {
                    data: {
                        mediaList: mediaList
                    },
                    headers: {
                        authToken: authToken
                    }
                }
            )
            .then((response) => response.data);
    }

    getMedia(regionId: string, mediaPath: string, authToken: string): Promise<Blob> {
        return new BaseServiceClient(this.baseUrl)
            .get(
                `/regions/${regionId}/media?mediaPath=${mediaPath}`,
                {
                    responseType: 'blob',
                    headers: {
                        authToken: authToken
                    }
                }
            )
            .then((response) => response.data);
    }
}
