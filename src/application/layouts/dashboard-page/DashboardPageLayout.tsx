import React, { PropsWithChildren } from 'react';
import { Paper, Typography } from '@material-ui/core';
import './DashboardPageLayout-style.scss';

interface DashboardPageLayoutProps {
    title: string;
}

export default class DashboardPageLayout extends React.Component<PropsWithChildren<DashboardPageLayoutProps>, {}> {
    render(): JSX.Element {
        return (
            <div className="dashboard-page">
                <Paper className="page-title-wrapper">
                    <div className="page-title">
                        <Typography variant="h4">{this.props.title}</Typography>
                    </div>
                </Paper>
                <div className="page-content">{this.props.children}</div>
            </div>
        );
    }
}
