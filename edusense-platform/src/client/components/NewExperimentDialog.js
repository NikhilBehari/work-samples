import React from 'react';
import { withStyles } from '@material-ui/core/styles';

// Material-UI Components
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Slider from '@material-ui/core/Slider';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

// Custom Components 

// Styling
const styles = theme => ({
  root: {
    height: '260px'
  },
  dialogPaper: {
    minHeight: '60vh',
    minWidth: '100vh',
    padding: '20px'
  },
})

class NewExperiment extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      newExpOpen: true
    }
  }
  
  render(){
    const { closePanel, classes } = this.props;
    return(
          <Dialog
            classes={{ paper: classes.dialogPaper }}
            onClose={(evt) => this.setState({newExpOpen: !this.state.newExpOpen})} 
            open={this.state.newExpOpen}
            >
            <DialogTitle >New Experiment</DialogTitle>

            <Typography  variant="subtitle1"  >
              <Box fontWeight="fontWeightBold">
                Name Experiment
              </Box>
            </Typography>
            <TextField required hint="Enter name..." />

            <div className={classes.preferences}>
              <Grid item xs={12} sm={12} style={{marginTop: '20px'}}>
                  <Typography  variant="subtitle1"  >
                    <Box fontWeight="fontWeightBold">
                      Recommendation Level
                    </Box>
                  </Typography>
                  <Typography variant="subtitle2">
                    Set the amount and frequency of recommendations provided
                  </Typography>

                  <div style={{textAlign: 'center', padding: '10px'}}>
                    <Slider 
                    className={classes.gazeSlider}
                    defaultValue={38}
                    aria-labelledby="continuous-slider"/>
                  </div>
              </Grid>
              <Grid item xs={12} sm={12} style={{marginTop: '20px'}}>
                  <Typography  variant="subtitle1"  >
                    <Box fontWeight="fontWeightBold">
                      PD Modules
                    </Box>
                  </Typography>
                  <Typography variant="subtitle2">
                    Choose which professional development modules are presented to instructors
                  </Typography>

                  <div style={{textAlign: 'center', padding: '10px'}}>
                  <FormControlLabel
                    control={<Checkbox name="checkedB" color="primary" />}
                    label="Gaze"
                  />
                  <FormControlLabel
                    control={<Checkbox name="checkedB" color="primary" />}
                    label="Location"
                  />
                  <FormControlLabel
                    control={<Checkbox name="checkedB" color="primary" />}
                    label="Movement"
                  />
                  <FormControlLabel
                    control={<Checkbox name="checkedB" color="primary" />}
                    label="Gesturing"
                  />
                  <FormControlLabel
                    control={<Checkbox name="checkedB" color="primary" />}
                    label="Emotion"
                  />
                  
                  </div>
              </Grid>


              <Grid item xs={12} sm={12} style={{marginTop: '20px'}}>
                  <Typography  variant="subtitle1"  >
                    <Box fontWeight="fontWeightBold">
                      Visualizations
                    </Box>
                  </Typography>
                  <Typography variant="subtitle2">
                    Choose which visualizations are available to instructors
                  </Typography>

                  <div style={{textAlign: 'center', padding: '10px'}}>
                  <FormControlLabel
                    control={<Checkbox name="checkedB" color="primary" />}
                    label="Line"
                  />
                  <FormControlLabel
                    control={<Checkbox name="checkedB" color="primary" />}
                    label="Pie"
                  />
                  <FormControlLabel
                    control={<Checkbox name="checkedB" color="primary" />}
                    label="Bar"
                  />
                  <FormControlLabel
                    control={<Checkbox name="checkedB" color="primary" />}
                    label="Heatmap"
                  />
                  <FormControlLabel
                    control={<Checkbox name="checkedB" color="primary" />}
                    label="3D Map"
                  />
                  
                  </div>
              </Grid>


              <Grid item xs={12} sm={12} style={{marginTop: '20px'}}>
                  <Typography  variant="subtitle1"  >
                    <Box fontWeight="fontWeightBold">
                      Theme
                    </Box>
                  </Typography>
                  <Typography variant="subtitle2">
                    Choose the front-end theme
                  </Typography>

                  <div style={{textAlign: 'center', padding: '10px'}}>
                  <FormControl >
                    <InputLabel htmlFor="demo-customized-select-native">Light</InputLabel>
                    <Select
                        labelId="demo-customized-select-label"
                        id="demo-customized-select"
                        style={{width: '300px'}}
                      >
                        <MenuItem value="">
                          <em>Light</em>
                        </MenuItem>
                        <MenuItem value={10}>Light Shade</MenuItem>
                        <MenuItem value={20}>Dark</MenuItem>
                        <MenuItem value={30}>Dark Shade</MenuItem>
                      </Select>
                  </FormControl>
                  
                  </div>
              </Grid>

            </div>

            <DialogActions>
              <Button onClick={(evt) => this.setState({newExpOpen: !this.state.newExpOpen})} color="primary" variant="contained">
                Create New Experiment
              </Button>
            </DialogActions>

          </Dialog>
      );
    }
  }
export default withStyles(styles)(NewExperiment);
