/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

// scss.d.ts
declare module '*.css' {
    const content: { [className: string]: string };
    export default content;
}
declare module '*.scss' {
    const content: { [className: string]: string };
    export default content;
}
