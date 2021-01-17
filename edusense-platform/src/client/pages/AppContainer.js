import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
} from 'react-router-dom';
import { connect } from 'react-redux';

// Pages 
import Login from './Login';
import Forgot from './ForgotPass';
import SignUp from './SignUp';
import Home from './Home';
import ProtectedRoute from './ProtectedRoute';

const ProtectedLogin = function ({ auth, component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={() => !auth ? (<Component />) : (<Redirect to="/" />)}
        />
    );
}

class AppContainer extends React.Component {
    render() {
        const { auth } = this.props;
        return (
            <div className="App">
                <Router>
                    <Switch>
                        <Route exact path="/forgot-password" component={Forgot} />
                        <ProtectedLogin exact path="/login" auth={auth} component={Login} />
                        <Route exact path="/sign-up" component={SignUp} />
                        <ProtectedRoute path="/" auth={auth} component={Home} />
                        <Redirect to='/' />
                    </Switch>
                </Router>
            </div>
        );
    }
}
const mapStateToProps = state => ({
    auth: state.authReducer.isAuthenticated,
});
export default connect(mapStateToProps, null)(AppContainer);