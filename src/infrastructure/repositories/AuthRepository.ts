/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

import Session from '../../domain/entities/Session';

export interface AuthRepository {
    login(username: string, password: string): Promise<Session>;
}
