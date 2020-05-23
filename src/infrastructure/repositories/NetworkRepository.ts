import Network from '../../domain/entities/Network';

export interface NetworkRepository {
    getNetworkList(regionId: string, accountId: string, authToken: string): Promise<Network[]>;
}
