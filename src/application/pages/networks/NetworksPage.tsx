/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

import React, { PropsWithChildren } from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Language from '@material-ui/icons/Language';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Container } from 'typedi';
import DashboardPageLayout from '../../layouts/dashboard-page/DashboardPageLayout';
import Session from '../../../domain/entities/Session';
import Network from '../../../domain/entities/Network';
import styles from './NetworksPageStyle.module.scss';
import { NetworkRepository } from '../../../infrastructure/repositories/NetworkRepository';
import { networkRepositoryToken } from '../../config/ServiceLocator';
import CommandStatus from '../../../domain/entities/CommandStatus';
import Utils from '../../../infrastructure/helpers/Utils';
import AsyncSwitchComponent from '../../components/async-switch/AsyncSwitchComponent';

interface NetworksPageState {
    networks: Network[];
    loading: boolean;
}

interface NetworksPageProps extends WithTranslation {
    session: Session;
}

class NetworksPage extends React.PureComponent<PropsWithChildren<NetworksPageProps>, NetworksPageState> {
    networkRepository: NetworkRepository = Container.get(networkRepositoryToken);

    constructor(props: NetworksPageProps) {
        super(props);
        this.state = {
            networks: [],
            loading: true
        };
    }

    componentDidMount(): void {
        this.getNetworkList();
    }

    onNetworkArm(network: Network): Promise<CommandStatus> {
        return this.networkRepository
            .armNetwork(
                this.props.session.region.tier,
                this.props.session.account.id.toString(),
                network.id.toString(),
                this.props.session.authtoken.authtoken
            );
    }

    onNetworkDisarm(network: Network): Promise<CommandStatus> {
        return this.networkRepository
            .disarmNetwork(
                this.props.session.region.tier,
                this.props.session.account.id.toString(),
                network.id.toString(),
                this.props.session.authtoken.authtoken
            );
    }

    onNetworkArmToggleChange(network: Network): Promise<void> {
        let request;
        if (network.armed) {
            request = this.onNetworkDisarm(network);
        } else {
            request = this.onNetworkArm(network);
        }
        return request
            .then((commandStatus: CommandStatus) => Utils.checkCommandStatus(
                this.props.session.region.tier,
                network.id.toString(),
                commandStatus,
                this.props.session.authtoken.authtoken
            ))
            .then(() => {
                this.setState((prevState) => ({
                    networks: prevState.networks.map((nt) => {
                        if (nt === network) {
                            // eslint-disable-next-line no-param-reassign
                            nt.armed = !network.armed;
                        }
                        return nt;
                    })
                }));
            });
    }

    // eslint
    getNetworkList(): Promise<void> {
        return this.networkRepository
            .getNetworkList(
                this.props.session.region.tier,
                this.props.session.account.id.toString(),
                this.props.session.authtoken.authtoken
            )
            .then((networks) => {
                this.setState((previousState) => ({
                    loading: false,
                    networks: previousState.networks.concat(networks)
                }));
            });
    }

    render(): JSX.Element {
        return (
            <DashboardPageLayout
                className={styles.networksPage}
                loading={this.state.loading}
                title={this.props.t('networks-page.title')}
                icon={<Language />}
            >
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    {this.props.t('networks-page.networks-table.header.name')}
                                </TableCell>
                                <TableCell className={styles.armedColumn}>
                                    {this.props.t('networks-page.networks-table.header.armed')}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.networks.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell>
                                        <AsyncSwitchComponent
                                            onChange={(): Promise<void> => this.onNetworkArmToggleChange(row)}
                                            checked={row.armed}
                                            color="primary"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DashboardPageLayout>
        );
    }
}

export default withTranslation()(NetworksPage);
