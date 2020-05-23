import React, { PropsWithChildren } from 'react';
import {
    Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@material-ui/core';
import { Language } from '@material-ui/icons';
import DashboardPageLayout from '../../layouts/dashboard-page/DashboardPageLayout';
import Session from '../../../domain/entities/Session';
import NetworkRepositoryImpl from '../../../infrastructure/repositories/impl/blink/NetworkRepositoryImpl';
import Network from '../../../domain/entities/Network';
import './NetworksPageStyle.scss';

interface NetworksPageState {
    networks: Network[];
    loading: boolean;
}

interface NetworksPageProps {
    session: Session;
}


export default class NetworksPage
    extends React.PureComponent<PropsWithChildren<NetworksPageProps>, NetworksPageState> {
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

    getNetworkList(): Promise<any> {
        return new NetworkRepositoryImpl('http://localhost:8080')
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
                className="networks-page"
                loading={this.state.loading}
                title="Networks"
                icon={<Language />}
            >
                <TableContainer component={Paper}>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="center">Armed</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.networks.map((row) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            disabled
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
