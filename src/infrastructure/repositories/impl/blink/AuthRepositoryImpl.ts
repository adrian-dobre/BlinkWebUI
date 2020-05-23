import { BaseServiceClient } from '../../../helpers/BaseServiceClient';
import { AuthRepository } from '../../AuthRepository';
import Session from '../../../../domain/entities/Session';

export default class AuthRepositoryImpl implements AuthRepository {
    baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    login(username: string, password: string): Promise<Session> {
        return new BaseServiceClient(this.baseUrl)
            .post(
                'auth/login',
                {
                    data: {
                        email: username,
                        password: password
                    }
                }
            )
            .then((response) => new Session(response.data));
    }
}
