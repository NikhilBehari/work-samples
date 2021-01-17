export const LINEOPTIONS = {
    tooltips: { enabled: true },
    hover: { mode: null },
    maintainAspectRatio: false,
    scales: {
        xAxes: [{
            gridLines: { display: false },
            ticks: {
                fontColor: '#3C3C3C',
                fontSize: 12,
            },
            stacked: true,

        }],
        yAxes: [{
            scaleLabel: { display: true },
            ticks: {
                display: true,
                stacked: false,
                min: 0,
                max: 100,
                scaleSteps: 10,
                scaleStartValue: 0,
                maxTicksLimit: 10,
                padding: 30,
                callback: point => (point < 0 ? '' : point),
            },
            gridLines: {
                display: true,
                offsetGridLines: false,
                color: 'rgba(0, 0, 0, 0.1)',
                tickMarkLength: 4,
            },
        }],
    },
    legend: {
        display: true
    },
    dragData: false,
}

export const BAROPTIONS = {
    tooltips: { enabled: false },
    hover: { mode: null },
    maintainAspectRatio: false,
    scales: {
        xAxes: [{
            gridLines: { display: false },
            ticks: { fontColor: '#3C3C3C', fontSize: 12, },
            stacked: true,
        }],
        yAxes: [{
            scaleLabel: { display: true, labelString: 'Percentage time viewed students', fontSize: 14, },
            ticks: {
                display: true,
                stacked: false,
                min: 0,
                max: 100,
                scaleSteps: 10,
                scaleStartValue: 0,
                maxTicksLimit: 10,
                padding: 30,
                callback: point => (point < 0 ? '' : point),
            },
            gridLines: {
                display: true,
                offsetGridLines: false,
                color: 'rgba(0, 0, 0, 0.1)',
                tickMarkLength: 4,
            },
        }],
    },
    legend: {
        display: false
    },
    dragData: true
    // ,onDragEnd: function (e, datasetIndex, index, value) {
    //   console.log(datasetIndex, index, value)
    // }
};

export const BAROPTIONSNEW = {
    // tooltips: { enabled: false },
    tooltips: {
        filter: function (tooltipItem, data) {
            console.log(tooltipItem);
            var label = data.labels[tooltipItem.index];
            if (tooltipItem.datasetIndex == 1) {
                return false;
            } else {
                return true;
            }
        }
    },
    hover: { mode: null },
    // maintainAspectRatio: false,
    scales: {
        xAxes: [{
            gridLines: { display: false },
            ticks: {
                fontColor: '#3C3C3C',
                fontSize: 12,
                callback: date => (new Date(date)).toLocaleDateString()
            },
            stacked: true,
        }],
        yAxes: [{
            scaleLabel: { display: true, labelString: '', fontSize: 14, },
            ticks: {
                display: true,
                stacked: false,
                min: 0,
                max: 100,
                scaleSteps: 10,
                scaleStartValue: 0,
                maxTicksLimit: 10,
                padding: 30,
                callback: point => (point < 0 ? '' : point),
            },
            gridLines: {
                display: true,
                offsetGridLines: false,
                color: 'rgba(0, 0, 0, 0.1)',
                tickMarkLength: 4,
            },
        }],
    },
    legend: {
        display: false
    }
    // ,onDragEnd: function (e, datasetIndex, index, value) {
    //   console.log(datasetIndex, index, value)
    // }
};

export const LINEOPTIONSNEW = {
    tooltips: { enabled: true },
    hover: { mode: null },
    maintainAspectRatio: false,
    scales: {
        xAxes: [{
            gridLines: { display: false },
            ticks: {
                fontColor: '#3C3C3C',
                fontSize: 12,
                callback: date => (new Date(date)).toLocaleDateString()
            },
        }],
        yAxes: [{
            scaleLabel: { display: true },
            ticks: {
                display: true,
                stacked: false,
                min: 0,
                max: 100,
                scaleSteps: 10,
                scaleStartValue: 0,
                maxTicksLimit: 10,
                padding: 30,
                callback: point => (point < 0 ? '' : point),
            },
            gridLines: {
                display: true,
                offsetGridLines: false,
                color: 'rgba(0, 0, 0, 0.1)',
                tickMarkLength: 4,
            },
        }],
    },
    legend: {
        display: true
    },
    dragData: false,
}

export const SIMPLEBAROPTIONS = {
    tooltips: {enabled: false},
    hover: {mode: null},
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        gridLines: {display: false},
        ticks: {fontColor: '#3C3C3C', fontSize: 12,},
        stacked: true
      }],
      yAxes: [{
        ticks: {
          display: true,
          stacked: false,
          scaleSteps: 10,
          maxTicksLimit: 10,
          padding: 30,
        },
        gridLines: {
          display: true,
          offsetGridLines: false,
          color: 'rgba(0, 0, 0, 0.1)',
          tickMarkLength: 4,
        },
      }],
    },
    legend:{
      display: false
    },
    dragData: false
    // ,onDragEnd: function (e, datasetIndex, index, value) {
    //   console.log(datasetIndex, index, value)
    // }
  };

  export const HISTOPTIONS = {
    tooltips: {enabled: false},
    hover: {mode: null},
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        scaleLabel: {
            display: true,
            labelString: '← Left side of classroom      Right side of classroom →'
        },
        barPercentage: 1.3,
        gridLines: {display: false},
        ticks: {display: false, fontColor: '#3C3C3C', fontSize: 12,},
        stacked: true
      }],
      yAxes: [{
        ticks: {
          display: true,
          stacked: false,
          maxTicksLimit: 10,
          padding: 30,
        },
        gridLines: {
          display: true,
          offsetGridLines: false,
          color: 'rgba(0, 0, 0, 0.1)',
          tickMarkLength: 4,
        },
      }],
    },
    legend:{
      display: false
    },
    dragData: false
  };

  export const MULTIPLEBAR = {
    tooltips: {enabled: true},
    hover: {mode: null},
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        scaleLabel: {
            display: true,
        },
        gridLines: {display: false},
        ticks: {display: false, fontColor: '#3C3C3C', fontSize: 12,},
      }],
      yAxes: [{
        ticks: {
          display: true,
          stacked: false,
          maxTicksLimit: 10,
          padding: 30,
        },
        gridLines: {
          display: true,
          offsetGridLines: false,
          color: 'rgba(0, 0, 0, 0.1)',
          tickMarkLength: 4,
        },
      }],
    },
    legend:{
      display: false
    },
    dragData: false
  };

export const SCATTEROPTIONS = {

};