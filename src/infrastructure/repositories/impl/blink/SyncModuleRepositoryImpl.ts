import { BaseServiceClient } from '../../../helpers/BaseServiceClient';
import { SyncModuleRepository } from '../../SyncModuleRepository';
import SyncModule from '../../../../domain/entities/SyncModule';

export default class SyncModuleRepositoryImpl implements SyncModuleRepository {
    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    getSyncModuleList(regionId: string, accountId: string, authToken: string): Promise<SyncModule[]> {
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
                .syncModules
                .map((syncModule: SyncModule) => new SyncModule(syncModule)));
    }
}
