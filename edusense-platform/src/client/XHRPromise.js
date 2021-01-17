import { SERVER_URL } from './constants';
export default function XHRPromise(method, url, opts = {}) {
    let {
        withCredentials = true,
        contentType,
        body,
        successStatus = null
    } = opts;
    url = SERVER_URL + url;
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, url);
        body = (body) ? JSON.stringify(body) : '';
        xhr.withCredentials = withCredentials;
        
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = () => {
            if (xhr.readyState !== xhr.DONE) {
                return;
            }
            if (successStatus !== null && xhr.status !== successStatus) {
                return reject(new Error(
                    `'${method} ${url}' failed: `
                    + `expected status ${successStatus}, got ${xhr.status}`
                ));
            }

            return resolve(xhr);
        };

        xhr.send(body);
    });
}