import React from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerComponentProps {
    mediaStream: MediaStream | string;
}

export default class VideoPlayerComponent extends React.PureComponent<VideoPlayerComponentProps> {
    render(): JSX.Element {
        return (
            <div
                onClick={(event) => {
                    event.stopPropagation();
                }}
            >
                <ReactPlayer
                    url={this.props.mediaStream}
                    controls={true}
                    playing={true}
                    width={640}
                    style={{
                        position: 'fixed',
                        left: 'calc(50% - 320px)',
                        top: 'calc(25vh)'
                    }}
                />
            </div>
        );
    }
}
