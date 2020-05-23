import React, { PropsWithChildren } from 'react';
import { Paper, Typography } from '@material-ui/core';
import './DashboardPageLayout-style.scss';
import LoadingComponent from '../../components/loading/LoadingComponent';

interface DashboardPageLayoutProps {
    title: string;
    loading?: boolean;
    className?: string;
    icon?: React.ReactNode;
}

export default class DashboardPageLayout extends React.PureComponent<PropsWithChildren<DashboardPageLayoutProps>> {
    componentDidMount() {
        // eslint-disable-next-line no-undef
        document.title = `Blink Web - ${this.props.title}`;
    }

    render(): JSX.Element {
        let content: JSX.Element;
        if (this.props.loading) {
            content = (
                <div className="loading">
                    <LoadingComponent />
                </div>
            );
        } else {
            content = this.props.children as JSX.Element;
        }

        return (
            <div className="dashboard-page">
                <Paper className="page-title-wrapper">
                    <div className="page-title">
                        <Typography variant="h4">
                            {this.props.icon}
                            {this.props.title}
                        </Typography>
                    </div>
                </Paper>
                <div className={`page-content ${this.props.className ?? ''}`}>{content}</div>
            </div>
        );
    }
}
