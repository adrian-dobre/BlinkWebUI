/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

import React, { PropsWithChildren } from 'react';
import { Paper, Typography } from '@material-ui/core';
import { withTranslation, WithTranslation } from 'react-i18next';
import styles from './DashboardPageLayoutStyle.module.scss';
import LoadingComponent from '../../components/loading/LoadingComponent';

interface DashboardPageLayoutProps extends WithTranslation{
    title: string;
    loading?: boolean;
    className?: string;
    icon?: React.ReactNode;
}

class DashboardPageLayout extends React.PureComponent<PropsWithChildren<DashboardPageLayoutProps>> {
    componentDidMount() {
        // eslint-disable-next-line no-undef
        document.title = `${this.props.t('application.title')} - ${this.props.title}`;
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
                </Paper>
                <div className={`${styles.pageContent} ${this.props.className ?? ''}`}>{content}</div>
            </div>
        );
    }
}

export default withTranslation()(DashboardPageLayout);
