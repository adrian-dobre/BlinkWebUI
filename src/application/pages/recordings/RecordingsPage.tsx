import React, { PropsWithChildren } from 'react';
import { Grid, Paper } from '@material-ui/core';
import { YouTube } from '@material-ui/icons';
import DashboardPageLayout from '../../layouts/dashboard-page/DashboardPageLayout';

export default class RecordingsPage extends React.Component<PropsWithChildren<{}>, {}> {
    render(): JSX.Element {
        let data: number[] = Array.from({ length: 100 });
        data = data.fill(1, 0, 100);
        console.log(data);

        return (
            <DashboardPageLayout title="Recordings">
                <Grid container spacing={2} justify="center">
                    {data.map((value, index) => (
                        <Grid key={index} item>
                            <Paper
                                style={{
                                    textAlign: 'center',
                                    height: 140,
                                    width: 200
                                }}
                            >
                                <YouTube
                                    style={{
                                        fontSize: '140px'
                                    }}
                                />
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </DashboardPageLayout>
        );
    }
}
