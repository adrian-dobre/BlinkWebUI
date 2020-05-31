import React, { PropsWithChildren } from 'react';
import { Backdrop, Paper } from '@material-ui/core';
import { YouTube } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { Container } from 'typedi';
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
}

interface RecordingComponentProps {
    regionId: string;
    media: Media;
    session: Session;
}

export default class RecordingComponent
    extends React.Component<PropsWithChildren<RecordingComponentProps>, RecordingComponentState> {
    mediaRepository: MediaRepository = Container.get(mediaRepositoryToken);

    constructor(props: RecordingComponentProps) {
        super(props);
        this.state = {
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

    getMedia(region: string, mediaPath: string, authToken: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.mediaRepository
                .getMedia(region, mediaPath, authToken)
                .then((thumb) => {
                    // eslint-disable-next-line no-undef
                    const reader = new FileReader();
                    reader.readAsDataURL(thumb);
                    reader.onerror = reject;
                    reader.onloadend = () => {
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
                    onClick={() => {
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
                    onClick={() => {
                        this.onRecordingClick();
                    }}
                    className={styles.recording}
                >
                    {thumbnail}
                    <YouTube
                        className={styles.recordingIcon}
                    />
                    <Typography>{moment(this.props.media.createdAt).format('DD/MM/YYYY HH:mm:ss')}</Typography>
                </Paper>
            </div>
        );
    }
}
