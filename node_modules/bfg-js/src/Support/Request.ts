import {ServiceProvider, ApplicationContainer} from "bfg-js";

export interface anyObject {
    [key: string]: any;
}

export interface requestObject {
    method?: string
    url?: string
    headers?: anyObject
    token?: string
    body: any
}

export class Request extends ServiceProvider<ApplicationContainer> {

    register() {
        this.app.bind('form_data', (params: anyObject) => {
            let form = new FormData();
            let addFormData = (data: any, parentKey?: string|null) => {
                if (
                    data && typeof data === 'object' &&
                    !(data instanceof Date) &&
                    !(data instanceof File) &&
                    !(data instanceof Blob)
                ) {
                    Object.keys(data).forEach(key => {
                        addFormData(data[key], parentKey ? `${parentKey}[${key}]` : key);
                    });
                } else {
                    const value = data === null ? '' : data;
                    if (parentKey) { form.append(parentKey, value); }
                }
            }
            addFormData(params);

            return form;
        })

        this.app.bind('request', (params: requestObject) => {
            (params as any) = params ? params : {};
            return new Promise((resolve, reject) => {
                let xhr = new XMLHttpRequest();
                xhr.open(params.method || "GET", params.url || window.location.href);
                xhr.setRequestHeader('X-CSRF-TOKEN', params.token || this.app.server.token);
                xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                let is_json = false;
                if (typeof params.body === 'object' && !(params.body instanceof FormData)) {
                    is_json = true;
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    params.body = this.app.json.encode(params.body);
                }
                xhr.send(params.body);
                if (params.headers) {
                    Object.keys(params.headers).forEach(key => {
                        xhr.setRequestHeader(key, params.headers[key]);
                    });
                }
                xhr.onload = () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        //xhr.getResponseHeader('X-CSRF-TOKEN');
                        //resolve(result ? result : xhr.response);
                        resolve({
                            data: this.app.json.decode(xhr.response), xhr,
                            token: xhr.getResponseHeader('X-CSRF-TOKEN')
                        });
                    } else {
                        reject(xhr);
                    }
                };
                xhr.onerror = () => reject(xhr);
            });
        });
    }
}