import XHRPromise from '../XHRPromise';
// Login User
export const userLogin = ({ username, password, strategy }) => dispatch => {
    let url = "", method;
    switch (strategy) {
        case "local": url = "/user/login", method = "put"; break;
        case "google": url = "/auth/google", method = "get"; break;
        default: url = "/user/login"; break;
    }
    async function execLogin(username, password, url) {
        const { status, response } = await XHRPromise(method, url, {
            withCredentials: true,
            contentType: 'application/json',
            body: { username: username, password: password }
        });
        if (status === 200) {
            dispatch({
                type: "Login_success", //LOGIN_SUCCESS,
                payload: JSON.parse(response)
            })
        }
        else {
            dispatch({
                type: "Logout_success",
                payload: {}
            })
        }

    }
    execLogin(username, password, url);
};

// Logout User
export const userLogout = () => dispatch => {
    async function execLogout() {
        const { status, response } = await XHRPromise('get', "/user/logout", {
            withCredentials: true,
            contentType: 'application/json',
            body: {}
        });
        if (status === 200) {
            dispatch({
                type: "Logout_success", //LOGIN_SUCCESS,
                payload: {
                    isAuthenticated: true
                }
            })
        }
        else {
            dispatch({
                type: "Logout_success",
                payload: {}
            })
        }

    }
    execLogout();


    dispatch({
        type: "Logout_success"
    });
};

export const isAuthenticated = () => dispatch => {

    async function execIsAuthenticated() {
        const { status, response } = await XHRPromise('get', "/user/isAuthenticated", {
            withCredentials: true,
            contentType: 'application/json',
            body: {}
        });
        if (status === 200) {
            dispatch({
                type: "Auth_success", //LOGIN_SUCCESS,
                payload: {
                    isAuthenticated: true
                }
            })
        }
        else {
            dispatch({
                type: "Auth_failure",
                payload: {}
            })
        }
    }
    execIsAuthenticated();
}

export const userSignup = (user) => dispatch => {
    async function execUserSignUp(user) {
        const { status, response } = await XHRPromise("put", "/user/signup", {
            body: { user: user }
        });
        console.log(response);
        //show notification that user was signed up
        // if (status === 200) {
        //     dispatch({
        //         type: "Login_success", //LOGIN_SUCCESS,
        //         payload: response
        //     })
        // }
        // else {
        //     dispatch({
        //         type: "Logout_success",
        //         payload: {}
        //     })
        // }
    }
    execUserSignUp(user);
}

export const addClass = (classMap) => dispatch => {
    async function execAddClass(classMap) {
        const { status, response } = await XHRPromise("put", "/user/addClass", {
            body: classMap
        });
        console.log(response);
    }
    execAddClass(classMap);
}