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
    questionCreate();
    setLoading(false);
    setTour(tour + 1);
    setQuestionCounter(questionCounter + 1);
    setIsStarted(true);
  };
  const endGame = () => {
    setLoading(false);
    setIsStarted(!isStarted);
    setQuestionCounter(0);
    setTotalQuestion(totalQuestion + questionCounter -1);
    console.log(totalQuestion + questionCounter - 1);

    let userDetails = {
      score: score,
      correctAnswer: correctAnswer,
      question:totalQuestion,
    };
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
    setCorrectAnswerList([]);
  };
  const nextQuestion = () => {
    setTimeout(() => {
      questionCreate();

      setQuestionCounter(questionCounter + 1);

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
    totalQuestion
  };
  if (loading) {
    return <div>Yükleniyorr..</div>;
  }

  return <GameContext.Provider value={values}>{children}</GameContext.Provider>;
};

const useGame = () => useContext(GameContext);

export { GameProvider, useGame };
