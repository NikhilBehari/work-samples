import React from 'react';
import { userLogout } from '../Actions/userActions';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';

import { Button } from '@material-ui/core';


class Logout extends React.Component {
    constructor(props){
        super(props);
        this.logout = this.logout.bind(this);
    }
    logout() {
        this.props.userLogout();
    }
    render() {
        return (
            <Link to="/login" style={{ textDecoration: 'none' }}>
                <Button color="primary" variant="outlined" onClick={this.logout} disableElevation>Logout</Button>
            </Link>
        );
    }
}

export default connect(null, { userLogout })(Logout);