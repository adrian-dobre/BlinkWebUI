import React, { PropsWithChildren } from 'react';
import { Grid } from '@material-ui/core';
import { YouTube } from '@material-ui/icons';
import moment from 'moment';
import DashboardPageLayout from '../../layouts/dashboard-page/DashboardPageLayout';
import Media from '../../../domain/entities/Media';
import MediaRepositoryImpl from '../../../infrastructure/repositories/impl/blink/MediaRepositoryImpl';
import RecordingComponent from '../../components/recoding/RecordingComponent';
import Session from '../../../domain/entities/Session';

interface RecordingsPageState {
    recordings: Media[];
    loading: boolean;
}

interface RecordingsPageProps {
    session: Session;
}

export default class RecordingsPage extends React.Component<PropsWithChildren<RecordingsPageProps>,
    RecordingsPageState> {
    constructor(props: RecordingsPageProps) {
        super(props);
        this.state = {
            recordings: [],
            loading: true
        };
    }

    componentDidMount(): void {
        this.getRecordingsList();
    }

    getRecordingsList(page = 1): Promise<any> {
        return new MediaRepositoryImpl('http://localhost:8080')
            .getMediaList(
                this.props.session.region.tier,
                this.props.session.account.id.toString(),
                this.props.session.authtoken.authtoken,
                page
            )
            .then((mediaList) => {
                this.setState((previousState) => ({
                    loading: false,
                    recordings: mediaList
                        .concat(previousState.recordings)
                        .sort((a, b) => moment(b.createdAt).unix() - moment(a.createdAt).unix())
                }));
                if (mediaList.length === 25) {
                    // eslint-disable-next-line no-plusplus,no-param-reassign
                    return this.getRecordingsList(++page);
                }
            });
    }

    render(): JSX.Element {
        return (
            <DashboardPageLayout loading={this.state.loading} title="Recordings" icon={<YouTube />}>
                <Grid container spacing={2}>
                    {this
                        .state
                        .recordings
                        .map((recording, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <Grid key={index} item>
                                <RecordingComponent
                                    session={this.props.session}
                                    media={recording}
                                    regionId={this.props.session.region.tier}
                                />
                            </Grid>
                        ))}
                </Grid>
            </DashboardPageLayout>
        );
    }
}
