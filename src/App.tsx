import * as React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import {
    BrowserRouter as Router, Redirect, Route, Switch
} from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import { theme } from './application/theme/theme';
import DashboardLayout from './application/layouts/dashboard/DashboardLayout';
import RecordingsPage from './application/pages/recordings/RecordingsPage';
import SyncModulesPage from './application/pages/sync-modules/SyncModulesPage';
import LoginPage from './application/pages/login/LoginPage';
import Session from './domain/entities/Session';
import CamerasPage from './application/pages/cameras/CamerasPage';
import NetworksPage from './application/pages/networks/NetworksPage';

interface AppState {
    loggedIn: boolean;
    session?: Session;
}


class App extends React.Component<any, AppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            loggedIn: false
        };
    }

    render(): JSX.Element {
        let content: JSX.Element;

        if (!this.state.loggedIn) {
            content = (
                <LoginPage onLogin={(session) => {
                    this.setState({
                        loggedIn: true,
                        session: session
                    });
                }}
                />
            );
        } else {
            content = (
                <Switch>
                    <Route path="/" exact={true}>
                        <Redirect to="/recordings" />
                    </Route>
                    <Route path="/recordings">
                        <RecordingsPage session={this.state.session!} />
                    </Route>
                    <Route path="/cameras">
                        <CamerasPage session={this.state.session!} />
                    </Route>
                    <Route path="/sync-modules">
                        <SyncModulesPage session={this.state.session!} />
                    </Route>
                    <Route path="/networks">
                        <NetworksPage session={this.state.session!} />
                    </Route>
                </Switch>
            );
        }

        return (
            <>
                <CssBaseline />
                <ThemeProvider theme={theme}>
                    <Router>
                        <DashboardLayout hideDrawer={!this.state.loggedIn}>
                            {content}
                        </DashboardLayout>
                    </Router>
                </ThemeProvider>
            </>
        );
    }
}

export default hot(App);
