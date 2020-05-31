import { Container, Token } from 'typedi';
import { AuthRepository } from '../../infrastructure/repositories/AuthRepository';
import AuthRepositoryImpl from '../../infrastructure/repositories/impl/blink/AuthRepositoryImpl';
import CameraRepositoryImpl from '../../infrastructure/repositories/impl/blink/CameraRepositoryImpl';
import { CameraRepository } from '../../infrastructure/repositories/CameraRepository';
import { MediaRepository } from '../../infrastructure/repositories/MediaRepository';
import MediaRepositoryImpl from '../../infrastructure/repositories/impl/blink/MediaRepositoryImpl';
import { NetworkRepository } from '../../infrastructure/repositories/NetworkRepository';
import NetworkRepositoryImpl from '../../infrastructure/repositories/impl/blink/NetworkRepositoryImpl';
import { SyncModuleRepository } from '../../infrastructure/repositories/SyncModuleRepository';
import SyncModuleRepositoryImpl from '../../infrastructure/repositories/impl/blink/SyncModuleRepositoryImpl';
import { config } from './config';

export const authRepositoryToken = new Token<AuthRepository>();
export const cameraRepositoryToken = new Token<CameraRepository>();
export const mediaRepositoryToken = new Token<MediaRepository>();
export const networkRepositoryToken = new Token<NetworkRepository>();
export const syncModuleRepositoryToken = new Token<SyncModuleRepository>();

export class ServiceLocator {
    static setup(): void {
        Container.set(authRepositoryToken, new AuthRepositoryImpl(config.baseUrl));
        Container.set(cameraRepositoryToken, new CameraRepositoryImpl(config.baseUrl));
        Container.set(mediaRepositoryToken, new MediaRepositoryImpl(config.baseUrl));
        Container.set(networkRepositoryToken, new NetworkRepositoryImpl(config.baseUrl));
        Container.set(syncModuleRepositoryToken, new SyncModuleRepositoryImpl(config.baseUrl));
    }
}
