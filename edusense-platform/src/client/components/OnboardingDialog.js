import React from 'react';
import { withStyles } from '@material-ui/core/styles';

// Material-UI Components
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';

// Custom Components 
import Image from '../resources/onboardingImage.svg'; 

// Styling
const styles = theme => ({
  root: {
    height: '260px'
  },
  dialogBackground: {
    backgroundImage: "url(" + Image + ")",
    backgroundSize: '500px 200px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '100px 140px'
  }
})

class OnboardingDialog extends React.Component {
  constructor(props){
    super(props)
    this.state = {
        open: true
    }
  }
  
  render(){
    const { classes } = this.props;
    return(
      <Dialog
          open={this.state.open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          classes={{paper: classes.dialogBackground}}
        >
          <DialogTitle id="alert-dialog-title">{"Welcome to EduSense!"}</DialogTitle>
          <DialogContent className={classes.root}>
            <DialogContentText id="alert-dialog-description">
              Welcome to the EduSense App. Use this website to view your classroom insights from EduSense and learn about important classroom behaviors. 
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={evt => this.setState({open: false})} color="primary" variant="contained">
              Start
            </Button>
          </DialogActions>
        </Dialog> 
      );
    }
  }
export default withStyles(styles)(OnboardingDialog);
