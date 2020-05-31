import React, { PropsWithChildren } from 'react';
import {
    Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@material-ui/core';
import { Videocam } from '@material-ui/icons';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Container } from 'typedi';
import DashboardPageLayout from '../../layouts/dashboard-page/DashboardPageLayout';
import Session from '../../../domain/entities/Session';
import CameraRepositoryImpl from '../../../infrastructure/repositories/impl/blink/CameraRepositoryImpl';
import Camera from '../../../domain/entities/Camera';
import SignalIndicatorComponent from '../../components/signal-indicator/SignalIndicatorComponent';
import BatteryIndicatorComponent from '../../components/battery-indicator/BatteryIndicatorComponent';
import styles from './CamerasPageStyle.module.scss';
import { cameraRepositoryToken } from '../../config/ServiceLocator';
import { CameraRepository } from '../../../infrastructure/repositories/CameraRepository';

interface CamerasPageState {
    cameras: Camera[];
    loading: boolean;
}

interface CamerasPageProps extends WithTranslation {
    session: Session;
}

function getCelsiusTemp(fahrenheitTemp: number): number {
    // eslint-disable-next-line no-mixed-operators
    return Math.round((fahrenheitTemp - 32) * 5 / 9);
}

class CamerasPage extends React.PureComponent<PropsWithChildren<CamerasPageProps>, CamerasPageState> {
    cameraRepository: CameraRepository = Container.get(cameraRepositoryToken);

    constructor(props: any) {
        super(props);
        this.state = {
            cameras: [],
            loading: true
        };
    }

    componentDidMount(): void {
        this.getCameraList();
    }

    getCameraList(): Promise<any> {
        return this.cameraRepository
            .getCameraList(
                this.props.session.region.tier,
                this.props.session.account.id.toString(),
                this.props.session.authtoken.authtoken
            )
            .then((mediaList) => {
                this.setState((previousState) => ({
                    loading: false,
                    cameras: previousState.cameras.concat(mediaList)
                }));
            });
    }

    render(): JSX.Element {
        return (
            <DashboardPageLayout
                className={styles.camerasPage}
                loading={this.state.loading}
                title={this.props.t('cameras-page.title')}
                icon={<Videocam />}
            >
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>{this.props.t('cameras-page.cameras-table.header.name')}</TableCell>
                                <TableCell>{this.props.t('cameras-page.cameras-table.header.type')}</TableCell>
                                <TableCell align="center">
                                    {this.props.t('cameras-page.cameras-table.header.battery')}
                                </TableCell>
                                <TableCell align="center">
                                    {this.props.t('cameras-page.cameras-table.header.wifi-signal')}
                                </TableCell>
                                <TableCell align="center">
                                    {this.props.t('cameras-page.cameras-table.header.sync-module-signal')}
                                </TableCell>
                                <TableCell align="center">
                                    {this.props.t('cameras-page.cameras-table.header.temperature')}
                                </TableCell>
                                <TableCell align="center">
                                    {this.props.t('cameras-page.cameras-table.header.enabled')}
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.cameras.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell>{row.type}</TableCell>
                                    <TableCell align="center">
                                        <BatteryIndicatorComponent strength={row.signals.battery} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <SignalIndicatorComponent strength={row.signals.wifi} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <SignalIndicatorComponent strength={row.signals.lfr} />
                                    </TableCell>
                                    <TableCell align="center">
                                        {getCelsiusTemp(row.signals.temp)}
                                        °C
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            disabled
                                            checked={row.enabled}
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

export default withTranslation()(CamerasPage);
