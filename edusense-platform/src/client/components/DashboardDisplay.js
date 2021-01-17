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

// Styling
const styles = theme => ({
    pdDialog: {
      width: '600px',
      height: '400px'
    },
    pdGoalSet: {
        width: '340px',
        margin: '14px',
    },
    pdSubcomponent: {
      height: '360px',
      width: '540px',
      margin: '14px',
    },
    pdSubcomponentHolder: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },
    gridList: {
      flexWrap: 'nowrap',
      transform: 'translateZ(0)',
    },
    takeaways: {
        paddingLeft: '10px',
        paddingRight: '10px'
    }
})

class DashboardCharts extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      pdData: [],
      activeStep: 0,
      gazeVarGoal: 10,
      varGoalChanged: false,
      movVarGoal: 10,
      movGoalChanged: false
    }

    this.updateVarGoal = this.updateVarGoal.bind(this);
    this.updateMovGoal = this.updateMovGoal.bind(this);
  }

  updateVarGoal(goal){
      this.setState({gazeVarGoal: goal});
      this.setState({varGoalChanged: true})
  }

  updateMovGoal(goal){
    this.setState({movVarGoal: goal});
    this.setState({movGoalChanged: true})
}
  
  render(){
    const { data, module, thumbnail, stu_thumbnail, heat_thumb, classes } = this.props;
    return(
      <div className={classes.root}>

        {module==="Gaze" && 
            <div style={{width: '90vw', height: '420px', overflow: 'auto'}}>
            <div style={{width: '2200px', height: '400px', padding: '10px'}}>
                <Grid container spacing={3}>

                    <Grid item>
                    <Paper elevation={3} square={true} variant="outlined" className={classes.pdGoalSet}>
                        <Typography variant="subtitle1" style={{fontWeight: '600', margin: '12px'}}>
                            Key takeaways
                        </Typography>
                        <div className={classes.takeaways}>
                            <ol>
                                {data["gaze"]["insights"].map((insight, idx) => (
                                    <li><Typography>{insight}</Typography></li>
                                ))
                                }
                            </ol>
                        </div>
                        </Paper>
                    </Grid>


                    <Grid item>
                        <Paper elevation={3} square={true} variant="outlined" className={classes.pdSubcomponent}>
                        <Typography variant="subtitle1" style={{fontWeight: '500', margin: '12px'}}>
                            Gaze Distribution - Last Class
                        </Typography>
                        {data &&
                        <div className={classes.pdGraphBox}>
                            {/* {JSON.stringify(data["gaze"]["dist"][0])} */}
                            <DashboardVis 
                            graphType={4} 
                            graphData={data["gaze"]["dist"][0]}  
                            graphHeight={300} 
                            />                   
                        </div> }
                        </Paper>
                    </Grid>

                    <Grid item>
                        <Paper elevation={3} square={true} variant="outlined" className={classes.pdSubcomponent}>
                            <Typography variant="subtitle1" style={{fontWeight: '500', margin: '12px'}}>
                                Variance in Gaze Direction
                            </Typography>
                            <div className={classes.pdGraphBox}>
                            {data &&
                            <DashboardVis 
                                graphType={3} 
                                graphData={data["gaze"]["var"]}  
                                graphHeight={260} 
                                />
                            }                   
                            </div>
                            
                        </Paper>
                    </Grid>

                    <Grid item>
                    <Paper elevation={3} square={true} variant="outlined" className={classes.pdSubcomponent}>
                        <Typography variant="subtitle1" style={{fontWeight: '500', margin: '12px'}}>
                            Gaze Distribution - Semester Aggregate
                        </Typography>
                        {data &&
                        <div className={classes.pdGraphBox}>
                            {/* {JSON.stringify(data["gaze"]["dist"][0])} */}
                            <DashboardVis 
                            graphType={4} 
                            graphData={data["gaze"]["dist"][0].map(
                                (x, idx) => data["gaze"]["dist"].reduce((sum, curr) => sum + curr[idx], 0)
                            )}  
                            graphHeight={300} />                   
                        </div> }
                        </Paper>
                    </Grid>

                </Grid> 
            </div>
            </div>
        }

        {module=="Location" && 
        <div style={{width: '90vw', height: '420px', overflow: 'auto'}}>
            <div style={{width: '2200px', height: '400px', padding: '10px'}}>

                <Grid container spacing={3}>

                <Grid item>
                <Paper elevation={3} square={true} variant="outlined" className={classes.pdGoalSet}>
                    <Typography variant="subtitle1" style={{fontWeight: '600', margin: '12px'}}>
                        Key takeaways
                    </Typography>
                    <div className={classes.takeaways}>
                        <ol>
                            {data["movement"]["insights"].map((insight, idx) => (
                                <li><Typography>{insight}</Typography></li>
                            ))
                            }
                        </ol>
                    </div>
                    </Paper>
                </Grid>

                <Grid item>
                <Paper elevation={3} square={true} variant="outlined" className={classes.pdSubcomponent}>
                    <Typography variant="subtitle1" style={{fontWeight: '500', margin: '12px'}}>
                        Variance in Movement
                    </Typography>
                    {data &&
                    <div className={classes.pdGraphBox}>
                        {/* {JSON.stringify(data["gaze"]["dist"][0])} */}
                        <DashboardVis 
                            graphType={3} 
                            graphData={data["movement"]["var"]}  
                            graphGoals={data["movement"]["var_goal"]}
                            graphHeight={260} 
                            />                 
                    </div> }
                    </Paper>
                </Grid>

                <Grid item>
                <Paper elevation={3} square={true} variant="outlined" className={classes.pdSubcomponent}>
                    <Typography variant="subtitle1" style={{fontWeight: '500', margin: '12px'}}>
                        Left, Center, Right Distribution - Last Class
                    </Typography>
                    {data &&
                    <div className={classes.pdGraphBox}>
                        {/* {JSON.stringify(data["gaze"]["dist"][0])} */}
                        <DashboardVis 
                            graphType={7} 
                            graphData={data["movement"]["loc_dist"][5]}  
                            graphHeight={260} 
                            />                 
                    </div> }
                    </Paper>
                </Grid>

                <Grid item>
                <Paper elevation={3} square={true} variant="outlined" className={classes.pdSubcomponent}>
                    <Typography variant="subtitle1" style={{fontWeight: '500', margin: '12px'}}>
                        Left, Center, Right Distribution - Semester Aggregate
                    </Typography>
                    {data &&
                    <div className={classes.pdGraphBox}>
                        {/* {JSON.stringify(data["gaze"]["dist"][0])} */}
                        <DashboardVis 
                            graphType={7} 
                            graphData={data["movement"]["agg_loc_dist"]}  
                            graphHeight={260} 
                            />                 
                    </div> }
                    </Paper>
                </Grid>

                </Grid> 
            </div>
        </div>
        }

        {module==="Classroom Metrics" && 
        <div style={{width: '90vw', height: '420px', overflow: 'auto'}}>
        <div style={{width: '2300px', height: '400px', padding: '10px'}}>
             <Grid container spacing={3}>

                <Grid item>
                <Paper elevation={3} square={true} variant="outlined" className={classes.pdGoalSet}>
                    <Typography variant="subtitle1" style={{fontWeight: '600', margin: '12px'}}>
                        Key takeaways
                    </Typography>
                    <div className={classes.takeaways}>
                        <ol>
                            {data["metrics"]["insights"].map((insight, idx) => (
                                <li><Typography>{insight}</Typography></li>
                            ))
                            }
                        </ol>
                    </div>
                    </Paper>
                </Grid>
                
                <Grid item>
                <Paper elevation={3} square={true} variant="outlined" className={classes.pdSubcomponent}>
                    <Typography variant="subtitle1" style={{fontWeight: '500', margin: '12px'}}>
                        Attendance
                    </Typography>
                    <div className={classes.pdGraphBox}>
                        {data &&
                        <DashboardVis 
                            graphType={3} 
                            graphData={data["metrics"]["attendance"]}  
                            graphHeight={300} 
                            />
                        }    
                    </div>
                    </Paper>
                </Grid>

                <Grid item>
                <Paper elevation={3} square={true} variant="outlined" className={classes.pdSubcomponent}>
                    <Typography variant="subtitle1" style={{fontWeight: '500', margin: '12px'}}>
                        Handraises
                    </Typography>
                    <div className={classes.pdGraphBox}>
                        {data &&
                        <DashboardVis 
                            graphType={5} 
                            graphData={[data["metrics"]["arms_cross"], data["metrics"]["hands_face"], data["metrics"]["hands_raise"]]}  
                            graphHeight={300} 
                            />
                        }   
                    </div>
                    </Paper>
                </Grid>

                <Grid item>
                <Paper elevation={3} square={true} variant="outlined" className={classes.pdSubcomponent}>
                    <Typography variant="subtitle1" style={{fontWeight: '500', margin: '12px'}}>
                        Student Locations
                    </Typography>
                    <div className={classes.pdGraphBox}>
                        {data &&
                            <DashboardVis 
                                graphType={6} 
                                graphData={data["metrics"]["clustering"][5]}  
                                graphHeight={240} 
                        />   }        
                    </div>
                    </Paper>
                </Grid>
                

            </Grid> 
        </div>
        </div>
        }






      </div>
      );
    }
  }
export default withStyles(styles)(DashboardCharts);
