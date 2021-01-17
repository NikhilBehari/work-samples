const styles = theme => ({
    loginPanel: {
        height: '100%',
        minHeight: '100vh'
    },
    card: {
        borderColor: 'primary',
        width: '600px',
        maxWidth: '100%',
        maxHeight: '100%',
        overflow: 'auto',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        [theme.breakpoints.down('xs')]: {
            width: '100%'
        }
    },
    formHeader: {

    },
    formFields: {
        marginTop: '10px',
        marginBottom: '10px',
        width: '340px',
        borderRadius: '10px',
        textAlign: 'left'
    },
    loginButton: {
        height: '50px',
        borderRadius: '10px',
        marginTop: '20px',
        width: '100%'
    },
    googleButton: {
        height: '50px',
        borderRadius: '10px',
        marginTop: '20px',
        width: '100%'
    },
    otherLinks: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: "28px"
    }
});
export default styles;