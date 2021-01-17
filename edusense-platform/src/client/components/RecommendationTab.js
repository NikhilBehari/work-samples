import React from 'react';
import { withStyles } from '@material-ui/core/styles';

// Material-UI Icons
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import CheckIcon from '@material-ui/icons/CheckCircleOutline';

// Material-UI Components
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    root: {
        textAlign: 'center'
    },
    recNeg: {
        color: '#eb672c',
        // backgroundColor: 'gray',
        fontWeight: '100',
        fontSize: '14px',
        margin: '10px',
        display: 'inline-flex',
        alignItems: 'center'
    },
    recPos: {
        color: '#62c79a',
        fontWeight: '100',
        fontSize: '14px',
        margin: '10px',
        display: 'inline-flex',
        alignItems: 'center'
    }
})

class RecSliver extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            insight: ""
        };

        this.getRec = this.getRec.bind(this, true);
    }

    getRec(){
        var data_obj = this.props.chartData;
        var messagePositive = true;
        var recMessage = "";
        var recIcon = ""
        if(typeof data_obj != "undefined"){

            if(data_obj.graphType == 2){
                var recentGoalsMet = 0
                for(var i = data_obj.data.length-1; i > -1; i--){
                    if(data_obj.goals[i] <= data_obj.data[i]){
                        recentGoalsMet += 1;
                    }
                    else{
                        break;
                    }
                }
                if(recentGoalsMet > 1){
                    recMessage = "You've achieved your last " + recentGoalsMet + " goals!";
                    recIcon = <CheckIcon />
                }
                else{
                    var recentGoalsLost = 0
                    for(var i = data_obj.data.length-1; i > -1; i--){
                        if(data_obj.goals[i] > data_obj.data[i]){
                            recentGoalsMet += 1;
                        }
                        else{
                            break;
                        }
                    }
                    if(recentGoalsMet > 1){
                        messagePositive = false;
                        recMessage = "You've missed your last " + recentGoalsMet + " goals.";
                        recIcon = <ErrorIcon />
                    }
                }
            }

        }

        return([messagePositive, recIcon, recMessage])
    }

    render(){
        const { recLevel, chartData, classes } = this.props;
        
        var notifMessage = this.getRec()

        return(
            <div className={classes.root}>
                {recLevel === 3  && 
                <div className={notifMessage[0] ? classes.recPos : classes.recNeg}>
                    {notifMessage[1]}
                    {notifMessage[2]}
                </div>
                }
                {recLevel === 2  && !notifMessage[0] && 
                <div className={notifMessage[0] ? classes.recPos : classes.recNeg}>
                    {notifMessage[1]}
                    {notifMessage[2]}
                </div>
                }
            </div>
        );
        }
}
export default withStyles(styles)(RecSliver);
