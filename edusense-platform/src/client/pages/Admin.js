import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ReactMarkdown from 'react-markdown';
import XHRPromise from '../XHRPromise';

const sessions = require('../Data/sessions.json');
const users = require('../Data/users.json');
import Box from '@material-ui/core/Box';


// Material-UI Components
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


// Iconography
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

// Custom Components
import ProfileCard from '../components/ProfileCard';
import DashboardVis from '../components/DashboardVis';
import NewExperimentDialog from '../components/NewExperimentDialog';

// Styling
const styles = theme => ({
    root: {
        margin: '30px',
        textAlign: 'left'
    },
    paperRoot: {
        padding: '30px',
        marginTop: '50px',
    },
    statsPanel: {
        display: 'inline'
    },
    pdSelectBox: {
        width: '100%'
    },
    pdPreview: {
        width: '100%',
        height: '100%'
    },
    dialogPaper: {
        minHeight: '60vh',
        minWidth: '100vh',
        padding: '20px'
    },
})

// Constants
const data_ex = {
    "title": "Percentage of Time Moving",
    "graphType": 0.0,
    "data": [
        6.0,
        13.0,
        12.0,
        33.0,
        31.4,
        44.0
    ],
    "dataLabels": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6"
    ],
    "color": "blue",
    "width": 6.0
};
const data_ex2 = {
    "graphType": 0.0,
    "data": [
        6.0,
        32.0,
        56.0,
        55.0,
        48.4,
        67.0
    ],
    "dataLabels": [
        "w1",
        "w2",
        "w3",
        "w4",
        "w5",
        "w6"
    ],
    "color": "blue",
    "width": 6.0
};
// const data2 = [{x: 1, y: 96}, {x: 2, y: 97}, {x: 3, y: 82}, {x: 4, y: 89}, {x: 5, y: 86}, {x: 6, y: 77}, {x: 7, y: 79}];

const formFields = [
    {
        label: 'Students',
        helper: 'Percentage of time facing students',
        default: '50%'
    },
    {
        label: 'Other',
        helper: 'Percentage of time not facing students',
        default: '50%'
    },
    {
        label: 'Whiteboard',
        helper: 'Percentage of time facing the whitebaord',
        default: '12%'
    },
    {
        label: 'Notes',
        helper: 'Percentage of time facing your notes',
        default: '16%'
    },
];


function createData(name, num, min, fm, more) {
    return { name, num, min, fm, more };
}

const rows = [
    createData('Simple Visualizations', 21, 80, 2, <Button variant="outlined" color="primary">More</Button>),
    createData('Complex Visualizations', 7, 49, 0, <Button variant="outlined" color="primary">More</Button>),
    createData('Simple Vis, Low Feedback', 14, 32, 1, <Button variant="outlined" color="primary">More</Button>),
];

const sems = [
    {
        id: 0,
        name: "Fall 2019"
    },
    {
        id: 1,
        name: "Spring 2019"
    },
];

class Admin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pdList: [],
            pdSelect: 0,
            pdPreviewOpen: false,
            newExpOpen: false,
            pdVal: "",
            professor: "Ketakir@andrew.cmu.edu",
            mappedClass: '05410A',
            semester: "Fall2019"
        }

        this.handleTextAreaChange = this.handleTextAreaChange.bind(this);
        this.handlePDChange = this.handlePDChange.bind(this);
    }

    async componentDidMount() {
        const response = await fetch('/api/getPDList');
        const json = await response.json();
        this.setState({ pdList: json });

        this.getModule(this.state.pdList[0])
    }

    handlePDChange(evt) {
        this.getModule(this.state.pdList[evt.target.value]);
        this.setState({ pdSelect: evt.target.value });
    }

    handleTextAreaChange(event) {
        this.setState({ pdVal: event.target.value });
    }

    getModule(name) {
        fetch('/api/getPDModules')
            .then(res => res.json())
            .then(pd_data => this.setState({ pdVal: pd_data[0][name] }));
        //this.setState({pdVal: pd_data[1][name]})
    }

    async uploadModule() {

        // POST request to save goals to db 
        fetch('/api/uploadPD', {
            method: 'POST',
            body: JSON.stringify(
                { "nvb": this.state.pdList[this.state.pdSelect], "pdContent": this.state.pdVal }
            ),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => console.log(data));
    }


    render() {
        const { classes } = this.props;
        const { userProfile } = this.props;
        return (
            <div>
                <ProfileCard userProfile={userProfile} />

                <Paper variant="outlined" className={classes.paperRoot}>
                    <div className={classes.statsPanel}>
                        <Toolbar>
                            <Typography variant="h6">
                                Usage Statistics
            </Typography>
                        </Toolbar>
                        <div style={{ width: '50%', display: 'inline-block' }}>
                            <DashboardVis graphObj={data_ex} graphType={0} graphData={data_ex.data} graphHeight={300} />
                        </div>
                        <div style={{ width: '50%', display: 'inline-block' }}>
                            <DashboardVis graphObj={data_ex2} graphType={0} graphData={data_ex2.data} graphHeight={300} />
                        </div>
                    </div>
                </Paper>

                <Paper variant="outlined" className={classes.paperRoot}>
                    <Toolbar>
                        <Typography variant="h6">
                            Edit PDs
            </Typography>
                    </Toolbar>

                    <Grid container spacing={3}>
                        <Grid item xs={9}>
                            <FormControl className={classes.pdSelectBox} variant="outlined">
                                <Select
                                    value={this.state.pdSelect}
                                    onChange={(evt) => this.handlePDChange(evt)}
                                >
                                    <MenuItem value={0}>{this.state.pdList[0]}</MenuItem>
                                    <MenuItem value={1}>{this.state.pdList[1]}</MenuItem>
                                    <MenuItem value={2}>{this.state.pdList[2]}</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={3}>
                            <Button
                                className={classes.pdPreview}
                                variant="outlined"
                                color="primary"
                                onClick={(evt) => this.setState({ pdPreviewOpen: !this.state.pdPreviewOpen })}
                            >
                                Preview
              </Button>
                        </Grid>
                        <Grid item xs={12}>

                            <textarea
                                value={this.state.pdVal}
                                onChange={this.handleTextAreaChange}
                                style={{ width: '100%', minHeight: '300px', fontSize: '16px', padding: '6px', borderRadius: '2px', borderColor: 'gray' }}
                            >

                            </textarea>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                startIcon={<CloudUploadIcon />}
                                onClick={this.uploadModule.bind(this)}
                            >
                                Upload
                                </Button>
                        </Grid>
                    </Grid>

                    <Dialog
                        classes={{ paper: classes.dialogPaper }}
                        onClose={(evt) => this.setState({ pdPreviewOpen: !this.state.pdPreviewOpen })}
                        open={this.state.pdPreviewOpen}>
                        <ReactMarkdown source={this.state.pdVal} />
                    </Dialog>

                </Paper>

                <Paper variant="outlined" className={classes.paperRoot}>
                    <Toolbar>
                        <Typography variant="h6">
                            View All Experiment Users
            </Typography>
                    </Toolbar>

                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Cohort Name</TableCell>
                                    <TableCell align="right">Number of Users</TableCell>
                                    <TableCell align="right">Minute Used</TableCell>
                                    <TableCell align="right">Feedback</TableCell>
                                    <TableCell align="right">More Info</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.name}>
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">{row.num}</TableCell>
                                        <TableCell align="right">{row.min}</TableCell>
                                        <TableCell align="right">{row.fm}</TableCell>
                                        <TableCell align="right">{row.more}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '20px' }}
                        onClick={(evt) => this.setState({ newExpOpen: !this.state.newExpOpen })}
                    >
                        New Experiment
                    </Button>

                    {this.state.newExpOpen && <NewExperimentDialog />}


                </Paper>
            </div>
        );
    }
}
export default withStyles(styles)(Admin);
