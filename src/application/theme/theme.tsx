/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';

// eslint-disable-next-line import/prefer-default-export
export const theme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: pink
    }
});
