import SyncModule from '../../domain/entities/SyncModule';

export interface SyncModuleRepository {
    getSyncModuleList(regionId: string, accountId: string, authToken: string): Promise<SyncModule[]>;
}
