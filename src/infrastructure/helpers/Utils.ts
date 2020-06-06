/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

import { Container } from 'typedi';
import CommandStatus from '../../domain/entities/CommandStatus';
import { networkRepositoryToken } from '../../application/config/ServiceLocator';

export default class Utils {
    static checkCommandStatus(
        regionId: string,
        networkId: string,
        commandStatus: CommandStatus,
        authToken: string
    ): Promise<CommandStatus> {
        return Container.get(networkRepositoryToken)
            .getNetworkCommandStatus(
                regionId,
                networkId,
                commandStatus.id.toString(),
                authToken
            )
            .then((cs: CommandStatus) => {
                if (cs.complete) {
                    return cs;
                }
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        this.checkCommandStatus(regionId, networkId, commandStatus, authToken)
                            .then(resolve)
                            .catch(reject);
                    }, 2000);
                });
            });
    }
}
