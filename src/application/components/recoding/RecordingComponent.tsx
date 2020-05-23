import React, { PropsWithChildren } from 'react';
import { Paper } from '@material-ui/core';
import { YouTube } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import Media from '../../../domain/entities/Media';
import MediaRepositoryImpl from '../../../infrastructure/repositories/impl/blink/MediaRepositoryImpl';
import Session from '../../../domain/entities/Session';
import VideoPlayerComponent from '../video-player/VideoPlayerComponent';

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

function getCachedMedia(region: string, mediaPath: string, authToken: string): Promise<string> {
    return new Promise((resolve, reject) => {
        new MediaRepositoryImpl('http://localhost:8080')
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

export default class RecordingComponent
    extends React.Component<PropsWithChildren<RecordingComponentProps>, RecordingComponentState> {
    constructor(props: RecordingComponentProps) {
        super(props);
        this.state = {
            loading: true,
            isPlaying: false
        };
    }

    componentDidMount(): void {
        getCachedMedia(
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

    onClick(): void {
        this.setState({
            isPlaying: true
        });
        getCachedMedia(
            this.props.session.region.tier,
            this.props.media.media,
            this.props.session.authtoken.authtoken
        ).then((media) => {
            this.setState({
                media: media as string
            });
        });
    }

    render(): JSX.Element {
        let image: JSX.Element = (
            <div
                style={{
                    height: '110px',
                    background: 'gray',
                    borderRadius: '3px 3px 0 0'
                }}
            />
        );
        let player: JSX.Element = <></>;

        if (!this.state.loading) {
            image = (
                <img
                    alt=""
                    src={this.state.thumb}
                    height="110px"
                    style={{ margin: 'auto', borderRadius: '3px 3px 0 0' }}
                />
            );
        }

        if (this.state.isPlaying) {
            player = (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        background: 'black',
                        width: '100vw',
                        height: '100vh',
                        zIndex: 1500
                    }}
                    onClick={() => {
                        this.setState({
                            isPlaying: false
                        });
                    }}
                >
                    {this.state.media && <VideoPlayerComponent mediaStream={this.state.media} />}
                </div>
            );
        }

        return (
            <>
                {player}
                <Paper
                    style={{
                        position: 'relative',
                        textAlign: 'center',
                        height: '140px',
                        width: '195px'
                    }}
                >
                    {image}
                    <YouTube
                        onClick={() => {
                            this.onClick();
                        }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: '42px',
                            opacity: 0.5,
                            fontSize: '110px'
                        }}
                    />
                    <Typography>{moment(this.props.media.created_at).format('DD/MM/YYYY HH:mm:ss')}</Typography>
                </Paper>
            </>
        );
    }
}
