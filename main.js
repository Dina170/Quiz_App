let countSpan = document.querySelector(".count span");
let progress = document.querySelector(".time-line");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submitBtn = document.querySelector(".submit-button");
let resultsContainer = document.querySelector(".results");
let countdownTimer = document.querySelector(".countdown");
let footer = document.querySelector(".footer");

let currentQIndex = 0;
let rightAnswers = 0;
let countdownInterval;

function getQuestions() {
  fetch(
    `https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple`
  )
    .then((res) => res.json())
    .then((res) => {
      return res.results;
    })
    .then((qA) => {
      let qcount = qA.length;

      addQuestion(qA[currentQIndex], qcount);

      //countdown(3, qcount);

      answerArea.addEventListener("click", (e) => {
        // check answer
        let theRightAnswer = qA[currentQIndex].correct_answer;
        currentQIndex++;
        console.log(currentQIndex);
        countSpan.innerHTML = currentQIndex + 1;
        checkAnswer(theRightAnswer, e.target.innerHTML);

        // remove previous question
        quizArea.innerHTML = "";
        answerArea.innerHTML = "";

        // add next q
        addQuestion(qA[currentQIndex], qcount);

        increaseTimeLine();

        // countdown
        clearInterval(countdownInterval);
        //countdown(3, qcount);

        // results
        if (currentQIndex === qcount) {
          countSpan.innerHTML = currentQIndex;
          showResults(qcount);
        }
      });
    });
}

getQuestions();

function addQuestion(question, count) {
  if (currentQIndex < count) {
    // create and add q in h2
    let questionTitle = document.createElement("h2");
    questionTitle.innerHTML = question.question;
    //let questionText = document.createTextNode(question.question);
    //questionTitle.appendChild(questionText);
    quizArea.appendChild(questionTitle);

    let answers = question.incorrect_answers;
    answers.push(question.correct_answer);

    let temp;
    let randIndex = Math.floor(Math.random() * answers.length);

    for (let i = answers.length - 1; i >= 0; i--) {
      temp = answers[i];
      answers[i] = answers[randIndex];
      answers[randIndex] = temp;
    }

    // create and add the answers
    for (let i = 1; i <= 4; i++) {
      let answersContainer = document.createElement("div");
      answersContainer.className = "answers-container";

      let p1 = document.createElement("p");
      p1.className = "answers-prefix";
      let nums = document.createTextNode(i);
      p1.appendChild(nums);
      answersContainer.appendChild(p1);

      let p2 = document.createElement("p");
      p2.className = "answers-text";
      p2.innerHTML = answers[i - 1];
      // or
      // let answer = document.createTextNode(answers[i - 1]);
      // p2.appendChild(answer);
      answersContainer.appendChild(p2);

      answerArea.appendChild(answersContainer);
    }

    // let theRightAnswer = question.correct_answer;
    // answerArea.addEventListener("click", (e) => {
    //   if (e.target.classList == "answers-text") {
    //     // check answer
    //     checkAnswer(theRightAnswer, e.target.innerHTML, count);
    //   }
    // });
  }
}

function checkAnswer(rAnswer, chosenAns) {
  if (rAnswer == chosenAns) {
    console.log("match");
    rightAnswers++;
  }
}

function increaseTimeLine() {
  progress.style.width = `calc(${currentQIndex} * 100% / 10)`;
}

function countdown(duration, count) {
  if (currentQIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = minutes < 10 ? `0${seconds}` : seconds;

      countdownTimer.innerHTML = `Time Left: ${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        answerArea.click();
      }
    }, 1000);
  }
}

function showResults(count) {
  let theResult;

  quizArea.remove();
  answerArea.remove();
  footer.remove();

  if (rightAnswers > count / 2 && rightAnswers < count) {
    theResult =
      theResult = `<span class="good">Good</span>, ${rightAnswers} From ${count}`;
  } else if (rightAnswers === count) {
    theResult = `<span class="perfect">Perfect</span>, All Answers Is Good`;
  } else {
    theResult = `<span class="bad">Bad</span>, ${rightAnswers} From ${count}`;
  }

  resultsContainer.innerHTML = theResult;
  resultsContainer.style.fontWeight = "bold";
  resultsContainer.style.color = "#344b47";
  resultsContainer.style.padding = "20px";
}
