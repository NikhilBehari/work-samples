import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import {Bar, Pie, Line, Scatter} from 'react-chartjs-2';
import 'chartjs-plugin-dragdata'
import {LINEOPTIONS as lineOptions} from './graphConstants'
import {BAROPTIONS as barOptions} from './graphConstants'
import {SIMPLEBAROPTIONS as simpleBarOptions} from './graphConstants'
import {HISTOPTIONS as histOptions} from './graphConstants'
import {MULTIPLEBAR as multBar} from './graphConstants'
import {SCATTEROPTIONS as scatOptions} from './graphConstants'

const styles = theme => ({
    root: {
    }
})

class DashboardVis extends React.Component {

  render(){
    const { graphObj, graphType, graphData, graphGoals, graphHeight, newGoal, onGoalChange, classes } = this.props;
    
    var dataLabels = [];
    var week_labels = Array.from(Array(graphData.length).keys());
    (graphType === 5) ? week_labels = Array.from(Array(graphData[0].length).keys()): null;
    for(var i=0;i<week_labels.length;i++){
        week_labels[i]= "Class " + (week_labels[i]+1);
    }
    



    const barDataset= (graphType === 2) ? {
      labels: dataLabels,
      datasets: [
        {
          label: 'Next Goal',
          backgroundColor: 'rgba(75,192,192,1)',
          fill: false,
          borderWidth: {
              top: 4,
              right: 0,
              bottom: 0,
              left: 0
          },
          borderColor: 'rgba(90,200,150,1)',
          dragData: true,
          data: Array(graphObj.data.length).fill(null).concat(50),
        },
        {
          label: 'Previous Goals',
          backgroundColor: 'rgba(75,192,192,0)',
          fill: false,
          borderWidth: {
              top: 4,
              right: 0,
              bottom: 0,
              left: 0
          },
          borderColor: 'rgba(90,200,150,1)',
          data: graphObj.goals,
          dragData: false
        },
        {
          label: 'Students',
          backgroundColor: 'rgba(35, 102, 234, 0.8)',
          borderColor: 'rgba(0,0,0,1)',
          borderWidth: 0,
          data: graphObj.data,
          dragData: false
        },
        {
          label: 'Other',
          backgroundColor: 'rgba(220, 221, 224, 0.5)',
          borderColor: 'rgba(220, 221, 224, 0.5)',
          borderWidth: 0,
          data: Array(graphObj.data.length+1).fill(100),
          dragData: false
        }
      ]
    } : null;

    const simpleBarDataset = (graphType === 3) ? {
      labels: week_labels,
      datasets: [{
        label: 'Students',
        backgroundColor: 'rgba(35, 102, 234, 0.8)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 0,
        data: graphData,
        dragData: false
      }]
    }: null;

    const lrcDataset = (graphType === 7) ? {
      labels: ["Left", "Center", "Right"],
      datasets: [{
        label: 'Students',
        backgroundColor: 'rgba(245, 166, 91, 0.9)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 0,
        data: graphData,
        dragData: false
      }]
    }: null;

    const histDataset = (graphType === 4) ? {
      labels: week_labels,
      datasets: [{
        label: 'Students',
        backgroundColor: 'rgba(143, 227, 136, 0.9)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 0,
        data: graphData,
        dragData: false
      }]
    }: null;

    const multipleBar = (graphType === 5) ? {
      labels: week_labels,
      datasets: [{
        label: 'Arms Crossed',
        backgroundColor: 'rgba(35, 102, 234, 0.8)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 0,
        data: graphData[0],
        dragData: false
      }, {
        label: 'Hands on Face',
        backgroundColor: 'rgba(98, 199, 154, 0.8)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 0,
        data: graphData[1],
        dragData: false
      }, {
        label: 'Hands Riased',
        backgroundColor: 'rgba(143, 98, 199, 0.8)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 0,
        data: graphData[2],
        dragData: false
      }
    ]
    }: null;

    var pointBackgroundColors = [];
    if(graphType === 6){ 
      var graph_labels = graphData.map(a => a.label);
      for (var i = 0; i < graph_labels.length; i++) {
          if (graph_labels[i] === 0) {
              pointBackgroundColors.push("#2366ea");
          } else if(graph_labels[i] === 1) {
              pointBackgroundColors.push("#62c79a");
          } else {
            pointBackgroundColors.push("#8f62c7");
          }
      }
    }
    const scatterData = (graphType === 6) ? {
      datasets: [{
        data: graphData,
        pointBackgroundColor: pointBackgroundColors
      }]
    }: null;

    return(
      <div className={classes.root}>


        {/* LINE GRAPH */}
        {graphType === 0 && 
        <Line
          height={300}
          data= {{
            labels: graphObj.dataLabels,
            datasets: [{
              label: "Test",
              data: graphObj.data,
              borderColor: graphObj.color,
              fill: false
            }]
          }}
          options= {lineOptions}
        />}

        {/* PIE GRAPH */}
        {graphType === 1 && 
            <Pie
              width={180}
              data= {{
                labels: graphObj.dataLabels,
                datasets: [{
                  backgroundColor: graphObj.dataColors,
                  data: graphObj.data
                }]
              }}
              options= {{    
                legend:{
                  display: false
                }
              }}
             />
            }

        {/* BAR GRAPH */}
        {graphType === 2 && 
          <Bar
            data={barDataset}
            height={300}
            options={barOptions}
          />
        }

        {/* BAR GRAPH SIMPLE */}
        {graphType ===3 && 
          <Bar
            data={simpleBarDataset}
            height={graphHeight}
            options={simpleBarOptions}
          />
        }

        {/* HISTOGRAM */}
        {graphType ===4 && 
          <Bar
            data={histDataset}
            height={290}
            options={histOptions}
          />
        }

        {/* Multiple Bar */}
        {graphType ===5 && 
          <Bar
            data={multipleBar}
            height={290}
            options={multBar}
          />
        }

        {/* SCATTER */}
        {graphType ===6 && 
          <Scatter
            data={scatterData}
            height={240}
            options={multBar}
          />
        }

        {/* LRC DIST */}
        {graphType ===7 && 
          <Bar
            data={lrcDataset}
            height={graphHeight}
            options={simpleBarOptions}
          />
        }
        
      </div>
      );
    }
  }
export default withStyles(styles)(DashboardVis);
