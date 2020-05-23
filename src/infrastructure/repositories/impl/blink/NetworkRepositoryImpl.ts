import { BaseServiceClient } from '../../../helpers/BaseServiceClient';
import { NetworkRepository } from '../../NetworkRepository';
import Network from '../../../../domain/entities/Network';

export default class NetworkRepositoryImpl implements NetworkRepository {
    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    getNetworkList(regionId: string, accountId: string, authToken: string): Promise<Network[]> {
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
                .networks
                .map((network: Network) => new Network(network)));
    }
}
