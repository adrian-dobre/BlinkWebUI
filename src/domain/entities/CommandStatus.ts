/*
 * Copyright (c) 2020 Adrian Dobre - GPL v3 License.
 *
 * This file is subject to the terms and conditions defined in
 * the 'LICENSE.txt' file, which is part of this source code package.
 */

export class Command {
    id: number;
    networkId: number;
    command: string;
    state: string;

    constructor(jsonBody: Command) {
        this.id = jsonBody.id;
        this.networkId = jsonBody.id;
        this.command = jsonBody.command;
        this.state = jsonBody.state;
    }
}

export default class CommandStatus {
    id: number;
    command: string;
    state: string;
    complete: boolean;
    status: number;
    statusMsg: string;
    statusCode: number;
    mediaId?: number;
    commands: Command[]

    constructor(jsonBody: CommandStatus) {
        this.id = jsonBody.id;
        this.command = jsonBody.command;
        this.state = jsonBody.state;
        this.complete = jsonBody.complete;
        this.status = jsonBody.status;
        this.statusMsg = jsonBody.statusMsg;
        this.statusCode = jsonBody.statusCode;
        this.mediaId = jsonBody.mediaId;
        this.commands = jsonBody.commands.map((command) => new Command(command));
    }
}
