import React from 'react';
import { TextField } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { withTranslation, WithTranslation } from 'react-i18next';
import AuthRepositoryImpl from '../../../infrastructure/repositories/impl/blink/AuthRepositoryImpl';
import Session from '../../../domain/entities/Session';
import SimplePubSub, { PubSubEvent } from '../../utils/SimplePubSub';
import AccountRepositoryImpl from '../../../infrastructure/repositories/impl/blink/AccountRepositoryImpl';

interface LoginPageState {
    username?: string;
    password?: string;
}

interface LoginPageProps extends WithTranslation {
    onLogin: (session: Session) => void;
}

class LoginPage extends React.Component<LoginPageProps, LoginPageState> {
    constructor(props: any) {
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
            new AuthRepositoryImpl('http://localhost:8080')
                .login(this.state.username, this.state.password)
                .then((session) => new AccountRepositoryImpl('http://localhost:8080')
                    .getAccount(session.region.tier, session.authtoken.authtoken)
                    .then((account) => {
                        SimplePubSub.publish(PubSubEvent.UI_CONSOLE_SUCCESS, {
                            message: `Welcome ${account.email}`
                        });
                        this.props.onLogin(session);
                    }));
        }
    }

    render(): JSX.Element {
        return (
            <Card
                style={{
                    width: '500px', padding: '30px', position: 'relative', top: '150px', left: 'calc(50vw - 250px)'
                }}
            >
                <Typography variant="h4" style={{ paddingBottom: '20px' }}>
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
                        onChange={(event) => {
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
                        onChange={(event) => {
                            this.onFieldUpdate('password', event.target.value);
                        }}
                    />
                    <div style={{ textAlign: 'right', paddingTop: '20px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
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
