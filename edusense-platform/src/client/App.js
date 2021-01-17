import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

// Styling
import './App.css';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

// Pages 
import AppContainer from './pages/AppContainer';

// Custom Theme
const theme = createMuiTheme({
    typography: {
        button: {
            textTransform: 'none'
        }
    },
    palette: {
        primary: {
            main: '#2365ea',
            contrastText: 'white'
        },
        secondary: {
            main: '#000000'
        },
    },
});


class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <MuiThemeProvider theme={theme}>
                    <AppContainer></AppContainer>
                </MuiThemeProvider>
            </Provider>
        );
    }
}

export default App;