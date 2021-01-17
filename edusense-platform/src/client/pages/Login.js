import React from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
// Material UI components
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

// Styling 
import { withStyles } from '@material-ui/core/styles';
import loginStyles from '../styles/loginStyles';

import { userLogin } from '../Actions/userActions';


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleGoogle = this.handleGoogle.bind(this);
    }
    handleSubmit(e) {
        e.preventDefault();
        e.stopPropagation();
        this.props.userLogin({ username: this.state.username, password: this.state.password, strategy: "local" });
    }
    handleGoogle(e) {
        this.props.userLogin({ username: this.state.username, password: this.state.password, strategy: "google" });
    }


    render() {
        const { classes } = this.props;
        return (
            <Grid container
                direction="column"
                alignItems="center"
                justify="center"
                className={classes.loginPanel}
            >
                <Paper variant="outlined" className={classes.card}>
                    <form className={classes.form} onSubmit={this.handleSubmit}>
                        <Grid container direction='column' justify='space-between'>
                            <Typography variant="h6">
                                Welcome
                            </Typography>
                            <TextField
                                label="Username"
                                className={classes.formFields}
                                margin="normal"
                                required
                                variant="outlined"
                                inputProps={{ maxLength: 256 }}
                                onChange={evt => this.setState({ username: evt.target.value })}
                            />
                            <TextField
                                type="password"
                                label="Password"
                                className={classes.formFields}
                                margin="none"
                                required
                                variant="outlined"
                                inputProps={{ maxLength: 256 }}
                                onChange={evt => this.setState({ password: evt.target.value })}
                            />
                            <Button type="submit"
                                className={classes.loginButton}
                                variant="contained"
                                color="primary"
                            >
                                Sign In
                                </Button>
                            {/* <Link to="/" style={{ textDecoration: "none" }}> */}
                            <Button
                                variant="contained"
                                className={classes.googleButton}
                                fullWidth
                                // onClick={this.handleGoogle}
                                href="user/auth/google/"
                            >
                                <img width="20" src="https://upload-icon.s3.us-east-2.amazonaws.com/uploads/icons/png/2659939281579738432-512.png" />
                                    &nbsp; &nbsp; Login with google
                                </Button>
                            {/* </Link> */}
                            <div className={classes.otherLinks}>
                                <Typography variant="body2">
                                    <Link to="/forgot-password">Forgot Password?</Link>
                                </Typography>
                                <Typography variant="body2">
                                    New to ClassInSight? <Link to="/sign-up">Sign Up</Link>
                                </Typography>
                                <Typography variant="body2">
                                    <Link to="/admin">Admin Portal</Link>
                                </Typography>
                            </div>

                        </Grid>
                    </form>
                </Paper>
            </Grid>
        );
    }
}
export default connect(null, { userLogin })(withStyles(loginStyles)(Login))