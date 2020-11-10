import {ApplicationContainer} from "./Application";

export interface LogInterface {
    app: ApplicationContainer,
    log (...data: Array<any>): void,
    warn (...data: Array<any>): void,
    info (...data: Array<any>): void,
    error (...data: Array<any>): void,
    table (...data: Array<any>): void,
    clear(): void,
}

export class Log implements LogInterface {

    static glob: Log;
    static getConsole: Function;

    constructor(public app: ApplicationContainer) {
        Log.glob = this;
        Log.getConsole = (prop: string) => {
            return (...data: Array<any>) => {
                let c = this.app.console;
                if (prop in c) {
                    c[prop](Log.glob.prompt, ...data);
                } else if (prop in Log.glob) {
                    if (typeof (Log.glob as any)[prop] === 'function') {
                        return (Log.glob as any)[prop](...data);
                    } else {
                        return (Log.glob as any)[prop];
                    }
                }
            };
        };
        return new Proxy(Log.glob.log as any, {
            get (target: Function, prop: any) {
                return Log.getConsole(prop);
            },
            has (target: Function, p: string) {
                return p === 'proxy'
            }
        });
    }

    log (...data: Array<any>) {
        Log.getConsole('log')(...data);
    }

    info (...data: Array<any>) {
        Log.getConsole('info')(...data);
    }

    warn (...data: Array<any>) {
        Log.getConsole('warn')(...data);
    }

    error (...data: Array<any>) {
        Log.getConsole('error')(...data);
    }

    table (...data: Array<any>) {
        Log.getConsole('table')(...data);
    }

    clear () {
        Log.getConsole('clear')();
    }

    get prompt () {
        return `[${(new Date()).toLocaleTimeString('en-US', { hour12: false })}]:`;
    }
}