import React from 'react';
import {Link} from 'react-router-dom'

// Material UI components
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

// Styling 
import { withStyles } from '@material-ui/core/styles';
import loginStyles from '../styles/loginStyles';

// Other 
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

class ForgotPass extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      email: ''
    }
  }
  
  validateEmail(email_val){
    return (
      email_val.match(EMAIL_REGEX)
      && (typeof email_val) == 'string' &&
      email_val.length > 0 && 
      email_val
    )
  }
  
  render(){
    const { classes } = this.props;
    return(
      <Grid container 
        direction="column"
        alignItems="center"
        justify="center"
        className={classes.loginPanel}
      >
        <Paper variant="outlined" className={classes.card}>
          <form className={classes.form} onSubmit={null}>
              <Grid container direction='column' justify='space-between'>
                <Typography variant="h6">
                  Forgot Password
                </Typography>
                <TextField
                  error={(!this.state.email || this.validateEmail(this.state.email)) ? false : true}
                  label="Email Address"
                  className={classes.formFields}
                  margin="normal"
                  required
                  variant="outlined"
                  inputProps={{maxLength: 256}}
                  onChange={evt => this.setState({email: evt.target.value})}
                />
                <Button type="submit" 
                  className={classes.loginButton}
                  variant="contained"
                  color="primary">
                  Send Password Reset Link
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
export default withStyles(loginStyles)(ForgotPass);