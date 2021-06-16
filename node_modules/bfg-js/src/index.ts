import App, {ApplicationContainer} from './Support/Application';
import {Kernel} from './Support/Kernel';

declare global {
    interface globalThis {
        app?: ApplicationContainer
    }
    interface Window {
        app?: ApplicationContainer
    }
}

if (!App.has('start')) {

    App.register(Kernel);
}


if (typeof exports === 'object') {

    exports.app = App;
}

export interface ApplicationInterface extends ApplicationContainer {}

export {ServiceProvider} from './Support/ServiceProvider';

export {ApplicationContainer} from './Support/Application';

export default App;

// App.on('*', '*', (data: any, app: ApplicationContainer, event: EventAppInfo) => {
//     console.log(`Fire event [${event.event}] on name [${event.name}]`);
// });
// const start: Number = (new Date()).getTime();
//import {} from './Support/AppMake';
//module.exports = require('./make')(start);
// import {App, ApplicationContainer, EventAppInfo} from './Support/Application';
//
// App.on('*', '*', (data: any, app: ApplicationContainer, event: EventAppInfo) => {
//     console.log(`Fire event [${event.event}] on name [${event.name}]`);
// })
//
// App.bind('name', 'Xsaven')
//
// App.bind('hello', (): Function => (name: string) => `Hello, ${name}`);
//
// App.bind('vue', () => {
//
//     return new (require('vue').default);
//
// }, true);
//
// App.on_resolve('vue', (data: any) => {
//     data.xsaven = 1;
//     return data;
// });
//
// // @ts-ignore
// window.app = App;