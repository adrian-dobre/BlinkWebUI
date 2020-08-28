/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

import React, { PropsWithChildren } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import Paper from '@material-ui/core/Paper';
import YouTube from '@material-ui/icons/YouTube';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { Container } from 'typedi';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import withStyles from '@material-ui/core/styles/withStyles';
import Media from '../../../domain/entities/Media';
import Session from '../../../domain/entities/Session';
import VideoPlayerComponent from '../video-player/VideoPlayerComponent';
import LoadingComponent from '../loading/LoadingComponent';
import styles from './RecordingComponentStyle.module.scss';
import { MediaRepository } from '../../../infrastructure/repositories/MediaRepository';
import { mediaRepositoryToken } from '../../config/ServiceLocator';

interface RecordingComponentState {
    thumb?: string;
    media?: string;
    loading: boolean;
    isPlaying: boolean;
    selected: boolean;
}

interface RecordingComponentProps {
    regionId: string;
    media: Media;
    session: Session;
    onSelected?: (added: boolean) => void;
}

const WhiteCheckbox = withStyles({
    root: {
        color: '#ffffff',
        '&$checked': {
            color: '#ffffff'
        }
    },
    checked: {}
// eslint-disable-next-line react/jsx-props-no-spreading
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

export default class RecordingComponent
    extends React.Component<PropsWithChildren<RecordingComponentProps>, RecordingComponentState> {
    mediaRepository: MediaRepository = Container.get(mediaRepositoryToken);

    constructor(props: RecordingComponentProps) {
        super(props);
        this.state = {
            selected: false,
            loading: true,
            isPlaying: false
        };
    }

    componentDidMount(): void {
        this.getMedia(
            this.props.session.region.tier,
            this.props.media.thumbnail,
            this.props.session.authtoken.authtoken
        ).then((media) => {
            this.setState({
                loading: false,
                thumb: media as string
            });
        });
    }

    onRecordingClick(): void {
        this.setState({
            isPlaying: true
        });
        this.getMedia(
            this.props.session.region.tier,
            this.props.media.media,
            this.props.session.authtoken.authtoken
        ).then((media) => {
            this.setState({
                media: media as string
            });
        });
    }

    onRecordingSelected(): void {
        this.setState((prevState) => {
            if (this.props.onSelected) {
                this.props.onSelected(!prevState.selected);
            }
            return {
                selected: !prevState.selected
            };
        });
    }


    getMedia(region: string, mediaPath: string, authToken: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.mediaRepository
                .getMedia(region, mediaPath, authToken)
                .then((thumb) => {
                    // eslint-disable-next-line no-undef
                    const reader = new FileReader();
                    reader.readAsDataURL(thumb);
                    reader.onerror = reject;
                    reader.onloadend = (): void => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                        // @ts-ignore
                        resolve(reader.result as string);
                    };
                });
        });
    }

    render(): JSX.Element {
        let thumbnail: JSX.Element = (
            <div className={styles.thumbnailPlaceholder} />
        );
        let player: JSX.Element = <></>;

        if (!this.state.loading) {
            thumbnail = (
                <img
                    alt=""
                    src={this.state.thumb}
                    height="110px"
                    className={styles.thumbnailStyle}
                />
            );
        }

        if (this.state.isPlaying) {
            player = (
                <Backdrop
                    open={true}
                    className={styles.playerBackdrop}
                    onClick={(): void => {
                        this.setState({
                            isPlaying: false
                        });
                    }}
                >
                    {this.state.media && <VideoPlayerComponent mediaStream={this.state.media} />}
                    {!this.state.media && <LoadingComponent />}
                </Backdrop>
            );
        }

        return (
            <div className={styles.recordingComponent}>
                {player}
                <Paper
                    elevation={0}
                    onClick={(): void => {
                        this.onRecordingClick();
                    }}
                    className={styles.recording}
                >
                    {thumbnail}
                    <YouTube
                        className={styles.recordingIcon}
                    />
                    <WhiteCheckbox
                        className={styles.recordingCheckmark}
                        checked={this.state.selected}
                        onChange={(): void => {
                            this.onRecordingSelected();
                        }}
                        onClick={(event: { stopPropagation: () => void }): void => {
                            event.stopPropagation();
                        }}
                        color="primary"
                    />
                    <Typography>{moment(this.props.media.createdAt).format('MMM Do YYYY HH:mm:ss')}</Typography>
                </Paper>
            </div>
        );
    }
}
