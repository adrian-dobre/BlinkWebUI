/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

import React, { PropsWithChildren } from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withTranslation, WithTranslation } from 'react-i18next';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MoreVert from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import LoadingComponent from '../../components/loading/LoadingComponent';
import styles from './DashboardPageLayoutStyle.module.scss';

interface DashboardPageLayoutProps extends WithTranslation {
    title: string;
    loading?: boolean;
    className?: string;
    icon?: React.ReactNode;
    showBulkActions?: boolean;
    menuActions?: {
        key: string | number;
        action: () => void;
        element: React.ReactElement;
    }[];
}

interface DashboardPageLayoutState {
    bulkMenuAnchor?: HTMLElement;
}

class DashboardPageLayout
    extends React.PureComponent<PropsWithChildren<DashboardPageLayoutProps>, DashboardPageLayoutState> {
    constructor(props: DashboardPageLayoutProps) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // eslint-disable-next-line no-undef
        document.title = `${this.props.t('application.title')} - ${this.props.title}`;
    }

    onMenuOpen(element: HTMLElement): void {
        this.setState({
            bulkMenuAnchor: element
        });
    }

    onDismissMenu(): void {
        this.setState({
            bulkMenuAnchor: undefined
        });
    }

    render(): JSX.Element {
        let content: JSX.Element;
        if (this.props.loading) {
            content = (
                <div className={styles.loading}>
                    <LoadingComponent />
                </div>
            );
        } else {
            content = this.props.children as JSX.Element;
        }

        return (
            <div className={styles.dashboardPage}>
                <Paper className={styles.pageTitleWrapper}>
                    <div className={styles.pageTitle}>
                        <Typography variant="h4">
                            {this.props.icon}
                            {this.props.title}
                        </Typography>
                    </div>
                    {this.props.showBulkActions && (
                        <div className={styles.bulkActions}>
                            <IconButton
                                onClick={
                                    (event: { currentTarget: HTMLElement }): void => {
                                        this.onMenuOpen(event.currentTarget);
                                    }
                                }
                                component="span"
                            >
                                <MoreVert />
                            </IconButton>
                        </div>
                    )}
                    <Menu
                        anchorEl={this.state.bulkMenuAnchor}
                        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                        keepMounted
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        open={!!this.state.bulkMenuAnchor}
                        onClose={(): void => {
                            this.onDismissMenu();
                        }}
                    >
                        {this.props.menuActions?.map((item) => (
                            // eslint-disable-next-line react/jsx-key
                            <MenuItem
                                key={item.key}
                                onClick={(): void => {
                                    item.action();
                                    this.onDismissMenu();
                                }}
                            >
                                {item.element}
                            </MenuItem>
                        ))}
                    </Menu>
                </Paper>
                <div className={`${styles.pageContent} ${this.props.className ?? ''}`}>{content}</div>
            </div>
        );
    }
}

export default withTranslation()(DashboardPageLayout);
