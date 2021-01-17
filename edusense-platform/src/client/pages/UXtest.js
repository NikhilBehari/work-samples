import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import { Grid, MenuItem } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Select from '@material-ui/core/Select';
import { Bar } from 'react-chartjs-2';
import { connect } from 'react-redux';
import { BAROPTIONSNEW as barOptions } from '../components/graphConstants';
import ProfileCard from '../components/ProfileCard';
// Styling
import styles from '../styles/homeStyles';
import XHRPromise from '../XHRPromise';




class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            attendance: [],
            timestamps: [],
            handraises: [],
            front: [],
            userProfile: {},
            instructor_movement: []
        }
    }

    async fetchData(classCode) {
        const { response, status } = await XHRPromise("post", "/user/classAggregate", {
            withCredentials: true,
            contentType: 'application/json',
            body: { class_code: classCode }
        });

        var newState = {
            attendance: [],
            timestamps: [],
            handraises: [],
            front: [],
            instructor_movement: []
        };

        var classAggData = JSON.parse(response);

        classAggData = classAggData.map(function (classAggregate, id) {
            classAggregate.metadata.timestamp = new Date(classAggregate.metadata.timestamp);
            return classAggregate;
        });
        classAggData.sort(function (a, b) {
            return a.metadata.timestamp > b.metadata.timestamp ? 1 : -1;
        })
        classAggData.forEach(function (classAggregate, id) {
            newState.timestamps.push(classAggregate.metadata.timestamp);
            newState.attendance.push(classAggregate.attendance);
            newState.handraises.push(classAggregate.handraises);
            newState.instructor_movement.push(parseFloat(classAggregate.instructor_movement.slice(0, -1)));
            newState.front.push(classAggregate.front);
        });

        this.setState(newState);
    }
    // async fetchUser() {
    //     var { status, response } = await XHRPromise('get', '/user/getUserProfile');
    //     const userData_json = JSON.parse(response);
    //     this.setState({ userProfile: userData_json });
    // }

    componentDidMount() {
        this.fetchData("05391A");
    }

    handleClassChange(e) {
        var classCode = e.target.value.split("_")[0];
        this.fetchData(classCode);
    }

    render() {
        const { classes } = this.props;
        const { userProfile } = this.props;
        const height = 100;
        return (
            <div>
                <ProfileCard userProfile={userProfile} />
                <Box p={2}>
                    Showing data for class: &nbsp;&nbsp;&nbsp;
                        <Select
                        onChange={(e) => { this.handleClassChange(e) }}
                    >
                        {userProfile.classList && userProfile.classList.map((className, id) => <MenuItem value={className}>{className.replace(/_/g, ' ')}</MenuItem>)}
                    </Select>
                </Box>
                <div className="padding">
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <h2>Attendance</h2>
                            <p>Number of students present.</p>
                            <Bar
                                data={{
                                    labels: this.state.timestamps,
                                    datasets: [{
                                        label: "Number of Students",
                                        data: this.state.attendance,
                                        borderColor: "#2365EA",
                                        fill: false,
                                        backgroundColor: "#2365EA"
                                    }]
                                }}
                                options={barOptions}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <h2>Handrasies</h2>
                            <p>Student engagement via number of handraises.</p>
                            <Bar
                                data={{
                                    labels: this.state.timestamps,
                                    datasets: [{
                                        label: "Handraises",
                                        data: this.state.handraises,
                                        borderColor: "#2365EA",
                                        // borderColor: graphObj.color,
                                        // fill: "#2365EA",
                                        backgroundColor: "#2365EA"
                                    }]
                                }}
                                options={barOptions}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <h2>Instructor Orientation</h2>
                            <p>Instructor engagement via orientation (facing students vs facing board).</p>
                            <Bar
                                data={{
                                    labels: this.state.timestamps,
                                    datasets: [{
                                        label: "%Front",
                                        data: this.state.front,
                                        borderColor: "#2365EA",
                                        // borderColor: graphObj.color,
                                        fill: false,
                                        backgroundColor: "#2365EA"
                                    },
                                    {
                                        label: 'Other',
                                        backgroundColor: 'rgba(220, 221, 224, 0.5)',
                                        borderColor: 'rgba(220, 221, 224, 0.5)',
                                        borderWidth: 0,
                                        data: Array(this.state.attendance.length).fill(100),
                                        dragData: false
                                    }]
                                }}
                                options={barOptions}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6}>
                            <h2>Instructor Movement</h2>
                            <p>Instructor engagement via movement</p>
                            <Bar
                                data={{
                                    labels: this.state.timestamps,
                                    datasets: [{
                                        label: "movement",
                                        data: this.state.instructor_movement,
                                        borderColor: "#2365EA",
                                        // borderColor: graphObj.color,
                                        fill: false,
                                        backgroundColor: "#2365EA"
                                    }]
                                }}
                                options={barOptions}
                            />
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}
// export default withStyles(styles)(Home);
const mapStateToProps = (state) => ({
    auth: state.authReducer.auth
});

export default connect(mapStateToProps, null)(withStyles(styles)(Home));