import { BaseServiceClient } from '../../../helpers/BaseServiceClient';
import { AccountRepository } from '../../AccountRepository';
import Account from '../../../../domain/entities/Account';

export default class AccountRepositoryImpl implements AccountRepository {
    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    getAccount(regionId: string, authToken: string): Promise<Account> {
        return new BaseServiceClient(this.baseUrl)
            .get(
                `/regions/${regionId}/user`,
                {
                    headers: {
                        authToken: authToken
                    }
                }
            )
            .then((response) => new Account(response.data));
    }
}
