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
  @desc: Initializes 3 different charts
*/
const oneMinuteChart = new Chart(document.getElementById("oneMinuteChart"), config1);
const twoMinuteChart = new Chart(document.getElementById("twoMinuteChart"), config2);
const threeMinuteChart = new Chart(document.getElementById("threeMinuteChart"), config3);

/*
  @desc: populate the datasets from the database
*/
fetch('scores')
.then(response => response.json())
.then(data => {
  for (const score of data) {
    let chart;

    if (score['minutes'] === 1) {
      chart = oneMinuteChart
    } else if (score['minutes'] === 2) {
      chart = twoMinuteChart
    } else if (score['minutes'] === 3) {
      chart = threeMinuteChart
    };

    if (!chart.config.data.datasets[score['datasetIndex']].data.length) {
      chart.config.data.datasets[score['datasetIndex']].data.push(0);
    };

    chart.config.data.datasets[score['datasetIndex']].data.push(score['score']);
    if (((chart.config.data.labels.length - 1) - chart.config.data.datasets[score['datasetIndex']].data.length) < 0) {
    chart.config.data.labels.push("");
  };
  }
})

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
var addData = async function (chart, datasetIndex) {
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
  /*
    @desc: adding the score to the database
  */  
  await fetch('scores', { 
    method:'POST',
    body: JSON.stringify({
      score: scoreInt,
      accuracy: accuracy,
      datasetIndex: datasetIndex,
      minutes: minutes
    }),
    headers: {
      'Content-type': 'application/json'
    } 
  })
  .then(response => response.json())
  .then(data => {
    leaderboard = document.querySelector("#leaderboardul");
    while (leaderboard.firstChild) {
      leaderboard.removeChild(leaderboard.firstChild)
    }
    for (const score of data) {
      const node = document.createElement("li");
      node.innerHTML = `<li style="margin: 0; width: 100%;">${score['username']}: ${score['score']}pts - ${score['accuracy']}%</li>`
      leaderboard.appendChild(node)
    }
  })
};
/*
  @desc: Updates the chart with the newly finished score.
*/
var updateChart = function () {
  let difficulty = targetSizeSelect.value;
  let datasetIndex;
  let chart;
  setAllChartDisplayToOff();
  if (difficulty === "hard") {
    datasetIndex = 0;
  } else if (difficulty === "medium") {
    datasetIndex = 1;
  } else if (difficulty === "easy") {
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
