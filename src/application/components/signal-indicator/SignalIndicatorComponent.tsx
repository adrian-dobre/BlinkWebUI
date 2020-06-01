/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

import React from 'react';
import {
    SignalWifi0Bar,
    SignalWifi1Bar,
    SignalWifi2Bar,
    SignalWifi3Bar,
    SignalWifi4Bar,
    SignalWifiOff
} from '@material-ui/icons';

interface SignalIndicatorComponentProps {
    strength: number;
}

export default class SignalIndicatorComponent extends React.PureComponent<SignalIndicatorComponentProps> {
    render(): JSX.Element {
        let indicator: JSX.Element;
        switch (this.props.strength) {
            case 0:
                indicator = <SignalWifiOff />;
                break;
            case 1:
                indicator = <SignalWifi0Bar />;
                break;
            case 2:
                indicator = <SignalWifi1Bar />;
                break;
            case 3:
                indicator = <SignalWifi2Bar />;
                break;
            case 4:
                indicator = <SignalWifi3Bar />;
                break;
            default:
                indicator = <SignalWifi4Bar />;
                break;
        }
        return indicator;
    }
}
