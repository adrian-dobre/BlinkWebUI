import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';


export default class LoadingComponent extends React.PureComponent {
    render(): JSX.Element {
        return <CircularProgress />;
    }
}
