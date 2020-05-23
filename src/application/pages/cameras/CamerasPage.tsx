import React, { PropsWithChildren } from 'react';
import {
    Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Paper, Switch
} from '@material-ui/core';
import { Videocam } from '@material-ui/icons';
import DashboardPageLayout from '../../layouts/dashboard-page/DashboardPageLayout';
import Session from '../../../domain/entities/Session';
import CameraRepositoryImpl from '../../../infrastructure/repositories/impl/blink/CameraRepositoryImpl';
import Camera from '../../../domain/entities/Camera';
import SignalIndicatorComponent from '../../components/signal-indicator/SignalIndicatorComponent';
import BatteryIndicatorComponent from '../../components/battery-indicator/BatteryIndicatorComponent';
import './CamerasPageStyle.scss';

interface CamerasPageState {
    cameras: Camera[];
    loading: boolean;
}

interface CamerasPageProps {
    session: Session;
}

function getCelsiusTemp(fahrenheitTemp: number): number {
    // eslint-disable-next-line no-mixed-operators
    return Math.round((fahrenheitTemp - 32) * 5 / 9);
}

export default class CamerasPage extends React.PureComponent<PropsWithChildren<CamerasPageProps>, CamerasPageState> {
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
        return new CameraRepositoryImpl('http://localhost:8080')
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
                className="cameras-page"
                loading={this.state.loading}
                title="Cameras"
                icon={<Videocam />}
            >
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="left">Type</TableCell>
                                <TableCell align="center">Battery</TableCell>
                                <TableCell align="center">WiFi Signal</TableCell>
                                <TableCell align="center">Sync Module Signal</TableCell>
                                <TableCell align="center">Temperature</TableCell>
                                <TableCell align="center">Enabled</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.cameras.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="left">{row.type}</TableCell>
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
