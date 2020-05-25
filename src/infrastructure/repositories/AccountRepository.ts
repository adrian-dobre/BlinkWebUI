import Account from '../../domain/entities/Account';

export interface AccountRepository {
    getAccount(regionId: string, authToken: string): Promise<Account>;
}
