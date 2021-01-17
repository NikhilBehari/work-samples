import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { connect } from 'react-redux';
import {
    BrowserRouter as Router,

    Redirect, Route,

    Switch
} from 'react-router-dom';
import AppNavBar from '../components/NavBar';
// Custom Components 
import OnboardingDialog from '../components/OnboardingDialog';
// Pages 
import Dashboard from '../pages/Dashboard';
// Styling
import styles from '../styles/homeStyles';
import XHRPromise from '../XHRPromise';
import Admin from './Admin';
import Mapping from './Mapping';
import Unauthorized from './Unauthorized';
// import Home from './Home';
import UXTest from './UXtest';


const ADMIN = 0;


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstOpen: true,
            userProfile: {}
        }
    }

    async componentDidMount() {
        if ((localStorage.getItem("firstLoad") === null)) {
            localStorage.setItem('firstLoad', true)
        } else {
            this.setState({
                firstOpen: false
            });
        }
        var { status, response } = await XHRPromise('get', '/user/getUserProfile');
        const userData_json = JSON.parse(response);
        this.setState({ userProfile: userData_json });
    }

    render() {
        const { classes } = this.props;
        return (
            <div >
                <AppNavBar authLevel={this.state.userProfile.authLevel}></AppNavBar>
                {this.state.firstOpen && <OnboardingDialog />}
                <div className={classes.mainContainer}>
                    <Router>
                        <Switch>
                            <Route exact path="/" render={(props) => (<Dashboard {...props} userProfile={this.state.userProfile} />)} />
                            <Route exact path="/uxTest" render={(props) => (<UXTest {...props} userProfile={this.state.userProfile} />)} />
                            <Route exact path="/mapping" render={() => ((this.state.userProfile.authLevel === ADMIN)? <Mapping /> : <Unauthorized />)} />
                            <Route exact path="/admin" render={(props) => ((this.state.userProfile.authLevel === ADMIN)? <Admin {...props} userProfile={this.state.userProfile} /> : <Unauthorized /> )} />
                            <Redirect to='/' />
                        </Switch>
                    </Router>
                </div>
            </div>
        );
    }
}
const mapStateToProps = (state) => ({
    auth: state.authReducer.isAuthenticated
});

// export default withStyles(styles)(Home);
export default connect(mapStateToProps, null)(withStyles(styles)(Home));