
//Getting the required elements
var startButton = document.getElementById("start-btn");
var introContainerEl = document.getElementById("intro-container");
var introEl = document.querySelector(".intro")
var questionContainerEl = document.getElementById("question-container");
var content = document.querySelector(".content");
var questionEl = document.getElementById("question");
var answerButtonsEl = document.getElementById("answer-btns");
var timerEl = document.getElementById("time");
var userInitials = document.getElementById("userInitials");
var highScoresBtn = document.getElementById("highscores-btn");
var highScoresBtnHeader = document.getElementById("viewHighScores");
var timeValue = 75;
let shuffledQuestions, currentQuestionIndex;

highScoresBtnHeader.addEventListener('click', viewHighScores);

// Start Quiz Button
startButton.addEventListener('click', startGame);
function startGame() {
  timeValue = 75;
  startTimer();
  userInitials.classList.add('hide');
  startButton.classList.add('hide');
  questionContainerEl.classList.remove('hide');
  introContainerEl.classList.add('hide');
  shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  currentQuestionIndex = 0;
  setNextQuestion();
}

//Starts the timer function and sets it to run every 1 second
function startTimer() {
  intervalId = setInterval(timer, 1000);
}

//The timer function that counts down
function timer() {
  //We do this so that the timer stops at 0
  if (timeValue >= 0) {
    timerEl.innerText = timeValue;
    timeValue--; //subtracts one from the remaining timeValue
  } else {
    gameEnd(); //ends the game
  }
  //If the timer gets below 30 we change the color to red
  if (timeValue < 30) {
    timerEl.classList.add('warning');
  }
}

//Pull the next question
function setNextQuestion() {
  //this if statement is how we determine if they are done with the quiz
  if (currentQuestionIndex == shuffledQuestions.length) {
    logScore(); //there are no more questions so we should log the players score
  } else { //there are more questions to ask, reset things and ask the question
    resetState();
    showQuestion(shuffledQuestions[currentQuestionIndex]);
  }
}

//Display the Question and Answers
function showQuestion(question) {
  questionEl.innerText = question.question;
  question.answers.forEach(answer => {
    var button = document.createElement('button');
    button.innerText = answer.text;
    button.classList.add('btn');
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener('click', selectAnswer);
    answerButtonsEl.appendChild(button);
  });
}

function resetState() {
  clearStatusClass(document.body);
  while (answerButtonsEl.firstChild) {
    answerButtonsEl.removeChild(answerButtonsEl.firstChild);
  }
}

//User's Answer
function selectAnswer(e) {
  var selectedButton = e.target;
  var correct = selectedButton.dataset.correct;
  setStatusClass(document.body, correct);
}

//Results of the Users Answer
function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    currentQuestionIndex++;
    setNextQuestion();
  } else {
    timeValue = timeValue - 10; //subtract 10 from time since they were wrong
    if (timeValue > 0) {
      currentQuestionIndex++;
      setNextQuestion();
    } else {
      gameEnd();
    }
  }
}

function clearStatusClass(element) {
  element.classList.remove('correct');
  element.classList.remove('wrong');
}

//if time reaches 0
function gameEnd() {
  clearInterval(intervalId); //kills the timer
  timerEl.innerText = 0;
  resetState();
  questionEl.innerText = "Sorry, Try Again!";
  startButton.classList.remove('hide');
  startButton.textContent = "Restart Quiz";
}

//if the user successfully makes it this far
function logScore() {
  clearInterval(intervalId); //kills the timer
  timerEl.innerText = "";
  finalScore = timeValue;
  resetState();
  questionEl.style.fontWeight = "bold";
  questionEl.innerText = "Congrats you scored a " + timeValue;
  userInitials.classList.remove('hide');
  highScoresBtn.classList.remove('hide');
  highScoresBtn.style.marginTop = "100px";
  highScoresBtn.addEventListener('click', saveLocally);
}

// Local Storage
function saveLocally() {
  startButton.classList.remove('hide');
  startButton.innerText = "Restart Quiz";
  let highScores = [];
  let userScore = {
    initials: userInitials.value,
    score: finalScore
  };
  highScores.push(userScore);
  localStorage.setItem("userScore", JSON.stringify(userScore));
  viewHighScores();
}


//View High Scores
function viewHighScores() {
  introEl.classList.add('hide');
  introContainerEl.classList.add('hide');
  highScoresBtn.classList.add('hide');
  var savedScores = localStorage.getItem("userScore");
  savedScores = JSON.parse(savedScores);
  introEl.classList.remove('hide')
  questionEl.innerText = savedScores.initials + " had a score of " + savedScores.score;


}

//Questions Array
var questions = [
  {
    question: "Where do you place the <script> tag in HTML?",
    answers: [
      { text: 'In the Head', correct: false },
      { text: 'At the bottom of the Body Section', correct: true },
      { text: 'At the top of the Body section', correct: false },
      { text: 'In the Footer', correct: false },
    ]
  },
  {
    question: "What is the correct syntax when referring to an external js script?",
    answers: [
      { text: '<script src=', correct: false },
      { text: '<script =', correct: false },
      { text: '<script href=', correct: true },
      { text: '<script name=', correct: false },
    ]
  },
  {
    question: "How do you display a message in an alert box?",
    answers: [
      { text: 'alert()', correct: true },
      { text: 'msg()', correct: false },
      { text: 'alertBox()', correct: false },
      { text: 'alert{}', correct: false },
    ]
  },
  {
    question: "How do you create a function in JavaScript?",
    answers: [
      { text: 'var myFunction = function()', correct: false },
      { text: 'function = myFunction()', correct: false },
      { text: 'function myFunction()', correct: true },
      { text: 'function:myFunction()', correct: false },
    ]
  },
  {
    question: "How do you say is NOT equal to?",
    answers: [
      { text: '==', correct: false },
      { text: '=', correct: false },
      { text: '!=', correct: true },
      { text: '=!', correct: false },
    ]
  },
  {
    question: "How does a for loop start?",
    answers: [
      { text: 'for (i=0, i <=5)', correct: false },
      { text: 'for(i=0, i<=5, i++)', correct: false },
      { text: 'for(i<=5; i++)', correct: false },
      { text: 'for(i=0; i<=5, i++)', correct: true },
    ]
  },
  {
    question: "How do you leave a comment in JavaScript",
    answers: [
      { text: '//comment', correct: false },
      { text: '/*comment*/', correct: false },
      { text: 'A and B', correct: true },
      { text: 'None of the above', correct: false },
    ]
  },
  {
    question: "What event occurs when the user clicks on an HTML element?",
    answers: [
      { text: 'onclick', correct: true },
      { text: 'action', correct: false },
      { text: 'hover', correct: false },
      { text: 'onmouseclick', correct: false },
    ]
  },
  {
    question: "How do you assign a variable a value?",
    answers: [
      { text: 'variable:value', correct: false },
      { text: 'variable == 5', correct: false },
      { text: 'variable === 5', correct: false },
      { text: 'variable = 5', correct: true },
    ]
  },
  {
    question: "How do you round a number to the nearest integer?",
    answers: [
      { text: 'Math.rnd()', correct: false },
      { text: 'Math.round()', correct: true },
      { text: 'round()', correct: false },
      { text: 'Math.floor()', correct: false },
    ]
  }
];