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
