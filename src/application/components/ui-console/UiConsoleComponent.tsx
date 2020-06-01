/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

import React from 'react';

import Grow from '@material-ui/core/Grow';
import Alert from '@material-ui/lab/Alert';
import { v4 } from 'uuid';
import SimplePubSub, { PubSubEvent } from '../../utils/SimplePubSub';
import styles from './UiConsoleComponentStyle.module.scss';

export enum UIConsoleAlertType {
    ERROR = 'error',
    WARNING = 'warning',
    INFO = 'info',
    SUCCESS = 'success'
}

interface UIConsoleAlert {
    id: string;
    type: UIConsoleAlertType;
    message: string;
    dismissed?: boolean;
}

export interface UiConsoleComponentState {
    alerts: UIConsoleAlert[];
}


export default class UiConsoleComponent extends React.PureComponent<{}, UiConsoleComponentState> {
    private static eventsToTypeMap: { [k in PubSubEvent]?: UIConsoleAlert['type'] } = {
        [PubSubEvent.UI_CONSOLE_ERROR]: UIConsoleAlertType.ERROR,
        [PubSubEvent.UI_CONSOLE_WARN]: UIConsoleAlertType.WARNING,
        [PubSubEvent.UI_CONSOLE_INFO]: UIConsoleAlertType.INFO,
        [PubSubEvent.UI_CONSOLE_SUCCESS]: UIConsoleAlertType.SUCCESS
    };

    static showMessage(type: UIConsoleAlertType, message: string): void {
        const pubSubEventKey = Object
            .keys(UiConsoleComponent.eventsToTypeMap)
            .find((key: string) => {
                const psek = key as unknown as keyof PubSubEvent;
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                return UiConsoleComponent.eventsToTypeMap[psek] === type;
            });
        if (pubSubEventKey) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            SimplePubSub.publish(pubSubEventKey as unknown as keyof PubSubEvent, { message: message });
        }
    }

    constructor(props: {}) {
        super(props);
        this.state = {
            alerts: []
        };

        Object
            .keys(UiConsoleComponent.eventsToTypeMap)
            .forEach((key: string) => {
                const pubSubEventKey = key as unknown as PubSubEvent;
                SimplePubSub.subscribe(pubSubEventKey, (ev) => {
                    const alertType = UiConsoleComponent.eventsToTypeMap[pubSubEventKey]!;
                    const newAlert = {
                        id: v4(),
                        message: ev.message,
                        type: alertType
                    };

                    if ([UIConsoleAlertType.INFO, UIConsoleAlertType.SUCCESS].includes(alertType)) {
                        setTimeout(() => {
                            this.onAlertDismissed(newAlert);
                        }, 5000);
                    }

                    this.setState((prevState) => {
                        const alerts = [...prevState.alerts];
                        alerts.unshift(newAlert);
                        return {
                            alerts: alerts.slice(0, 5)
                        };
                    });
                });
            });
    }

    onAlertDismissed(alert: UIConsoleAlert): void {
        this.setState((prevState) => ({
            alerts: prevState.alerts.map((prevAlert) => {
                if (prevAlert === alert) {
                    // eslint-disable-next-line no-param-reassign
                    prevAlert.dismissed = true;
                }
                return prevAlert;
            })
        }));
        setTimeout(() => {
            // eslint-disable-next-line no-shadow
            this.setState((prevState) => ({
                // eslint-disable-next-line no-shadow
                alerts: prevState.alerts.filter((prevAlert) => !prevAlert.dismissed)
            }));
        }, 200);
    }

    render(): JSX.Element {
        return (
            <div className={styles.uiConsole}>
                {this.state.alerts
                    .map((alert) => (
                        <Grow
                            key={alert.id}
                            in={!alert.dismissed}
                        >
                            <Alert
                                className={styles.consoleAlert}
                                severity={alert.type}
                                variant="filled"
                                onClose={(): void => this.onAlertDismissed(alert)}
                            >
                                {alert.message}
                            </Alert>
                        </Grow>
                    ))}
            </div>
        );
    }
}
