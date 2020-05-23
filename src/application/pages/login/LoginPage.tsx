import React from 'react';
import { TextField } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import AuthRepositoryImpl from '../../../infrastructure/repositories/impl/blink/AuthRepositoryImpl';
import Session from '../../../domain/entities/Session';

interface LoginPageState {
    username?: string;
    password?: string;
}

interface LoginPageProps {
    onLogin: (session: Session) => void;
}

export default class LoginPage extends React.Component<LoginPageProps, LoginPageState> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    onFieldUpdate(field: keyof LoginPageState, value?: string) {
        this.setState({
            [field]: value
        });
    }


    onLogin() {
        if (this.state.username && this.state.password) {
            new AuthRepositoryImpl('http://localhost:8080')
                .login(this.state.username, this.state.password)
                .then((session) => {
                    this.props.onLogin(session);
                });
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
                    Login
                </Typography>
                <form noValidate autoComplete="off">
                    <TextField
                        size="small"
                        required={true}
                        label="Username"
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
                        label="Password"
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
                            Login
                        </Button>
                    </div>
                </form>
            </Card>
        );
    }
}
