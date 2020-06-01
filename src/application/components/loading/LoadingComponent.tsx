/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';


export default class LoadingComponent extends React.PureComponent {
    render(): JSX.Element {
        return <CircularProgress />;
    }
}
