/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

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
