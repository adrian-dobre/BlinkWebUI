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
                />
            </div>
        );
    }
}
