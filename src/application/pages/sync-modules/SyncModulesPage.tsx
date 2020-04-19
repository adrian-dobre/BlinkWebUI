import React, { PropsWithChildren } from 'react';
import DashboardPageLayout from '../../layouts/dashboard-page/DashboardPageLayout';

export default class SyncModulesPage extends React.Component<PropsWithChildren<{}>, {}> {
    render(): JSX.Element {
        return <DashboardPageLayout title="Sync Modules">Sync Modules</DashboardPageLayout>;
    }
}
