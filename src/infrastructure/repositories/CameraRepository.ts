import Camera from '../../domain/entities/Camera';

export interface CameraRepository {
    getCameraList(regionId: string, accountId: string, authToken: string): Promise<Camera[]>;
}
