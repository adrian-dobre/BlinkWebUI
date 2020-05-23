import Media from '../../domain/entities/Media';

export interface MediaRepository {
    getMediaList(regionId: string, accountId: string, authToken: string, page: number): Promise<Media[]>;
    getMedia(regionId: string, mediaPath: string, authToken: string): Promise<Blob>;
}
