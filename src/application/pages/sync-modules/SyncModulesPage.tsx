import React, { PropsWithChildren } from 'react';
import {
    Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@material-ui/core';
import { Cloud } from '@material-ui/icons';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Container } from 'typedi';
import DashboardPageLayout from '../../layouts/dashboard-page/DashboardPageLayout';
import Session from '../../../domain/entities/Session';
import SyncModule from '../../../domain/entities/SyncModule';
import SignalIndicatorComponent from '../../components/signal-indicator/SignalIndicatorComponent';
import styles from './SyncModulesPageStyle.module.scss';
import { SyncModuleRepository } from '../../../infrastructure/repositories/SyncModuleRepository';
import { syncModuleRepositoryToken } from '../../config/ServiceLocator';

interface SyncModulesPageState {
    syncModules: SyncModule[];
    loading: boolean;
}

interface SyncModulesPageProps extends WithTranslation{
    session: Session;
}


class SyncModulesPage extends React.PureComponent<PropsWithChildren<SyncModulesPageProps>, SyncModulesPageState> {
    syncModuleRepository: SyncModuleRepository = Container.get(syncModuleRepositoryToken);

    constructor(props: SyncModulesPageProps) {
        super(props);
        this.state = {
            syncModules: [],
            loading: true
        };
    }

    componentDidMount(): void {
        this.getModuleList();
    }

    getModuleList(): Promise<any> {
        return this.syncModuleRepository
            .getSyncModuleList(
                this.props.session.region.tier,
                this.props.session.account.id.toString(),
                this.props.session.authtoken.authtoken
            )
            .then((syncModules) => {
                this.setState((previousState) => ({
                    loading: false,
                    syncModules: previousState.syncModules.concat(syncModules)
                }));
            });
    }

    render(): JSX.Element {
        return (
            <DashboardPageLayout
                className={styles.syncModulesPage}
                loading={this.state.loading}
                title={this.props.t('sync-modules-page.title')}
                icon={<Cloud />}
            >
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    {this.props.t('sync-modules-page.sync-modules-table.header.name')}
                                </TableCell>
                                <TableCell align="center">
                                    {this.props.t('sync-modules-page.sync-modules-table.header.status')}
                                </TableCell>
                                <TableCell align="center">
                                    {this.props.t('sync-modules-page.sync-modules-table.header.wifi-signal')}
                                </TableCell>
                                <TableCell align="center">
                                    {this.props.t('sync-modules-page.sync-modules-table.header.temperature-alerts')}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.syncModules.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="center">{row.status}</TableCell>
                                    <TableCell align="center">
                                        <SignalIndicatorComponent strength={row.wifiStrength} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            disabled
                                            checked={row.enableTempAlerts}
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

export default withTranslation()(SyncModulesPage);
