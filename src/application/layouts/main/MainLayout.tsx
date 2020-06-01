/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

import React, { PropsWithChildren } from 'react';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import {
    AccountCircle,
    Cloud, ExitToApp, Language, Videocam, YouTube
} from '@material-ui/icons';
import {
    NavLink, Redirect, Route, Switch
} from 'react-router-dom';
import {
    IconButton, LinearProgress, Menu, MenuItem
} from '@material-ui/core';
import { WithTranslation, withTranslation } from 'react-i18next';
import styles from './MainLayoutStyle.module.scss';
import SimplePubSub, { PubSubEvent } from '../../utils/SimplePubSub';
import UiConsoleComponent, { UIConsoleAlertType } from '../../components/ui-console/UiConsoleComponent';
import LoginPage from '../../pages/login/LoginPage';
import RecordingsPage from '../../pages/recordings/RecordingsPage';
import CamerasPage from '../../pages/cameras/CamerasPage';
import SyncModulesPage from '../../pages/sync-modules/SyncModulesPage';
import NetworksPage from '../../pages/networks/NetworksPage';
import Session from '../../../domain/entities/Session';

interface DashboardLayoutProps extends WithTranslation {
    hideDrawer?: boolean;
}

interface DashboardLayoutState {
    loading?: boolean;
    session?: Session;
    accountMenuAnchor?: HTMLElement;
}

class MainLayout extends React.PureComponent<PropsWithChildren<DashboardLayoutProps>, DashboardLayoutState> {
    private requestsInProgress = 0;

    constructor(props: DashboardLayoutProps) {
        super(props);

        let existingSession: Session;
        try {
            // eslint-disable-next-line no-undef
            existingSession = JSON.parse(localStorage.getItem('existingSession')!) as Session;
        } catch (e) {
            // nothing to do, invalid/missing existingSession
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        if (existingSession) {
            this.state = {
                session: existingSession,
                loading: false
            };
        } else {
            this.state = {
                loading: false
            };
        }

        SimplePubSub.subscribe(PubSubEvent.HTTP_REQUEST_STARTED, () => {
            this.onRequestsNumberChange();
        });

        SimplePubSub.subscribe(PubSubEvent.HTTP_REQUEST_ENDED, () => {
            this.onRequestsNumberChange(true);
        });

        SimplePubSub.subscribe(PubSubEvent.HTTP_REQUEST_FAILED, (ev) => {
            UiConsoleComponent.showMessage(UIConsoleAlertType.ERROR, ev.message ?? '');
        });
    }

    onRequestsNumberChange(requestCompleted = false): void {
        this.requestsInProgress += requestCompleted ? -1 : 1;
        if (this.state.loading !== this.requestsInProgress > 0) {
            this.setState({
                loading: this.requestsInProgress > 0
            });
        }
    }

    render(): JSX.Element {
        let drawer: JSX.Element = <></>;
        let content: JSX.Element;

        if (this.state.session) {
            const pages = [
                { link: 'recordings', icon: <YouTube />, page: <RecordingsPage session={this.state.session} /> },
                { link: 'cameras', icon: <Videocam />, page: <CamerasPage session={this.state.session} /> },
                { link: 'sync-modules', icon: <Cloud />, page: <SyncModulesPage session={this.state.session} /> },
                { link: 'networks', icon: <Language />, page: <NetworksPage session={this.state.session} /> }
            ];

            content = (
                <Switch>
                    <Route path="/" exact={true}>
                        <Redirect to="/recordings" />
                    </Route>
                    {pages.map((pageConfig, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <Route path={`/${pageConfig.link}`} key={index}>
                            {pageConfig.page}
                        </Route>
                    ))}
                </Switch>
            );
            drawer = (
                <Drawer className={styles.drawer} variant="permanent">
                    <Toolbar />
                    <div className={styles.drawerMenu}>
                        <List>
                            {pages.map((pageConfig, index) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <NavLink to={pageConfig.link} key={index}>
                                    <ListItem className={styles.drawerMenuItem} button>
                                        <ListItemIcon className={styles.icon}>
                                            {pageConfig.icon}
                                        </ListItemIcon>
                                        <ListItemText primary={this.props.t(`${pageConfig.link}-page.title`)} />
                                    </ListItem>
                                </NavLink>
                            ))}
                        </List>
                    </div>
                </Drawer>
            );
        } else {
            content = (
                <LoginPage onLogin={(session) => {
                    // eslint-disable-next-line no-undef
                    localStorage.setItem('existingSession', JSON.stringify(session));
                    this.setState({
                        session: session
                    });
                }}
                />
            );
        }

        return (
            <div className={styles.dashboardLayout}>
                <AppBar className={styles.appBar} position="fixed">
                    <Toolbar className={styles.appBarToolbar}>
                        <Typography variant="h4" noWrap>
                            {this.props.t('application.title')}
                        </Typography>
                        {this.state.session && (
                            <IconButton
                                edge="end"
                                onClick={(ev) => {
                                    this.setState({
                                        accountMenuAnchor: ev.currentTarget
                                    });
                                }}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                        )}
                        <Menu
                            anchorEl={this.state.accountMenuAnchor}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={!!this.state.accountMenuAnchor}
                            onClose={() => {
                                this.setState({
                                    accountMenuAnchor: undefined
                                });
                            }}
                        >
                            <MenuItem disabled={true}>
                                {this.state.session?.account.email}
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    // eslint-disable-next-line no-undef
                                    localStorage.removeItem('existingSession');
                                    this.setState({
                                        session: undefined,
                                        accountMenuAnchor: undefined
                                    });
                                }}
                            >
                                <ExitToApp />
                                {this.props.t('app-bar.menu-label.account.label.logout')}
                            </MenuItem>
                        </Menu>
                    </Toolbar>
                    {this.state.loading && <LinearProgress />}
                </AppBar>
                {drawer}
                <main>
                    <div className={styles.dashboardContent}>
                        <Toolbar />
                        {content}
                    </div>
                </main>
                <UiConsoleComponent />
            </div>
        );
    }
}

export default withTranslation()(MainLayout);
