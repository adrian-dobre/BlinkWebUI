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
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';
import Typography from '@material-ui/core/Typography';
import Today from '@material-ui/icons/Today';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import GetAppIcon from '@material-ui/icons/GetApp';
import { DialogTitle } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DashboardPageLayout from '../../layouts/dashboard-page/DashboardPageLayout';
import Media from '../../../domain/entities/Media';
import RecordingComponent from '../../components/recoding/RecordingComponent';
import Session from '../../../domain/entities/Session';
import { MediaRepository } from '../../../infrastructure/repositories/MediaRepository';
import { mediaRepositoryToken } from '../../config/ServiceLocator';
import styles from './RecordingsPageStyle.module.scss';
import Helpers from '../../utils/Helpers';

enum RecordingPageAction {
    DELETE,
    DOWNLOAD
}

interface RecordingsPageState {
    recordings: Media[];
    loading: boolean;
    recordingSets: { [k: string]: Media[] };
    selected: Media[];
    confirmAction?: RecordingPageAction;
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
            recordingSets: {},
            selected: []
        };
    }

    componentDidMount(): void {
        this.getRecordingsList();
    }

    onRecordingSelectionChanged(recording: Media, added: boolean): void {
        this.setState((prevState) => {
            let { selected } = prevState;
            if (added) {
                selected.push(recording);
            } else {
                selected = selected.filter((rec) => rec !== recording);
            }
            return {
                selected: selected
            };
        });
    }

    onAskConfirmAction(action: RecordingPageAction): void {
        this.setState({
            confirmAction: action
        });
    }

    onConfirmAction(confirm: boolean): void {
        const action = this.state.confirmAction;
        this.setState({
            confirmAction: undefined
        });
        if (!confirm) {
            return;
        }
        switch (action) {
            case RecordingPageAction.DELETE:
                return this.onDeleteSelectedMediaList();
            case RecordingPageAction.DOWNLOAD:
                return this.onDownloadSelectedMedia();
            default:
                break;
        }
    }

    onDeleteSelectedMediaList(): void {
        this.mediaRepository
            .deleteMediaList(
                this.props.session.region.tier,
                this.props.session.account.id.toString(),
                this.props.session.authtoken.authtoken,
                this.state.selected.map((media) => media.id)
            )
            .then(() => {
                this.setState((prevState) => {
                    const { selected, recordings } = prevState;

                    return {
                        selected: [],
                        recordings: recordings.filter((rec) => !selected.includes(rec))
                    };
                }, () => {
                    this.createRecordingSets();
                });
            });
    }

    onDownloadSelectedMedia(): void {
        const mediaToDownload = this.state.selected.slice();
        const downloadNextMedia = (): void => {
            const media = mediaToDownload.shift();
            if (media) {
                this.mediaRepository
                    .getMedia(this.props.session.region.tier,
                        media.media,
                        this.props.session.authtoken.authtoken)
                    .then((blob) => {
                        const createdTime = moment(media.createdAt).format('MMM Do YYYY HH:mm:ss');
                        const extension = media.media.replace(/^.*\/(\.[^/]+?)$/, '$1');
                        Helpers.downloadBlob(`${createdTime} - ${extension}`, blob);
                        downloadNextMedia();
                    });
            }
        };
        downloadNextMedia();
    }

    onDeselectAllMedia(): void {
        this.setState({
            selected: []
        });
    }

    onSelectAllMedia(): void {
        this.setState((prevState) => ({
            selected: prevState.recordings.slice()
        }));
    }

    getRecordingsList(page = 1): Promise<void> {
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
                }), () => {
                    if (mediaList.length === 25) {
                        // eslint-disable-next-line no-plusplus,no-param-reassign
                        return this.getRecordingsList(++page);
                    }
                    this.createRecordingSets();
                });
            });
    }

    private createRecordingSets(): void {
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
    }

    renderConfirmDialog(): React.ReactElement {
        return (
            <Dialog
                open={this.state.confirmAction !== undefined}
                onClose={(): void => {
                    this.onConfirmAction(false);
                }}
            >
                <DialogTitle>
                    {this.state.confirmAction === RecordingPageAction.DELETE
                        ? this.props.t('recordings-page.bulk-actions.confirm.delete.title')
                        : this.props.t('recordings-page.bulk-actions.confirm.download.title')}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {this.state.confirmAction === RecordingPageAction.DELETE
                            ? this.props.t('recordings-page.bulk-actions.confirm.delete.content', {
                                itemsNo: this.state.selected.length
                            })
                            : this.props.t('recordings-page.bulk-actions.confirm.download.content', {
                                itemsNo: this.state.selected.length
                            })}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={(): void => {
                            this.onConfirmAction(false);
                        }}
                        color="secondary"
                        autoFocus
                    >
                        {this.props.t('recordings-page.bulk-actions.confirm.disagree')}
                    </Button>
                    <Button
                        onClick={(): void => {
                            this.onConfirmAction(true);
                        }}
                        color="primary"
                    >
                        {this.props.t('recordings-page.bulk-actions.confirm.agree')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    render(): JSX.Element {
        return (
            <DashboardPageLayout
                loading={this.state.loading}
                title={this.props.t('recordings-page.title')}
                icon={<YouTube />}
                className={styles.recordingsPage}
                showBulkActions={this.state.selected.length > 0}
                menuActions={[
                    {
                        key: 'select-all',
                        action: (): void => {
                            this.onSelectAllMedia();
                        },
                        element: (
                            <>
                                <CheckIcon />
                                {this.props.t('recordings-page.bulk-actions.select-all')}
                            </>
                        )
                    },
                    {
                        key: 'deselect-all',
                        action: (): void => {
                            this.onDeselectAllMedia();
                        },
                        element: (
                            <>
                                <ClearIcon />
                                {this.props.t('recordings-page.bulk-actions.deselect-all')}
                            </>
                        )
                    },
                    {
                        key: 'delete',
                        action: (): void => {
                            this.onAskConfirmAction(RecordingPageAction.DELETE);
                        },
                        element: (
                            <>
                                <DeleteOutlineIcon />
                                {this.props.t('recordings-page.bulk-actions.delete')}
                            </>
                        )
                    },
                    {
                        key: 'download',
                        action: (): void => {
                            this.onAskConfirmAction(RecordingPageAction.DOWNLOAD);
                        },
                        element: (
                            <>
                                <GetAppIcon />
                                {this.props.t('recordings-page.bulk-actions.download')}
                            </>
                        )
                    }
                ]}
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
                                            selected={this.state.selected.includes(recording)}
                                            onSelected={(added: boolean): void => {
                                                this.onRecordingSelectionChanged(recording, added);
                                            }}
                                            session={this.props.session}
                                            media={recording}
                                            regionId={this.props.session.region.tier}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    ))}
                {this.renderConfirmDialog()}
            </DashboardPageLayout>
        );
    }
}

export default withTranslation()(RecordingsPage);
