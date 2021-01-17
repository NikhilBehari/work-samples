import XHRPromise from '../XHRPromise';
// Data Services
export const userLogin = ({ username, password }) => dispatch => {
    async function execLogin(username, password) {
        const { status, response } = await XHRPromise('put', "/user/login", {
            contentType: 'application/json',
            body: { username: username, password: password }
        });
        if (status === 200) {
            dispatch({
                type: "Login_success", //LOGIN_SUCCESS,
                payload: {}
            })
        }
        else {
            dispatch({
                type: "Logout_success",
                payload: {}
            })
        }
    }
    execLogin(username, password);
};

// Logout User
export const userLogout = () => dispatch => {
    dispatch({
        type: "Logout_success"
    });
};