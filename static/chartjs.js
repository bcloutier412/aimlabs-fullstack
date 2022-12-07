//CHART JS
/*
  @desc: 3 separate game configs for 3 different charts.
*/
let config1 = {
  type: "line",
  data: {
    labels: ["", ""],
    datasets: [
      {
        label: "SMALL",
        backgroundColor: "#edc9ff",
        borderColor: "#541388",
        data: [],
      },
      {
        label: "MEDIUM",
        backgroundColor: "#83c5be",
        borderColor: "#b8dedc",
        data: [],
      },
      {
        label: "LARGE",
        backgroundColor: "#ffddd2",
        borderColor: "#e29578",
        data: [],
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  },
};
let config2 = {
  type: "line",
  data: {
    labels: ["", ""],
    datasets: [
      {
        label: "SMALL",
        backgroundColor: "#edc9ff",
        borderColor: "#541388",
        data: [],
      },
      {
        label: "MEDIUM",
        backgroundColor: "#83c5be",
        borderColor: "#b8dedc",
        data: [],
      },
      {
        label: "LARGE",
        backgroundColor: "#ffddd2",
        borderColor: "#e29578",
        data: [],
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  },
};
let config3 = {
  type: "line",
  data: {
    labels: ["", ""],
    datasets: [
      {
        label: "SMALL",
        backgroundColor: "#edc9ff",
        borderColor: "#541388",
        data: [],
      },
      {
        label: "MEDIUM",
        backgroundColor: "#83c5be",
        borderColor: "#b8dedc",
        data: [],
      },
      {
        label: "LARGE",
        backgroundColor: "#ffddd2",
        borderColor: "#e29578",
        data: [],
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  },
};

/*  
  @desc: IIFE to populate the chart.js configs with the game data taken from the local storage
*/
(function initializeDataFromLocalStorage() {
  if (localStorage.getItem('isInitialized')) {
    loadConfig1 = JSON.parse(localStorage.getItem('config1'))
    loadConfig2 = JSON.parse(localStorage.getItem('config2'))
    loadConfig3 = JSON.parse(localStorage.getItem('config3'))
    config1 = loadConfig1._config
    config2 = loadConfig2._config
    config3 = loadConfig3._config
  }
})();

/*
  @desc: Initializes 3 different charts
*/
const oneMinuteChart = new Chart(document.getElementById("oneMinuteChart"), config1);
const twoMinuteChart = new Chart(document.getElementById("twoMinuteChart"), config2);
const threeMinuteChart = new Chart(document.getElementById("threeMinuteChart"), config3);

const chart1Display = document.querySelector('#chart1');
const chart2Display = document.querySelector('#chart2');
const chart3Display = document.querySelector('#chart3');
const chartDisplayArray = [
  chart1Display,
  chart2Display,
  chart3Display
];

/*
  @desc: Sets all 3 of the chart displays to none.
*/
var setAllChartDisplayToOff = function() {
  for (let element of chartDisplayArray) {
    setDisplayToDefault(element);
    element.classList.add('display-off');
  };
};
/*
  @desc: Adds data to the correct minute chart and to the right datasetindex.
*/
var addData = function (chart, datasetIndex) {
  if (!chart.config.data.datasets[datasetIndex].data.length) {
    chart.config.data.datasets[datasetIndex].data.push(0);
  };
  /*
    @desc: Append the data to the dataset and push a label to the labels array so no error is thrown for an offest of data to labels.
  */
  chart.config.data.datasets[datasetIndex].data.push(scoreInt);
  if (((chart.config.data.labels.length - 1) - chart.config.data.datasets[datasetIndex].data.length) < 0) {
    chart.config.data.labels.push("");
  };
};
/*
  @desc: Updates the chart with the newly finished score.
*/
var updateChart = function () {
  let difficulity = targetSizeSelect.value;
  let datasetIndex;
  let chart;
  setAllChartDisplayToOff();
  if (difficulity === "hard") {
    datasetIndex = 0;
  } else if (difficulity === "medium") {
    datasetIndex = 1;
  } else if (difficulity === "easy") {
    datasetIndex = 2;
  };
  if (minutes === 1) {
    chart = oneMinuteChart
    chart1Display.classList.remove('display-off')
  } else if (minutes === 2) {
    chart = twoMinuteChart
    chart2Display.classList.remove('display-off')
  } else if (minutes === 3) {
    chart = threeMinuteChart
    chart3Display.classList.remove('display-off') 
  };
  addData(chart, datasetIndex);
  chart.update();
};

/*
  @desc: Saves the config objects to local storage to save the game score data.
*/
var saveToLocalStorage =function() {
  const saveConfig1 = JSON.stringify(oneMinuteChart.config);
  const saveConfig2 = JSON.stringify(twoMinuteChart.config);
  const saveConfig3 = JSON.stringify(threeMinuteChart.config);
  localStorage.setItem('config1', saveConfig1);
  localStorage.setItem('config2', saveConfig2);
  localStorage.setItem('config3', saveConfig3);
  localStorage.setItem('isInitialized', true);
}
