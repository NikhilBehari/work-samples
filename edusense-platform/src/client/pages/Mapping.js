import { MenuItem } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import React from 'react';
import { connect } from 'react-redux';
// Styling
import styles from '../styles/homeStyles';
import XHRPromise from '../XHRPromise';
const sessions = require('../Data/sessions.json');
const users = require('../Data/users.json');

const [vertical, horizontal] = ["top", "right"];

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


class Mapping extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userProfile: {},
            professor: "test@edusense.io",
            mappedClass: '05410A',
            semester: "Fall2019",
            usersList: [],
            isDeleteDialogOpen: false,
            deleteMapping: {
                className: '',
                user: ''
            },
            snackbar: {
                isOpen: false,
                message: '',
                severity: 'success'
            },
            requests: {}
        }
    }

    async fetchData() {
        const { response, status } = await XHRPromise("get", "/api/users", {
            withCredentials: true,
            contentType: 'application/json'
        });
        this.setState({ usersList: JSON.parse(response) });
    }
    async fetchUser() {
        var { status, response } = await XHRPromise('get', '/user/getUserProfile');
        const userData_json = JSON.parse(response);
        this.setState({ userProfile: userData_json });
    }

    async fetchRequets() {
        var { status, response } = await XHRPromise('get', '/api/getRequests');
        const reqData = JSON.parse(response);
        this.setState({ requests: reqData });
    }

    componentDidMount() {
        this.fetchData();
        this.fetchUser();
        this.fetchRequets();
    }

    getTeachers() {
        return this.state.usersList.map(function (user, id) {
            return <MenuItem key={id} value={user.username}>{user.username}</MenuItem>
        })
    }

    getSessions() {
        let classNames = new Set();
        sessions.forEach(function (session, id) {
            classNames.add(session.keyword.split('_')[1]);
        });
        let classMenu = [];
        classNames.forEach(function (key, value) {
            classMenu.push(<MenuItem key={key} value={value}>{value}</MenuItem>);
        });
        return classMenu;
    }

    getSems() {
        return sems.map(function (sem, id) {
            return (<MenuItem key={id} value={sem.name.replace(/\s+/g, '')}>{sem.name}</MenuItem>);
        });
    }

    handleProf(event) {
        this.setState({ professor: event.target.value });
    }

    handleClass(event) {
        this.setState({ mappedClass: event.target.value });
    }

    handleSem(event) {
        this.setState({ semester: event.target.value });
    }

    handleAddClass = async (e) => {
        e.preventDefault();
        const { status, response } = await XHRPromise("post", "/user/addClass", {
            body: { username: this.state.professor, className: this.state.mappedClass + "_" + this.state.semester }
        });
        if (status === 200) {
            this.setState({
                snackbar: {
                    isOpen: true,
                    severity: 'success',
                    message: JSON.parse(response).message
                }
            });
            this.fetchData();
        }
        else {
            this.setState({
                snackbar: {
                    isOpen: true,
                    severity: 'error',
                    message: JSON.parse(response).message
                }
            });
        }
    }

    handleDialog = (user, className) => {
        this.setState({ isDeleteDialogOpen: true, deleteMapping: { user: user, className: className } });
    }

    handleRemoveClass = async (user, className) => {
        const { status, response } = await XHRPromise("put", "/user/removeClass", {
            body: { className: className, username: user.username }
        });
        if (status === 200) {
            this.setState({
                isDeleteDialogOpen: false,
                deleteMapping: {
                    user: '',
                    className: ''
                },
                snackbar: {
                    isOpen: true,
                    severity: 'success',
                    message: JSON.parse(response).message
                }
            });
            this.fetchData();
        }
        else {
            this.setState({
                isDeleteDialogOpen: false,
                deleteMapping: {
                    user: '',
                    className: ''
                },
                snackbar: {
                    isOpen: true,
                    severity: 'error',
                    message: JSON.parse(response).message
                }
            });
        }
    }
    handleClose = () => {
        this.setState({ snackbar: { isOpen: false, message: '', severity: '' } });
    }

    render() {
        const { classes } = this.props;
        const { usersList } = this.state;
        const height = 100;
        return (
            <div>
                <Typography variant="h4">
                    Instructor to Course Mappings
                        </Typography>
                <Box p={2}></Box>
                <form onSubmit={this.handleAddClass}>
                    <Paper variant="outlined" className={classes.paperRoot}>
                        <Typography variant="h6">
                            Add Mapping
                        </Typography>
                        <Box p={2}></Box>
                        Instructor &nbsp; &nbsp;
                        <Select value={this.state.professor}
                            onChange={(event) => this.handleProf(event)}
                        >
                            {this.getTeachers()}
                        </Select>
                        &nbsp; &nbsp; Available Classes &nbsp; &nbsp;
                        <Select value={this.state.mappedClass}
                            onChange={(event) => this.handleClass(event)}
                        >
                            {this.getSessions()}
                        </Select>
                        &nbsp; &nbsp; &nbsp; &nbsp;
                        <Select
                            value={this.state.semester}
                            onChange={(event) => this.handleSem(event)}
                        >
                            {this.getSems()}
                        </Select>
                        &nbsp; &nbsp; &nbsp; &nbsp;
                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            Add
                        </Button>
                    </Paper>
                </form>
                <Box p={2}></Box>
                <Paper variant="outlined">
                    <Typography variant="h6">Class Mappings</Typography>
                    <Box p={2}></Box>
                    <Dialog
                        open={this.state.isDeleteDialogOpen}
                        aria-labelledby="responsive-dialog-title"
                    >
                        <DialogTitle id="responsive-dialog-title">{"Delete Mapping"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete the mapping between class: <b>{this.state.deleteMapping.className.split("_")[0]}</b> and instructor: <b>{this.state.deleteMapping.user.username}</b>?
                                </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus color="primary" onClick={() => { this.setState({ isDeleteDialogOpen: false }) }}>
                                Cancel
                                </Button>
                            <Button onClick={() => { this.handleRemoveClass(this.state.deleteMapping.user, this.state.deleteMapping.className) }} color="error" autoFocus>
                                Delete
                                </Button>
                        </DialogActions>
                    </Dialog>
                    <Snackbar anchorOrigin={{ vertical, horizontal }} open={this.state.snackbar.isOpen} autoHideDuration={6000} onClose={this.handleClose}>
                        <Alert onClose={this.handleClose} severity={this.state.snackbar.severity}>
                            {this.state.snackbar.message}
                        </Alert>
                    </Snackbar>

                    <TableContainer component={Paper}>
                        <Table className={classes.table} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Classes</TableCell>
                                    <TableCell>Semester</TableCell>
                                    <TableCell align="right">Remove</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {usersList.map((user, id) => (
                                    user.classList && user.classList.map((className, classId) => {
                                        return <TableRow key={classId}>
                                            <TableCell>{user.firstName + ' ' + user.lastName}</TableCell>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{className.split("_")[0]}</TableCell>
                                            <TableCell>{className.split("_")[1]}</TableCell>
                                            <TableCell align="right"><Button variant="contained" color="secondary" onClick={() => { this.handleDialog(user, className) }}>X</Button></TableCell>
                                        </TableRow>
                                    })
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>

                
            </div>
        );
    }
}
// export default withStyles(styles)(Home);
const mapStateToProps = (state) => ({
    auth: state.authReducer.auth
});

export default connect(mapStateToProps, null)(withStyles(styles)(Mapping));