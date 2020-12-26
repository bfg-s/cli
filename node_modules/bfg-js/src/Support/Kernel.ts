import {ServiceProvider} from "./ServiceProvider";
import {Str, StrInterface} from "./Str";
import {Obj, ObjInterface} from "./Obj";
import {Num, NumInterface} from "./Num";
import {Log, LogInterface} from "./Log";
import {EventCollect, EventInterface} from "./EventCollect";
import {Json, JsonInterface} from "./Json";
import {ApplicationContainer} from "./Application";
import {Request} from "./Request";

export interface KernelInterface {
    globalize(): void
}

interface anyObject {
    [key: string]: any
}

export class Kernel extends ServiceProvider<ApplicationContainer> implements KernelInterface {

    register(): void {
        let dev = false;
        if (process.env.NODE_ENV === 'development') {
            dev = true;
        }
        this.app.register(Request);
        this.app.bind('start', (new Date()).getTime());
        this.app.bind('env', process.env.NODE_ENV);
        this.app.bind('dev', dev);
        this.app.bind('console', console);
        this.app.bind('event', new EventCollect());
        this.app.bind('system', Kernel.sys, true);
        this.app.bind('log', new Log(this.app));
        this.app.bind('version', Kernel.version, true);
        this.app.compute('token', () => this.app.server.token);
        this.app.bind('os', Kernel.os, true);
        this.app.bind('str', new Str());
        this.app.bind('obj', new Obj(this.app));
        this.app.bind('num', new Num());
        this.app.bind('json', new Json());
        this.app.bind('data', {});

        if (String(this.app.system) === 'browser') {
            let bfg_json = document.getElementById('bfg-page-json');
            if (bfg_json) {
                let bfg_json_string: string = bfg_json.innerText;
                let result = this.app.json.decode(bfg_json_string);
                if (result) {
                    this.app.bind('data', result);
                }
            }
        }
    }

    boot(): void {

    }

    globalize(): void {
        if (this.app.system === 'browser') {
            window.app = this.app;
        } else if (this.app.system === 'node') {
            (globalThis as any).app = this.app;
        }
    }

    static version () {

        return "1.0.0";
    }

    static sys () {

        if (typeof Window !== 'undefined') {

            return "browser"
        }

        return "node"
    }

    static os () {

        if (Kernel.sys() === 'node') {

            return 'CLI';
        }

        let userAgent = window.navigator.userAgent,
            platform = window.navigator.platform,
            macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
            windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
            iosPlatforms = ['iPhone', 'iPad', 'iPod'],
            os = null;

        if (macosPlatforms.indexOf(platform) !== -1) {
            os = 'MacOS';
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            os = 'iOS';
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            os = 'Windows';
        } else if (/Android/.test(userAgent)) {
            os = 'Android';
        } else if (/Linux/.test(platform)) {
            os = 'Linux';
        }

        return os;
    }
}