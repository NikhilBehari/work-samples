import React from 'react';
import { withStyles } from '@material-ui/core/styles';

// Material-UI Components
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        flexGrow: '1',
        overflow: 'hidden',
        padding: '10px',
    },
    paper: {
        width: '400px',
        margin: '10px',
        padding: '10px',
    },
    avatar: {
        width: '100px',
        height: '100px'
    },
    profileText: {
        width: '100%',
        padding: '10px'
    },
    editProfileButton: {
        marginTop: '5px'
    }
})

class ProfileCard extends React.Component {
    render() {
        const { classes } = this.props;
        const { firstName, lastName, institution, classList } = this.props.userProfile;
        var name = (firstName || '') + ' ' + (lastName || '');
        var inst = institution || '';
        return (
            <div className={classes.cardRoot}>
                <Paper variant="outlined" className={classes.paper}>
                    <Grid container wrap="nowrap" spacing={2}>
                        <Grid item>
                            <Avatar className={classes.avatar} src={""}></Avatar>
                        </Grid>
                        <div className={classes.profileText}>
                            <Typography variant="h5" style={{ fontWeight: 'bold' }}>{name}</Typography>
                            <Typography variant="subtitle2">{inst}</Typography>
                            {classList && <Typography style={{ color: "gray", fontSize: "11px" }} variant="subtitle2">Courses: {classList.map((classCode) => classCode.split("_")[0]).join(', ')}</Typography>}
                            {/* <Button size="small" variant="outlined" color="primary" className={classes.editProfileButton}>Edit Profile</Button> */}
                        </div>
                    </Grid>
                </Paper>
            </div>
        );
    }
}
export default withStyles(styles)(ProfileCard);
