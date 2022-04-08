import { createContext, useState, useEffect, useContext } from "react";
const GameContext = createContext();

const GameProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
  const [tour, setTour] = useState(0);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [questionCounter, setQuestionCounter] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [background, setBackground] = useState("mathsQuestion");
  const [totalQuestion, setTotalQuestion] = useState(0);
  const [correctAnswerList, setCorrectAnswerList] = useState([]);

  let userDetails;
  userDetails = localStorage.getItem("userDetails");
  const questionCreate = () => {
    setNum1(Math.floor(Math.random() * 10) + 1);
    setNum2(Math.floor(Math.random() * 10) + 1);
    setQuestions({
      num1: num1,
      num2: num2,
      answers: [
        num1 * num2,
        num1 * (num2 - 1) === 0 ? 1 : num1 * (num2 - 1),
        Math.floor(Math.floor((num1 + 1) * (num2 + 1))),
      ],
    });
  };

  useEffect(() => {
    questionCreate();
    setBackground("");
    setLoading(false);
  }, []);

  const startGame = () => {
    userDetails = JSON.parse(userDetails);
    questionCreate();
    setScore(0);
    setLoading(false);
    setTour(tour + 1);
    setQuestionCounter(questionCounter + 1);
    if (userDetails) {
      setTotalQuestion(userDetails.question);
      setCorrectAnswer(userDetails.correctAnswer);
    }
    setIsStarted(true);
  };
  const endGame = () => {
    setLoading(false);

    setIsStarted(!isStarted);
    console.log("total", totalQuestion, "counter", questionCounter);
    console.log(totalQuestion, questionCounter);

    let totalLength = 0;
    let totalScore = 0;
    userDetails = JSON.parse(userDetails);
    totalLength += totalQuestion;
    if (userDetails?.score > 0) {
      console.log("score", score, userDetails.score);
      totalScore = score;
      totalScore = +userDetails.score;
    }
    totalScore += score;
    userDetails = {
      score: totalScore,
      correctAnswer: correctAnswer,
      question: totalLength,
    };
    localStorage.setItem("userDetails", JSON.stringify(userDetails));

    setCorrectAnswerList([]);
    setQuestionCounter(0);
  };
  const nextQuestion = () => {
    setTimeout(() => {
      questionCreate();

      setQuestionCounter(questionCounter + 1);
      setTotalQuestion(totalQuestion + 1);
      setLoading(false);
      setBackground("");
    }, 3000);
  };
  const answerChecker = (answer) => {
    if (answer === questions.answers[0]) {
      setBackground("answerCorrect");

      if (score === 0 && correctAnswer === 0) {
        setScore(score + 20);
        setCorrectAnswer(correctAnswer + 2);
      }
      setScore(score + Math.floor(Math.sqrt(questions.answers[0])));
      setCorrectAnswer(correctAnswer + 1);
      setCorrectAnswerList([
        ...correctAnswerList,
        {
          num1: questions.num1,
          num2: questions.num2,
          answer: answer,
          answerStatus: "✓",
        },
      ]);

      nextQuestion();
    } else {
      setBackground("answerNotCorrect");

      setCorrectAnswerList([
        ...correctAnswerList,
        {
          num1: questions.num1,
          num2: questions.num2,
          answer: questions.answers[0],
          answerStatus: "×",
        },
      ]);

      nextQuestion();
    }
  };

  const values = {
    startGame,
    isStarted,
    endGame,
    score,
    nextQuestion,
    tour,
    questions,
    answerChecker,
    background,
    setIsStarted,
    questionCounter,
    correctAnswerList,
    totalQuestion,
    correctAnswer,
  };
  if (loading) {
    return <div>Yükleniyorr..</div>;
  }

  return <GameContext.Provider value={values}>{children}</GameContext.Provider>;
};

const useGame = () => useContext(GameContext);

export { GameProvider, useGame };
