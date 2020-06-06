/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

import React from 'react';
import Switch from '@material-ui/core/Switch';
import CircularProgress from '@material-ui/core/CircularProgress';
import styles from './AsyncSwitchComponentStyle.module.scss';

interface AsyncSwitchComponentProps {
    disabled?: boolean;
    color?: 'primary' | 'secondary' | 'default';
    onChange: () => Promise<void>;
    checked?: boolean;
}

interface AsyncSwitchComponentState {
    loading?: boolean;
    checked?: boolean;
}

export default class AsyncSwitchComponent
    extends React.PureComponent<AsyncSwitchComponentProps, AsyncSwitchComponentState> {
    constructor(props: AsyncSwitchComponentProps) {
        super(props);
        this.state = {
            checked: props.checked
        };
    }

    onChange(): void {
        this.setState((prevState) => ({
            loading: true,
            checked: !prevState.checked
        }));

        this.props.onChange()
            .then((result) => {
                this.setState((prevState) => ({
                    loading: false
                }));
                return result;
            })
            .catch((reason) => {
                this.setState((prevState) => ({
                    loading: false,
                    checked: !prevState.checked
                }));
                throw reason;
            });
    }

    render(): JSX.Element {
        return (
            <div className={styles.asyncSwitchComponent}>
                <Switch
                    disabled={this.state.loading || this.props.disabled}
                    onChange={(): void => this.onChange()}
                    checked={this.state.checked}
                    color={this.props.color}
                    className={styles.switch}
                />
                {this.state.loading && (
                    <CircularProgress
                        size={20}
                        className={styles.progress}
                    />
                )}
            </div>
        );
    }
}
