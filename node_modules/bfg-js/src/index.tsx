const start: Number = (new Date()).getTime();
import {App, ApplicationContainer, EventAppInfo} from './Support/Application';
import {Kernel} from './Support/Kernel';

declare global {
    interface globalThis {
        app: ApplicationContainer
    }
    interface Window {
        app: ApplicationContainer
    }
}
//
// App.on('*', '*', (data: any, app: ApplicationContainer, event: EventAppInfo) => {
//     console.log(`Fire event [${event.event}] on name [${event.name}]`);
// });

App.provider(new Kernel(start))
    .globalize();


if (typeof exports === 'object') {

    exports.app = App;
}

export default App;


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