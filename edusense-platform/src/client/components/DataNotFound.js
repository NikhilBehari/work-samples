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

class DataNotFound extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      name: ""
    }
  }


    render(){
    const { title, subtitle, classes } = this.props;
    return(
        <div className={classes.root}>

            <Paper style={{width: "80%", margin: "auto", marginTop: "40px", maxWidth: "800px"}} elevation={0} variant="outlined" >
            <DialogTitle><b>{title}</b></DialogTitle>
            <Typography style={{marginLeft: '24px', marginBottom: '18px'}} variant="subtitle2">
                {subtitle}
            </Typography>
            </Paper>
        </div>
        );
    }
    }
export default withStyles(styles)(DataNotFound);
