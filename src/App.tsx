import * as React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from './application/theme/theme';
import DashboardLayout from './application/layouts/dashboard/DashboardLayout';
import RecordingsPage from './application/pages/recordings/RecordingsPage';
import { CssBaseline } from '@material-ui/core';
import SettingsPage from './application/pages/settings/SettingsPage';
import SyncModulesPage from './application/pages/sync-modules/SyncModulesPage';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

export class App extends React.Component {
    render(): JSX.Element {
        return (
            <>
                <CssBaseline />
                <ThemeProvider theme={theme}>
                    <Router>
                        <DashboardLayout>
                            <Switch>
                                <Route path="/" exact={true}>
                                    <Redirect to="/recordings" />
                                </Route>
                                <Route path="/recordings">
                                    <RecordingsPage />
                                </Route>
                                <Route path="/settings">
                                    <SettingsPage />
                                </Route>
                                <Route path="/sync-modules">
                                    <SyncModulesPage />
                                </Route>
                            </Switch>
                        </DashboardLayout>
                    </Router>
                </ThemeProvider>
            </>
        );
    }
}
