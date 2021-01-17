import * as colors from '../constants/styleConstants';

const styles = theme => ({
    appBar:{
        backgroundColor: colors.white['w1'],
        borderBottom: '1px solid #e0e0e0',
        boxShadow: 'none',
        zIndex: '1300',
    },
    appBarIcon:{
        height: '50px'
    },
    tabs: {
        marginLeft: '20px',
    },
    headerTab: {
        color: 'black',
        borderBottom: 'none',
    },
    notifIcon: {
        color: 'secondary',
    },
    headerLogin: {
      marginLeft: '10px'
    },
    mainDrawer:{
        width: '300px',
        flexShrink: '0',
        overflow: 'auto'
    },
    drawerPaper:{
        width: '300px'
    },
    drawerContainer:{
        overflow: 'auto',
    },
    drawerItem:{
        height: '70px'
    },
    nested: {
        paddingLeft: '70px'
    },
    selectedItem:{
        backgroundColor: 'green'
    },
    mainContainer:{
        height: '100vh',
        textAlign: 'left',
        marginLeft: '60px',
        marginRight: '60px',
        marginTop: '100px',

        // marginTop: '5vh',
        // width: '100%',
    },
});
export default styles;