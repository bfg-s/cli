import { App, ApplicationContainer } from './Support/Application';
declare global {
    interface globalThis {
        app: ApplicationContainer;
    }
    interface Window {
        app: ApplicationContainer;
    }
}
export default App;
