import React, { PropsWithChildren } from 'react';
import { Grid } from '@material-ui/core';
import { YouTube } from '@material-ui/icons';
import moment from 'moment';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Container } from 'typedi';
import DashboardPageLayout from '../../layouts/dashboard-page/DashboardPageLayout';
import Media from '../../../domain/entities/Media';
import RecordingComponent from '../../components/recoding/RecordingComponent';
import Session from '../../../domain/entities/Session';
import { MediaRepository } from '../../../infrastructure/repositories/MediaRepository';
import { mediaRepositoryToken } from '../../config/ServiceLocator';

interface RecordingsPageState {
    recordings: Media[];
    loading: boolean;
}

interface RecordingsPageProps extends WithTranslation {
    session: Session;
}

class RecordingsPage extends React.Component<PropsWithChildren<RecordingsPageProps>,
    RecordingsPageState> {
    mediaRepository: MediaRepository = Container.get(mediaRepositoryToken);

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
        return this.mediaRepository
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
            <DashboardPageLayout
                loading={this.state.loading}
                title={this.props.t('recordings-page.title')}
                icon={<YouTube />}
            >
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

export default withTranslation()(RecordingsPage);
