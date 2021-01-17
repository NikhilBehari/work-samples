import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import styles from '../styles/homeStyles';
import Logout from '../components/logout';
import NotificationMenu from '../components/NotificationMenu';
import Toolbar from '@material-ui/core/Toolbar';
import NotificationIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import * as colors from '../constants/styleConstants';

const ADMIN = 0;
const CustomTooltip = withStyles((theme) => ({
    tooltip: {
        backgroundColor: colors.white['w1'],
        color: 'rgba(0, 0, 0, 0.87)',
        width: 500,
        marginRight: 50,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
        padding: '0px',
    }
}))(Tooltip);

// App Icon
import logo from '../resources/ci.png';
class AppNavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notificationsOpen: false,
        };
    }

    render() {
        const { classes } = this.props;
        return <AppBar position="fixed" elevation={0} className={classes.appBar}>
            <Toolbar>
                <img src={logo} alt={"Logo"} className={classes.appBarIcon} />
                <div style={{ flex: 1 }}>
                </div>
                {(this.props.authLevel === ADMIN) && (<React.Fragment><Button href="/admin" color="primary">Admin</Button>
                    <Button href="/mapping" color="primary">Mapping</Button>
                    <Button color="primary" href="/uxTest">Test Charts</Button>
                    <Button color="primary" href="/">Home</Button>
                </React.Fragment>)}

                <ClickAwayListener onClickAway={(evt) => this.setState({ notificationsOpen: false })}>
                    <CustomTooltip
                        open={this.state.notificationsOpen}
                        title={
                            <NotificationMenu />
                        }
                    >
                        <IconButton
                            onClick={(evt) => this.setState({ notificationsOpen: !this.state.notificationsOpen })}
                        >
                            <Badge invisible={true} variant="dot" color="primary">
                                <NotificationIcon className={classes.notifIcon} />
                            </Badge>
                        </IconButton>
                    </CustomTooltip>
                </ClickAwayListener>
                <Logout />
            </Toolbar>
        </AppBar>;
    }
}
export default (withStyles(styles)(AppNavBar));