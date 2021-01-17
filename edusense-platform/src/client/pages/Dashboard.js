import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import XHRPromise from '../XHRPromise';

// Custom Components
import DashboardVis from '../components/DashboardVis';
import Image from '../resources/steps.svg';
import ProfDev from '../pages/ProfDev';
import ProfileCard from '../components/ProfileCard';
import RecSliver from '../components/RecommendationTab';
import DashboardDisplay from '../components/DashboardDisplay';
import RequestMapping from '../components/RequestMapping';
import DataNotFound from '../components/DataNotFound';

// Material-UI Components
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Box from '@material-ui/core/Box';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';


// Styling
const styles = theme => ({
    descriptionBox: {
        width: '500px',
        marginBottom: '20px',
    },
    pdGrid: {
        marginTop: '20px'
    },
    pdGraphBox: {
        padding: '20px'
    },
    disabledBox: {
        pointerEvents: 'none',
        opacity: '0.4'
    },
    viewPDButton: {
        height: '40px',
        width: '100px',
    },
    startPDButton: {
        width: '100%',
        maxWidth: '200px',
        borderRadius: '20px'
    },
    pdDialog: {
        width: '600px',
        height: '400px'
    },
    requestDialog: {
        height: '710px',
        width: '800px',
    }
})

const ColorButton = withStyles((theme) => ({
    root: {
    },
}))(Button);

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userProfile: {},
            pdData: [],
            userData: [],
            recLevel: 3,
            classSelect: 0,
            tabState: 0,
            pdOpen: false,
            whichPD: "Gaze",
            requestDialogOpen: false
        }
    }

    async componentDidMount() {

        var { status, response } = await XHRPromise('get', '/user/getUserProfile');
        const userData_json = JSON.parse(response);
        this.setState({ userProfile: userData_json });

        // var { status, response } = await XHRPromise('get', '/user/getData');
        // const data_json = JSON.parse(response);
        // this.setState({ userData: data_json });

        var { status, response } = await XHRPromise("post", "/user/getClassData", {
            body: { class_id: this.state.userProfile["classList"][0] }
        });
        if(response !== "Empty"){
            const classData_json = JSON.parse(response);
            this.setState({ userData: classData_json });
        }
        else{
            // console.log("Empty");
            this.setState({ userData: {} });
            var testObj = {};
            console.log(Object.keys(this.state.userData).length === 0);
        }

        var { status, response } = await XHRPromise('get', '/api/getPDList');
        const pdData_json = JSON.parse(response);
        this.setState({ pdData: pdData_json });

        var { status, response } = await XHRPromise('get', '/api/getPDDesc');
        const pdDesc_json = JSON.parse(response);
        this.setState({ pdDesc: pdDesc_json });

    }

    async getClassData(class_index) {


        var { status, response } = await XHRPromise("post", "/user/getClassData", {
            body: { class_id: this.state.userProfile["classList"][class_index] }
        });
        if(response !== "Empty"){
            const classData_json = JSON.parse(response);
            this.setState({ userData: classData_json });
        }
        else{
            // console.log("Empty");
            this.setState({ userData: {} });
            var testObj = {};
            console.log(Object.keys(this.state.userData).length === 0);
        }
        // // POST request to save goals to db 
        // fetch('/user/getData', {
        //     method: 'POST',
        //     body: JSON.stringify(
        //         { "class_id": this.state.userProfile["classList"][this.state.classSelect] }
        //     ),
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // })
        //     .then(res => res.json())
        //     .then(data => console.log(data));
    }

    handleClassChange(event) {
        this.setState({ classSelect: event.target.value });
        this.getClassData(event.target.value);
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <ProfileCard userProfile={this.state.userProfile}/>
                <Box p={2} display="inline">
                    Select class: &nbsp;&nbsp;
                    {this.state.userProfile["classList"] && 
                        <Select 
                            onChange={(evt) => this.handleClassChange(evt)}
                            // (evt) => this.handlePDChange(evt)
                            // this.getClassData.bind(this)
                            value={this.state.classSelect} 
                            variant="outlined" 
                            style={{height: '35px', width: '180px'}}>
                        {this.state.userProfile["classList"].map((className, index) => (
                                <MenuItem value={index}>{className}</MenuItem>
                        ))}
                        </Select> 
                    } &nbsp;&nbsp;
                    <span style={{height: '14px', borderLeft: '1px solid black', marginRight: '12px'}}></span>
                    <Button 
                        variant="outlined"
                        onClick={() => this.setState({ requestDialogOpen: !this.state.requestDialogOpen })}
                        >Add Class
                    </Button>
                </Box>

                <Dialog
                    open={this.state.requestDialogOpen}
                    classes={{ paper: classes.requestDialog }}
                >
                    <DialogContent>
                    <RequestMapping title="Add course" subtitle="To add an EduSense-enabled course, please submit a request below. "/>
                    </DialogContent>
                    <DialogActions>
                    <Button onClick={() => this.setState({ requestDialogOpen: !this.state.requestDialogOpen })} color="primary">
                        Close
                    </Button>
                    </DialogActions>
                </Dialog>

                <Divider style={{ marginTop: "20px" }} />
                
                {/* {JSON.stringify(this.state.userProfile["classList"])} */}
                { this.state.userProfile["classList"] && <div>
                {!(this.state.userProfile["classList"]===undefined || this.state.userProfile["classList"].length == 0) ? 
                <div>
                { Object.keys(this.state.userData).length !== 0 ? 
                <div>
                
                <div style={{marginTop: '20px', marginBottom: '20px'}}>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>Overview</Typography>
                <Typography variant = "body1">Course: {this.state.userProfile["classList"][this.state.classSelect]}</Typography>
                <Typography variant = "body1">Last updated: {this.state.userData["misc"]["last_calc"]}</Typography>
                <Typography variant = "body1">Number of recordings: {this.state.userData["misc"]["num"]}</Typography>
                </div>
                <Divider />

                {this.state.pdData.map((pd_data, idx) => (
                    <div key={idx}>
                        <div>
                            <Grid container spacing={3} className={classes.pdGrid}>

                                {/* PD NAME & DESC */}
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>{pd_data}</Typography>
                                    <Typography className={classes.descriptionBox} variant="body1">
                                        {this.state.pdDesc && this.state.pdDesc[idx]}
                                    </Typography>
                                    <ColorButton
                                        size="small"
                                        className={classes.viewPDButton}
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => this.setState({ pdOpen: !this.state.pdOpen, whichPD: pd_data })}
                                    >
                                        View PD
                                    </ColorButton>
                                </Grid>
                            </Grid>

                            {this.state.userData && 
                            <div>
                                {/* {JSON.stringify(this.state.userData["05391"])} */}
                              <DashboardDisplay 
                                data={this.state.userData}
                                module={pd_data }
                              /> </div> 
                            }

                            
                        </div>
                        <Divider />
                    </div>
                ))}
                </div>
                :  <DataNotFound title="Classroom data not found" subtitle="This classroom session data could not be found. The data may not have been processed yet, or you may be running a demo version of the EduSense App."/>}
                </div>
                : <RequestMapping title="No assigned classes found" subtitle="No EduSense-enabled courses have been mapped to your account yet. To add a course, please submit a request below. " />} </div>}

                {/* PD DIALOG */}
                <Dialog
                    open={this.state.pdOpen}
                    fullWidth={true}
                    maxWidth="lg"
                >
                    <DialogContent dividers={scroll === 'paper'}>
                        <div style={{ padding: '30px' }}>
                            <ProfDev course={this.state.whichPD} />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" onClick={() => this.setState({ pdOpen: !this.state.pdOpen })} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        );
    }
}
export default withStyles(styles)(Dashboard);
