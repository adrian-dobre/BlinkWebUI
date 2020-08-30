/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

import { BaseServiceClient } from '../../../helpers/BaseServiceClient';
import { AuthRepository } from '../../AuthRepository';
import Session from '../../../../domain/entities/Session';
import ClientVerification from '../../../../domain/entities/ClientVerification';

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

    verifyPin(
        regionId: string,
        accountId: string,
        clientId: string,
        pin: number,
        authToken: string
    ): Promise<ClientVerification> {
        return new BaseServiceClient(this.baseUrl)
            .post(
                `/regions/${regionId}/accounts/${accountId}/clients/${clientId}/pin/verify`,
                {
                    headers: {
                        authToken: authToken
                    },
                    data: {
                        pin: pin
                    }
                }
            )
            .then((response) => new ClientVerification(response.data));
    }

    logout(
        regionId: string,
        accountId: string,
        clientId: string,
        authToken: string
    ): Promise<void> {
        return new BaseServiceClient(this.baseUrl)
            .post(
                `/regions/${regionId}/accounts/${accountId}/clients/${clientId}/logout`,
                {
                    headers: {
                        authToken: authToken
                    }
                }
            )
            .then((response) => response.data);
    }
}
