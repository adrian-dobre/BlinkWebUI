import React, { PropsWithChildren } from 'react';
import { Paper } from '@material-ui/core';
import { YouTube } from '@material-ui/icons';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import Media from '../../../domain/entities/Media';
import Session from '../../../domain/entities/Session';
import VideoPlayerComponent from '../video-player/VideoPlayerComponent';
import Camera from '../../../domain/entities/Camera';
import MediaRepositoryImpl from '../../../infrastructure/repositories/impl/blink/MediaRepositoryImpl';

interface CameraComponentState {
    thumb?: string;
    media?: string;
    // loading: boolean;
    // isPlaying: boolean;
}

interface CameraComponentProps {
    regionId: string;
    camera: Camera;
    session: Session;
}


export default class CameraComponent
    extends React.Component<PropsWithChildren<CameraComponentProps>, CameraComponentState> {
    constructor(props: CameraComponentProps) {
        super(props);
        this.state = {};
    }

    componentDidMount(): void {
        new MediaRepositoryImpl('http://localhost:8080')
            .getMedia(
                this.props.session.region.tier,
                this.props.camera.thumbnail,
                this.props.session.authtoken.authtoken
            )
            .then((media) => {
                // eslint-disable-next-line no-undef
                const reader = new FileReader();
                reader.readAsDataURL(media);
                reader.onloadend = () => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                    // @ts-ignore
                    this.setState({
                        // loading: false,
                        thumb: reader.result as string
                    });
                };
            });
    }

    render(): JSX.Element {
        const image = (
            <img
                alt=""
                src={this.state.thumb}
                height="110px"
                style={{ margin: 'auto', borderRadius: '3px 3px 0 0' }}
            />
        );

        return (
            <>
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
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: '42px',
                            opacity: 0.5,
                            fontSize: '110px'
                        }}
                    />
                    <Typography>{moment(this.props.camera.createdAt).format('DD/MM/YYYY HH:mm:ss')}</Typography>
                </Paper>
            </>
        );
    }
}
