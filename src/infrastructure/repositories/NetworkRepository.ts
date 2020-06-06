/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

import Network from '../../domain/entities/Network';
import CommandStatus from '../../domain/entities/CommandStatus';

export interface NetworkRepository {
    getNetworkList(regionId: string, accountId: string, authToken: string): Promise<Network[]>;
    armNetwork(regionId: string, accountId: string, networkId: string, authToken: string): Promise<CommandStatus>;
    disarmNetwork(regionId: string, accountId: string, networkId: string, authToken: string): Promise<CommandStatus>;
    getNetworkCommandStatus(
        regionId: string,
        networkId: string,
        commandId: string,
        authToken: string
    ): Promise<CommandStatus>;
}
