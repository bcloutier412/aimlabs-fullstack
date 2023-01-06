/*
GRID-SHOT
@desc: 
FOR DEMO MODE CHANGE THE INTERVAL VALUE TO SOMETHING LOWER THAN 1000: line 132ish
*/

// @desc All of the game variables
const targetGap = 3;
let targetDiameter = 48 + targetGap;
let targetColor = "#24B7C2";
let totalShots = 0;
let targetsHit = 0;
let scoreInt = 0;
let accuracy = 0;
let minutes = 1;
let inPlay = false;

/*
@desc: Creates an audio object and executes the .play method to play the sound
      The reason we create an audio object is because we want to sound to play synchronously.
      This means multiple audioobjects can be played at once.
*/
var playTargetAudio = function () {
  let audioObj = new Audio("/static/audio/firecracker.mp3");
  audioObj.volume = 0.2;
  audioObj.play();
};

/*
@desc: clears the classList for the inputed element
@param: element = node object
*/
var setDisplayToDefault = function (element) {
  element.className = "";
};
/*
@desc: adds the 'display-off' class to the inputed element
@param: element = node object
*/
var setDisplayToNone = function (element) {
  element.classList.add("display-off");
};
/*
@desc: returns a random number between 0 and the 
inputed integer (highest number of rows or columns 
compatible with the screensize)

@param: num = intended to be the highest integer of rows or columns compatible with the screensize... number)
*/
var getRandomNum = function (num) {
  return Math.floor(Math.random() * (num - 0)) + 0;
};

/*
@desc: Calculates and changes the on-screen accuracy text based on targetsHit/totalShots
*/
var updateAccuracy = function () {
  accuracy = (targetsHit / totalShots) * 100;
  accuracy = accuracy.toString().slice(0, 4);
  accuracyPercent.textContent = accuracy;
};

/*
@desc: Calculates and changes the on-screen score text based on targetsHit/totalShots
*/
var updateScore = function () {
  scoreInt += 1000 * (accuracy / 100);
  score.textContent = scoreInt;
};

/*
@desc: Changes the on-screen minutes text to the variables initialized in the JS
*/
var setMinutes = function () {
  minutesElement.textContent = minutes;
};

/*
@desc: Matches the on-screen endgame stats text to JS variables
*/
var setEndGameStats = function () {
  totalShotsStat.textContent = totalShots;
  totalMissesStat.textContent = totalShots - targetsHit;
  accuracyStat.textContent = accuracy;
  totalPointsStat.textContent = scoreInt;
};

/*
@desc: Recursive function to countdown from the initialized start time. 
If the timer gets to 0:00 the game is stopped and the endGameStats is displayed;
Else if the seconds gets to 0... minutes decreases by 1 and seconds is set to 59;
Else decrease seconds by 1 and if seconds is less than 10, concatenate '0' to the front of the string;
    to preserve the timer aesthetic
*/
var startTimer = function () {
  currentMinute = parseInt(minutesElement.textContent);
  currentSecond = parseInt(secondsElement.textContent);
  if (currentSecond === 0 && currentMinute === 0) {
    inPlay = false;
    let audioObjStop = new Audio("/static/audio/go.mp3");
    audioObjStop.play();
    countdown.textContent = "STOP!";
    setDisplayToDefault(countdown);
    setEndGameStats();
    setTimeout(() => {
      setDisplayToNone(countdown);
      main.classList.add("blur-effect");
      setTimeout(() => {
        updateChart();
        setDisplayToDefault(endGameStatsContainer);
        endGameStatsContainer.classList.add("display-flex");
      }, 1000);
    }, 1000);
    return;
  } else if (currentSecond === 0) {
    setTimeout(() => {
      currentMinute -= 1;
      currentSecond = 59;
      minutesElement.textContent = currentMinute;
      secondsElement.textContent = currentSecond;
      startTimer();
    }, 1000);
  } else {
    setTimeout(() => {
      currentSecond -= 1;
      if (currentSecond < 10) {
        secondsElement.textContent = "0" + currentSecond;
      } else {
        secondsElement.textContent = currentSecond;
      }
      startTimer();
    }, 100); // Change this variable to speed the game up
  }
};
/*
@desc: Countdown function (3...2...1...GO!) -> start game timer
once the count down function is done it starts the game timer and sets the inPlay variable to true
*/
var startCountdownAndTimer = function () {
  setDisplayToDefault(countdown);
  let audioObj = new Audio("/static/audio/countdown.mp3");
  let audioObjGo = new Audio("/static/audio/go.mp3");
  audioObj.volume = 0.2;
  audioObjGo.volume = 0.4;
  audioObj.play();
  setTimeout(() => {
    countdown.textContent = "2";
    audioObj.play();
    setTimeout(() => {
      countdown.textContent = "1";
      audioObj.play();
      setTimeout(() => {
        countdown.textContent = "GO!";
        audioObjGo.play();
        setTimeout(() => {
          inPlay = true;
          setDisplayToNone(countdown);
          startTimer();
        }, 1000);
      }, 1000);
    }, 1000);
  }, 1000);
};

/*
@desc: gives the inputed element an arbitrary location on the 
screen based on the total number of Cols and Rows
@param: element = The newly created target 
        numOfCols/numOfRows = the highest number of columns/rows 
        compatible with the screensize
*/
var resetLocation = function (element, numOfCols, numOfRows) {
  element.style.top = `${getRandomNum(numOfRows) * targetDiameter}px`;
  element.style.left = `${getRandomNum(numOfCols) * targetDiameter}px`;
};

/*
@desc: Creates 7 new targets and gives each of them an arbitrary 
location on the screen. Each of the target receives a click event
listener. When the target is clicked it will in order:
    play target hit audio
 -> increase totalShots/targetsHit
 -> calculate and reset the new Accuracy and Score
 -> gives the target a new arbitrary location on the screen

 Finally the new target is appended to the main container

*/
var createTargets = function () {
  const numOfCols = Math.floor((window.innerWidth * 0.8) / targetDiameter);
  const numOfRows = Math.floor((window.innerHeight * 0.9) / targetDiameter);
  setDisplayToDefault(main);
  //create 7 initial targets
  for (let i = 0; i < 7; i++) {
    const newTarget = document.createElement("div");
    newTarget.classList.add("target");
    newTarget.style.height = `${targetDiameter - 2}px`;
    newTarget.style.width = `${targetDiameter - 2}px`;
    newTarget.style.background = targetColor;
    resetLocation(newTarget, numOfCols, numOfRows);
    //adding click event listener. Resets location of target and increases clicks.
    newTarget.addEventListener("click", function (e) {
      if (inPlay) {
        playTargetAudio();
        totalShots += 1;
        targetsHit += 1;
        updateAccuracy();
        updateScore();
        resetLocation(this, numOfCols, numOfRows);
        e.stopPropagation();
      }
    });
    main.appendChild(newTarget);
  }
};

/*
@desc: Removes all targets from the main container/DOM
*/
var removeAllTargets = function () {
  for (let i = main.childNodes.length - 1; i >= 0; i--) {
    main.removeChild(main.childNodes[i]);
  }
};

/*
@desc: Resets all the game variables so it is ready for another game to be played
*/
var resetGameVariables = function () {
  totalShots = 0;
  targetsHit = 0;
  scoreInt = 0;
  accuracy = 0;
  seconds = 0;
  inPlay = false;
  countdown.textContent = "3";
  accuracyPercent.textContent = "0";
  score.textContent = "0";
};
/*
@desc: Turns off the end game stats and resets the entire page to the menu
*/
var resetToGameMenu = function () {
  removeAllTargets();
  setDisplayToDefault(endGameStatsContainer);
  setDisplayToNone(endGameStatsContainer);
  setDisplayToDefault(menu);
  setDisplayToNone(gameStats);
  setDisplayToDefault(main);
  resetGameVariables();
  setDisplayToNone(main);
};

//START BUTTON TO START GAME
startBtn.addEventListener("click", () => {
  setDisplayToNone(menu);
  createTargets();
  setMinutes();
  startCountdownAndTimer();
  setDisplayToDefault(gameStats);
});

/*
@desc: if the main container is clicked this means
the user has missed the target so total shots will increase, 
audio will be played, and it will update the accuracy.
*/
main.addEventListener("click", function (e) {
  if (inPlay) {
    totalShots += 1;
    playTargetAudio();
    updateAccuracy();
  }
});

/*
  @desc: Changes the size of the target
*/
targetSizeSelect.addEventListener("change", function () {
  let difficulity = this.value;
  if (difficulity === "hard") {
    targetDiameter = 28 + targetGap;
  } else if (difficulity === "medium") {
    targetDiameter = 48 + targetGap;
  } else if (difficulity === "easy") {
    targetDiameter = 68 + targetGap;
  }
});

/*
  @desc: Changes the color of the targets
*/
colorPicker.addEventListener("input", () => {
  targetColor = colorPicker.value;
});

/*
  @desc: Updates the amount of minutes the game will last for.
*/
minutesSelect.addEventListener("change", function () {
  if (this.value === "1") {
    minutes = 1;
  } else if (this.value === "2") {
    minutes = 2;
  } else if (this.value === "3") {
    minutes = 3;
  }
});

/*
  @desc: Adds audio effect to each menu btn
*/
for (let element of menubtns.children) {
  element.firstElementChild.addEventListener("mouseenter", () => {
    let audioObj = new Audio("/static/audio/menubtn.mp3");
    audioObj.volume = 0.05;
    audioObj.play();
  });
}

document.querySelector('#continue-btn').addEventListener("click", resetToGameMenu);

//Clears the localStorage and reloads the game
document.querySelector('#clear-data-btn').addEventListener('click', () => {
  fetch(URL + 'deletescores', { method: 'POST'})
  .then(response => {
    if (response.redirected) {
      window.location.href = response.url
    }
  })
  .catch(err => {
    console.log(err)
  })
})

document.querySelector("#logout-btn").addEventListener('click', () => {
  fetch(URL + 'logout', { method:'POST' })
  .then(response => {
    if (response.redirected) {
      window.location.href = response.url
    }
  })
  .catch(err => {
    console.log(err)
  })
}) 