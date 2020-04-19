import React, { PropsWithChildren } from 'react';
import DashboardPageLayout from '../../layouts/dashboard-page/DashboardPageLayout';

export default class SettingsPage extends React.Component<PropsWithChildren<{}>, {}> {
    render(): JSX.Element {
        return <DashboardPageLayout title="Settings">Settings</DashboardPageLayout>;
    }
}
