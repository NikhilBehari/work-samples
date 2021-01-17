import React from 'react';
import {
    Route,
    Redirect,
} from 'react-router-dom';

class ProtectedRoute extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        
    }
    render() {
        const { auth: auth, component: Component, ...rest } = this.props;
        return (
            <Route
                {...rest}
                render={() => auth ? (<Component />) : (<Redirect to="/login" />)}
            />
        );
    }
}

export default ProtectedRoute;