/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

import blue from '@material-ui/core/colors/blue';
import pink from '@material-ui/core/colors/pink';
import { createTheme } from '@material-ui/core';

// eslint-disable-next-line import/prefer-default-export
export const theme = createTheme({
    palette: {
        primary: blue,
        secondary: pink
    }
});
