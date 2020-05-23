import React from 'react';
import {
    Battery50,
    BatteryAlert,
    BatteryFull
} from '@material-ui/icons';

interface SignalIndicatorComponentProps {
    strength: number;
}

export default class BatteryIndicatorComponent extends React.PureComponent<SignalIndicatorComponentProps> {
    render(): JSX.Element {
        let indicator: JSX.Element;
        switch (this.props.strength) {
            case 1:
                indicator = <BatteryAlert />;
                break;
            case 2:
                indicator = <Battery50 />;
                break;
            default:
                indicator = <BatteryFull />;
                break;
        }
        return indicator;
    }
}
