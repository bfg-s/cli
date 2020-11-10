import { ApplicationContainer } from "./Application";
export interface LogInterface {
    app: ApplicationContainer;
    log(...data: Array<any>): void;
    warn(...data: Array<any>): void;
    info(...data: Array<any>): void;
    error(...data: Array<any>): void;
    table(...data: Array<any>): void;
    clear(): void;
}
export declare class Log implements LogInterface {
    app: ApplicationContainer;
    static glob: Log;
    static getConsole: Function;
    constructor(app: ApplicationContainer);
    log(...data: Array<any>): void;
    info(...data: Array<any>): void;
    warn(...data: Array<any>): void;
    error(...data: Array<any>): void;
    table(...data: Array<any>): void;
    clear(): void;
    get prompt(): string;
}
