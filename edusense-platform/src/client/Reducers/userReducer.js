const initialState = {
    // token: localStorage.getItem('token'),
    isAuthenticated: (function(){
        var d = new Date();
        d.setTime(d.getTime() + (1000));
        var expires = "expires=" + d.toUTCString();
        var cookiename = "accessToken";

        document.cookie = cookiename + "=new_value;path=/;" + expires;
        if (document.cookie.indexOf(cookiename + '=') == -1) {
            return true;
        } else {
            return false;
        }
    })(),
    user: null
};


export default function (state = initialState, action) {
    switch (action.type) {
        case "Login_success":
        case "Auth_success":
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true
            };
        // case AUTH_ERROR:
        // case LOGIN_FAIL:
        case "Logout_success":
        case "Auth_failure":
            return {
                ...state,
                isAuthenticated: false
            };
        default:
            return state;
    }
}


        // case USER_LOADED:
        //     return {
        //         ...state,
        //         isAuthenticated: true,
        //         isLoading: false,
        //         user: action.payload
        //     };