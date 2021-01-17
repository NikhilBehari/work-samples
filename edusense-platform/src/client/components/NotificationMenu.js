import React from 'react';
import { withStyles } from '@material-ui/core/styles';

// Material-UI Components 
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

// Iconography 
import NewPD from '@material-ui/icons/School';

// Styling
const styles = theme => ({
    notificationHeader: {
        width: '100%',
        height: '40px',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    menuTitle: {
    }
})

class NotificationMenu extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      pdData: []
    }
  }

  async componentDidMount(){
    const response = await fetch('/api/getDashboardData');
    const json = await response.json();
    this.setState({pdData: json});
  }

  loadNotifications(pd_data){
    var notifs = []
    var i;
    for (i = 0; i < pd_data.length; i++){
      var pd = pd_data[i];
      if(pd.unlocked && !pd.pdComplete){
        notifs.push([<NewPD />, "New PD Available", "Complete " + pd.name + " PD"])
      }
    }

    var locked_mods = 0;
    for (i = 0; i < pd_data.length; i++){
      var pd = pd_data[i];
      if(!pd.unlocked){
        locked_mods += 1;
      }
    }
    if(locked_mods > 0){
      if(locked_mods > 1){
        notifs.push([<NewPD />, "You have " + locked_mods + " locked NVBs", "Complete learning PDs to unlock"])
      }
      else{
        notifs.push([<NewPD />, "You have " + locked_mods + " locked NVBs", "Complete learning PD to unlock"])
      }
    }

    return(notifs)
  }

  
  render(){
    const { classes } = this.props;
    var notifs_arr = this.loadNotifications(this.state.pdData);
    return(
      <div className={classes.root}>
          <AppBar elevation={0} position="relative" className={classes.notificationHeader}>
            <Toolbar>
                <Typography variant="subtitle1">Notifications</Typography>
            </Toolbar>
        </AppBar>
        <Typography variant="subtitle1" style={{margin: "10px"}}>No new notifications!</Typography>
        {/* {notifs_arr.length === 0 ? <Typography variant="subtitle1">No new notifications!</Typography> : 
          notifs_arr.map((notif_data, idx) => (
            <div key={idx}>
              <ListItem>
                <ListItemIcon>
                {notif_data[0]}
                </ListItemIcon>
                <ListItemText primary={notif_data[1]} secondary={notif_data[2]} />
              </ListItem>
            </div>
          ))
        } */}
      </div>
      );
    }
  }
export default withStyles(styles)(NotificationMenu);
