/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

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
