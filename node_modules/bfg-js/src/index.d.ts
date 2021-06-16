import App, { ApplicationContainer } from './Support/Application';
declare global {
    interface globalThis {
        app?: ApplicationContainer;
    }
    interface Window {
        app?: ApplicationContainer;
    }
}
export interface ApplicationInterface extends ApplicationContainer {
}
export { ServiceProvider } from './Support/ServiceProvider';
export { ApplicationContainer } from './Support/Application';
export default App;
