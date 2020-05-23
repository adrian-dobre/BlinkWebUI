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
    Cloud, Language, Settings, Videocam, YouTube
} from '@material-ui/icons';
import './DashboardLayout-style.scss';
import { NavLink } from 'react-router-dom';

interface DashboardLayoutProps {
    hideDrawer?: boolean;
}

export default class DashboardLayout extends React.PureComponent<PropsWithChildren<DashboardLayoutProps>, {}> {
    render(): JSX.Element {
        let drawer: JSX.Element = <></>;

        if (!this.props.hideDrawer) {
            drawer = (
                <Drawer className="drawer" variant="permanent">
                    <Toolbar />
                    <div className="drawer-menu">
                        <List>
                            <NavLink to="/recordings">
                                <ListItem className="drawer-menu-item" button key={Math.random()}>
                                    <ListItemIcon className="icon">
                                        <YouTube />
                                    </ListItemIcon>
                                    <ListItemText primary="Recordings" />
                                </ListItem>
                            </NavLink>
                            <NavLink to="/cameras">
                                <ListItem className="drawer-menu-item" button key={Math.random()}>
                                    <ListItemIcon className="icon">
                                        <Videocam />
                                    </ListItemIcon>
                                    <ListItemText primary="Cameras" />
                                </ListItem>
                            </NavLink>
                            <NavLink to="/sync-modules">
                                <ListItem className="drawer-menu-item" button key={Math.random()}>
                                    <ListItemIcon className="icon">
                                        <Cloud />
                                    </ListItemIcon>
                                    <ListItemText primary="Sync Modules" />
                                </ListItem>
                            </NavLink>
                            <NavLink to="/networks">
                                <ListItem className="drawer-menu-item" button key={Math.random()}>
                                    <ListItemIcon className="icon">
                                        <Language />
                                    </ListItemIcon>
                                    <ListItemText primary="Networks" />
                                </ListItem>
                            </NavLink>
                        </List>
                    </div>
                </Drawer>
            );
        }

        return (
            <div className="dashboard-layout">
                <AppBar className="app-bar" position="fixed">
                    <Toolbar>
                        <Typography variant="h4" noWrap>
                            Blink Web
                        </Typography>
                    </Toolbar>
                </AppBar>
                {drawer}
                <main>
                    <div className="dashboard-content">
                        <Toolbar />
                        {this.props.children}
                    </div>
                </main>
            </div>
        );
    }
}
