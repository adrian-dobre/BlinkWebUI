import React from 'react';
import { TextField } from '@material-ui/core';
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
}

interface LoginPageProps extends WithTranslation {
    onLogin: (session: Session) => void;
}

class LoginPage extends React.Component<LoginPageProps, LoginPageState> {
    authRepository: AuthRepository = Container.get(authRepositoryToken)

    constructor(props: LoginPageProps) {
        super(props);
        this.state = {};
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
                    SimplePubSub.publish(PubSubEvent.UI_CONSOLE_SUCCESS, {
                        message: `Welcome ${this.state.username}`
                    });
                    // eslint-disable-next-line no-param-reassign
                    session.account.email = this.state.username;
                    this.props.onLogin(session);
                });
        }
    }

    render(): JSX.Element {
        return (
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
        );
    }
}

export default withTranslation()(LoginPage);
