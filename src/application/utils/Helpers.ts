/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

export default class Helpers {
    static downloadBlob(name: string, blob: Blob): void {
        const url = window.URL.createObjectURL(blob);
        const a = window.document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = name;
        window.document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    }
}
