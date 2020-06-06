/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

import React, { PropsWithChildren } from 'react';
import Grid from '@material-ui/core/Grid';
import YouTube from '@material-ui/icons/YouTube';
import moment from 'moment';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Container } from 'typedi';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Today from '@material-ui/icons/Today';
import DashboardPageLayout from '../../layouts/dashboard-page/DashboardPageLayout';
import Media from '../../../domain/entities/Media';
import RecordingComponent from '../../components/recoding/RecordingComponent';
import Session from '../../../domain/entities/Session';
import { MediaRepository } from '../../../infrastructure/repositories/MediaRepository';
import { mediaRepositoryToken } from '../../config/ServiceLocator';
import styles from './RecordingsPage.module.scss';

interface RecordingsPageState {
    recordings: Media[];
    loading: boolean;
    recordingSets: { [k: string]: Media[] };
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
            loading: true,
            recordingSets: {}
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
                this.setState((previousState) => {
                    const recSet: { [k: string]: Media[] } = {};
                    previousState.recordings.forEach((recording) => {
                        const recKey = moment(recording.createdAt).format('MMM Do YYYY');
                        if (!recSet[recKey]) {
                            recSet[recKey] = [];
                        }
                        recSet[recKey].push(recording);
                    });
                    return {
                        loading: false,
                        recordingSets: recSet
                    };
                });
            });
    }

    render(): JSX.Element {
        return (
            <DashboardPageLayout
                loading={this.state.loading}
                title={this.props.t('recordings-page.title')}
                icon={<YouTube />}
                className={styles.recordingsPage}
            >

                {Object.keys(this
                    .state
                    .recordingSets)
                    .map((recordingKey) => (
                        <Paper
                            key={recordingKey}
                            elevation={0}
                            className={styles.recordingsSection}
                        >
                            <Typography
                                variant="h6"
                                className={styles.sectionTitle}
                            >
                                <Today
                                    className={styles.icon}
                                />
                                {recordingKey}
                            </Typography>
                            <Grid
                                container
                                spacing={2}
                                className={styles.recordingsGrid}
                            >
                                {this.state.recordingSets[recordingKey].map((recording) => (
                                    <Grid key={recording.id} item>
                                        <RecordingComponent
                                            session={this.props.session}
                                            media={recording}
                                            regionId={this.props.session.region.tier}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    ))}
            </DashboardPageLayout>
        );
    }
}

export default withTranslation()(RecordingsPage);
