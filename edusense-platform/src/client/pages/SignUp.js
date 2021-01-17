import React from 'react';
import { Link } from 'react-router-dom'

// Material UI components
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

// Styling 
import { withStyles } from '@material-ui/core/styles';
import loginStyles from '../styles/loginStyles';

//Auth API
import { userSignup } from '../Actions/userActions';
import { connect } from 'react-redux';

//constants
import { INSTITUTIONS, ROLES } from '../constants';

// Other 
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const MAX_LENGTH = 256;



class SignUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            username: '',
            password: '',
            institution: '',
            role: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    validateEmail(email_val) {
        return (
            email_val.match(EMAIL_REGEX)
            && (typeof email_val) == 'string' &&
            email_val.length > 0 &&
            email_val
        )
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.userSignup(this.state);
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
                    <form className={classes.form} onSubmit={(e) => this.handleSubmit(e)}>
                        <Grid container direction='column' justify='space-between'>
                            <Typography variant="h6">
                                Sign Up
                            </Typography>

                            <TextField
                                label="First Name"
                                className={classes.formFields}
                                margin="normal"
                                required
                                variant="outlined"
                                inputProps={{ maxLength: MAX_LENGTH }}
                                onChange={evt => this.setState({ firstName: evt.target.value })}
                            />
                            <TextField
                                label="Last Name"
                                className={classes.formFields}
                                margin="normal"
                                required
                                variant="outlined"
                                inputProps={{ maxLength: MAX_LENGTH }}
                                onChange={evt => this.setState({ lastName: evt.target.value })}
                            />
                            <FormControl variant="outlined" className={classes.formFields}>
                                <InputLabel id="institution-label">Institution *</InputLabel>
                                <Select
                                    required
                                    labelId="institution-label"
                                    id="institution"
                                    value={this.state.institution}
                                    onChange={evt => this.setState({ institution: evt.target.value })}
                                    label="Institution *"
                                >
                                    {
                                        INSTITUTIONS.map((institution) => <MenuItem key={institution.id} value={institution.name}>{institution.name}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined" className={classes.formFields}>
                                <InputLabel id="role-label">Role *</InputLabel>
                                <Select
                                    required
                                    labelId="role-label"
                                    id="role"
                                    value={this.state.role}
                                    onChange={evt => this.setState({ role: evt.target.value })}
                                    label="Role *"
                                >
                                    {
                                        ROLES.map((role) => <MenuItem key={role.id} value={role.name}>{role.name}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                            <TextField
                                error={(!this.state.email || this.validateEmail(this.state.email)) ? false : true}
                                label="Username"
                                className={classes.formFields}
                                margin="normal"
                                required
                                variant="outlined"
                                inputProps={{ maxLength: MAX_LENGTH }}
                                onChange={evt => this.setState({ username: evt.target.value })}
                            />
                            <TextField
                                type="password"
                                label="Password"
                                className={classes.formFields}
                                margin="none"
                                required
                                variant="outlined"
                                inputProps={{ maxLength: MAX_LENGTH }}
                                onChange={evt => this.setState({ password: evt.target.value })}
                            />
                            <Button type="submit"
                                className={classes.loginButton}
                                // onClick={}
                                variant="contained"
                                color="primary">
                                Sign Up
                            </Button>

                            <div className={classes.otherLinks}>
                                <Typography variant="body2">
                                    Return to <Link to="/login">Sign In</Link>
                                </Typography>
                            </div>

                        </Grid>
                    </form>
                </Paper>
            </Grid>
        );
    }
}
export default connect(null, { userSignup })(withStyles(loginStyles)(SignUp))
