/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

import React from 'react';
import TextField from '@material-ui/core/TextField/TextField';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Container } from 'typedi';
import Session from '../../../domain/entities/Session';
import SimplePubSub, { PubSubEvent } from '../../utils/SimplePubSub';
import styles from './LoginPageStyle.module.scss';
import { AuthRepository } from '../../../infrastructure/repositories/AuthRepository';
import { authRepositoryToken } from '../../config/ServiceLocator';

interface LoginPageState {
    username?: string;
    password?: string;
    pin?: number;
    verifyPin?: boolean;
    session?: Session;
}

interface LoginPageProps extends WithTranslation {
    onLogin: (session: Session) => void;
}

class LoginPage extends React.Component<LoginPageProps, LoginPageState> {
    authRepository: AuthRepository = Container.get(authRepositoryToken)

    constructor(props: LoginPageProps) {
        super(props);
        this.state = {
            verifyPin: false
        };
    }

    onFieldUpdate(field: keyof LoginPageState, value?: string): void {
        this.setState({
            [field]: value
        });
    }

    onLogin(): void {
        if (this.state.username && this.state.password) {
            this.authRepository
                .login(this.state.username, this.state.password)
                .then((session: Session) => {
                    // eslint-disable-next-line no-param-reassign
                    session.account.email = this.state.username;
                    if (session.client.verificationRequired) {
                        this.setState({
                            verifyPin: true,
                            session: session
                        });
                    } else {
                        this.setState({
                            verifyPin: false,
                            session: session
                        });
                        this.onLoginCompleted();
                    }
                });
        }
    }

    onLoginCompleted(): void {
        SimplePubSub.publish(PubSubEvent.UI_CONSOLE_SUCCESS, {
            message: `Welcome ${this.state.username}`
        });

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.props.onLogin(this.state.session!);
    }

    onVerifyPin(): void {
        if (this.state.pin && this.state.session) {
            this.authRepository
                .verifyPin(
                    this.state.session.region.tier,
                    this.state.session.account.id.toString(),
                    this.state.session.client.id,
                    this.state.pin,
                    this.state.session.authtoken.authtoken
                )
                .then((verification) => {
                    if (verification.valid) {
                        this.onLoginCompleted();
                    }
                });
        }
    }

    render(): JSX.Element {
        return (
            this.state.verifyPin
                ? (
                    <Card className={styles.verifyPinCard}>
                        <Typography variant="h4" className={styles.cardTitle}>
                            {this.props.t('login-page.verify-pin-form.verify-pin-title')}
                        </Typography>
                        <Typography className={styles.cardDescription}>
                            {this.props.t('login-page.verify-pin-form.verify-pin-description')}
                        </Typography>
                        <form noValidate autoComplete="off">
                            <TextField
                                size="small"
                                required={true}
                                label={this.props.t('login-page.verify-pin-form.field-label.pin')}
                                fullWidth
                                margin="dense"
                                variant="outlined"
                                onChange={(event): void => {
                                    this.onFieldUpdate('pin', event.target.value);
                                }}
                            />
                            <div className={styles.cardActions}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={(): void => {
                                        this.onVerifyPin();
                                    }}
                                >
                                    {this.props.t('login-page.verify-pin-form.button-label.verify-pin')}
                                </Button>
                            </div>
                        </form>
                    </Card>
                )
                : (
                    <Card className={styles.loginCard}>
                        <Typography variant="h4" className={styles.cardTitle}>
                            {this.props.t('login-page.login-form.title')}
                        </Typography>
                        <form noValidate autoComplete="off">
                            <TextField
                                size="small"
                                required={true}
                                label={this.props.t('login-page.login-form.field-label.username')}
                                fullWidth
                                margin="dense"
                                variant="outlined"
                                onChange={(event): void => {
                                    this.onFieldUpdate('username', event.target.value);
                                }}
                            />
                            <TextField
                                type="password"
                                size="small"
                                required={true}
                                label={this.props.t('login-page.login-form.field-label.password')}
                                fullWidth
                                margin="dense"
                                variant="outlined"
                                onChange={(event): void => {
                                    this.onFieldUpdate('password', event.target.value);
                                }}
                            />
                            <div className={styles.cardActions}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={(): void => {
                                        this.onLogin();
                                    }}
                                >
                                    {this.props.t('login-page.login-form.button-label.login')}
                                </Button>
                            </div>
                        </form>
                    </Card>
                )
        );
    }
}

export default withTranslation()(LoginPage);
