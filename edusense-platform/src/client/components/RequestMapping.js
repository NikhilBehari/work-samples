import React from 'react';
import { withStyles } from '@material-ui/core/styles';

// Custom Components
import DashboardVis from '../components/DashboardVis';

// Material-UI Components
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import MobileStepper from '@material-ui/core/MobileStepper';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Alert from '@material-ui/lab/Alert';
import DialogTitle from '@material-ui/core/DialogTitle';
import Box from '@material-ui/core/Box';
import Snackbar from '@material-ui/core/Snackbar';
const [vertical, horizontal] = ["top", "right"];

// Styling
const styles = theme => ({
    root: {
      width: '100%',
      height: '30vh'
    },
    form: {
        padding: "50px"
    },
    submitBox: {
        margin: 'auto',
        padding: '50px'
    },
    textInput: {
        width: '100%',
        marginBottom: "30px"
    },
    submit: {
        width: '50px'
    }
})

class RequestMapping extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      name: "",
      classroom: "",
      details: "",
      snackbar: {
        isOpen: false,
        message: 'Course addition request sent!',
        severity: 'success'
        }
    }

    this.handleNameChange = this.handleNameChange.bind(this);
  }

    handleNameChange(event) {
        this.setState({ name: event.target.value });
    }
    handleClassChange(event) {
        this.setState({ classroom: event.target.value });
    }
    handleDetailsChange(event) {
        this.setState({ details: event.target.value });
    }

    async uploadModule() {

        this.setState({
            snackbar: {
                isOpen: true,
                severity: 'success',
                message: 'Course addition request sent!'
            }
        });

        // POST request to save goals to db 
        fetch('/api/requestClass', {
            method: 'POST',
            body: JSON.stringify(
                { "name": this.state.name, "class": this.state.classroom, "details": this.state.details }
            ),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => console.log(data));
    }
    handleClose = () => {
        this.setState({ snackbar: { isOpen: false, message: 'Course addition request sent!', severity: 'success' } });
    }

    render(){
    const { title, subtitle, classes } = this.props;
    return(
        <div className={classes.root}>

            {/* <form onSubmit={(e) => this.handleSubmit(e)} className={classes.form}>
                <Grid container direction='column' justify='space-between'>
                    <Typography variant="h6">
                        Sign Up
                    </Typography>

                    <TextField
                        label="First Name"
                        className={classes.textInput}
                        margin="normal"
                        required
                        variant="outlined"
                        onChange={evt => this.setState({ name: evt.target.value })}
                    />
                    
                    <Button 
                        // onClick={}
                        variant="contained"
                        color="primary">
                        Sign Up
                    </Button>

                </Grid>
            </form> */}

            <Paper style={{width: "80%", height: "400px", margin: "auto", marginTop: "40px", maxWidth: "800px"}} elevation={0} >
            <DialogTitle><b>{title}</b></DialogTitle>
            <Typography style={{marginLeft: '24px'}} variant="subtitle2">
                {subtitle}
            </Typography>

            <div className={classes.submitBox}>
            <Paper variant="outlined" elevation={0} style={{padding: "30px"}}>
                <Typography  variant="subtitle1"  >
                <Box fontWeight="fontWeightBold">
                    Name
                </Box>
                </Typography>
                <TextField onChange={(evt) => this.handleNameChange(evt)} required hint="Enter name..." className={classes.textInput}/>

                <Typography  variant="subtitle1">
                <Box fontWeight="fontWeightBold">
                    Course Identifier
                </Box>
                </Typography>
                <TextField onChange={(evt) => this.handleClassChange(evt)} required hint="Enter name..." className={classes.textInput}/>

                <Typography  variant="subtitle1">
                <Box fontWeight="fontWeightBold">
                    Additional Details
                </Box>
                </Typography>
                <TextField onChange={(evt) => this.handleDetailsChange(evt)} required hint="Enter name..." className={classes.textInput}/>

                <DialogActions>
                <Button onClick={this.uploadModule.bind(this)} color="primary" variant="contained">
                    Submit Request
                </Button>
                </DialogActions>
            </Paper>
            </div>
            </Paper>

            <Snackbar anchorOrigin={{ vertical, horizontal }} open={this.state.snackbar.isOpen} autoHideDuration={6000} onClose={this.handleClose}>
                <Alert onClose={this.handleClose} severity={this.state.snackbar.severity}>
                    {this.state.snackbar.message}
                </Alert>
            </Snackbar>
        </div>
        );
    }
    }
export default withStyles(styles)(RequestMapping);
