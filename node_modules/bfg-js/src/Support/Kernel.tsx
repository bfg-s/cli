import {ServiceProvider, ServiceProviderInterface} from "./ServiceProvider";
import {ApplicationContainer} from "./Application";
import {Str} from "./Str";
import {Obj} from "./Obj";
import {Num} from "./Num";
import {Log} from "./Log";
import {EventCollect} from "./EventCollect";

export interface KernelInterface extends ServiceProviderInterface {
    start: Number
    dev: boolean
    globalize(): void
}

export class Kernel extends ServiceProvider implements KernelInterface {

    app: ApplicationContainer;

    constructor(
        public start: Number,
        public dev: boolean = false
    ) {
        super();

    }

    register(): void {

        this.app.bind('start', this.start);
        this.app.bind('env', process.env.NODE_ENV);
        this.app.bind('local', process.env.NODE_ENV === 'development');
        this.app.bind('dev', this.dev);
        this.app.bind('console', console);
        this.app.bind('event', new EventCollect());
        this.app.bind('system', Kernel.sys, true);
        this.app.bind('log', new Log(this.app));
        this.app.bind('version', Kernel.version, true);
        this.app.bind('token', Kernel.token);
        this.app.bind('os', Kernel.os, true);
        this.app.bind('str', new Str());
        this.app.bind('obj', new Obj());
        this.app.bind('num', new Num());
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

    static token () {

        let token = document.querySelector('meta[name="csrf-token"]');
        return token ? token.getAttribute('content') : null;
    }
}