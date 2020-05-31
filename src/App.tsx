import 'reflect-metadata';
import * as React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import { BrowserRouter as Router } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';
import { I18nextProvider } from 'react-i18next';
import { ServiceLocator } from './application/config/ServiceLocator';
import { theme } from './application/theme/theme';
import MainLayout from './application/layouts/main/MainLayout';
import i18n from './application/i18n/i18n';

ServiceLocator.setup();

class App extends React.PureComponent {
    render(): JSX.Element {
        return (
            <>
                <CssBaseline />
                <ThemeProvider theme={theme}>
                    <I18nextProvider i18n={i18n}>
                        <Router>
                            <MainLayout />
                        </Router>
                    </I18nextProvider>
                </ThemeProvider>
            </>
        );
    }
}

export default hot(App);
