"use client";

import React, { useState, useEffect, useCallback } from "react";
import { IntroScreen } from "./IntroScreen";
import { GameOverScreen } from "./GameOverScreen";
import { QuestionScreen } from "./QuestionScreen";

interface Question {
  question: string;
  answers: string[];
  correctAnswer: number;
}

const questions: Question[] = [
  {
    question: "¿Cuál es la capital de Francia?",
    answers: ["Londres", "Berlín", "París", "Madrid"],
    correctAnswer: 2,
  },
  {
    question: "¿Qué planeta es conocido como el Planeta Rojo?",
    answers: ["Venus", "Marte", "Júpiter", "Saturno"],
    correctAnswer: 1,
  },
  {
    question: "¿Quién pintó la Mona Lisa?",
    answers: [
      "Vincent van Gogh",
      "Pablo Picasso",
      "Leonardo da Vinci",
      "Miguel Ángel",
    ],
    correctAnswer: 2,
  },
  {
    question: "¿Cuál es el océano más grande de la Tierra?",
    answers: [
      "Océano Atlántico",
      "Océano Índico",
      "Océano Ártico",
      "Océano Pacífico",
    ],
    correctAnswer: 3,
  },
  {
    question: "¿Qué elemento tiene el símbolo químico 'O'?",
    answers: ["Oro", "Plata", "Oxígeno", "Hierro"],
    correctAnswer: 2,
  },
  {
    question: "¿Cuál es el mamífero más grande del mundo?",
    answers: ["Elefante africano", "Ballena azul", "Jirafa", "Hipopótamo"],
    correctAnswer: 1,
  },
  {
    question: "¿En qué año terminó la Segunda Guerra Mundial?",
    answers: ["1943", "1944", "1945", "1946"],
    correctAnswer: 2,
  },
  {
    question: "¿Cuál es la capital de Japón?",
    answers: ["Seúl", "Pekín", "Bangkok", "Tokio"],
    correctAnswer: 3,
  },
  {
    question: "¿Quién escribió 'Romeo y Julieta'?",
    answers: [
      "Charles Dickens",
      "William Shakespeare",
      "Jane Austen",
      "Mark Twain",
    ],
    correctAnswer: 1,
  },
  {
    question: "¿Cuál es el órgano más grande del cuerpo humano?",
    answers: ["Cerebro", "Hígado", "Piel", "Corazón"],
    correctAnswer: 2,
  },
];

enum GameState {
  Intro,
  Playing,
  GameOver,
}

export default function TriviaGame() {
  const [gameState, setGameState] = useState<GameState>(GameState.Intro);
  const [playerName, setPlayerName] = useState("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);

  const resetQuestion = useCallback(() => {
    setSelectedAnswer(null); // Limpiar la selección
    setShowFeedback(false);
    setTimeRemaining(30);
    setIsTimerRunning(true);
    setShowHint(false);
  }, []);

  useEffect(() => {
    const savedHighScore = localStorage.getItem("triviaHighScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
    setShuffledQuestions(shuffleArray(questions));
  }, []);

  useEffect(() => {
    if (gameState === GameState.Playing) {
      resetQuestion();
    }
  }, [currentQuestion, gameState, resetQuestion]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && timeRemaining > 0) {
      timer = setTimeout(() => setTimeRemaining((prev) => prev - 1), 1000);
    } else if (timeRemaining === 0) {
      handleAnswer(null);
    }
    return () => clearTimeout(timer);
  }, [timeRemaining, isTimerRunning]);

  const shuffleArray = (array: Question[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleAnswer = useCallback(
    (answerIndex: number | null) => {
      setSelectedAnswer(answerIndex);
      setShowFeedback(true);
      setIsTimerRunning(false);
      if (answerIndex === shuffledQuestions[currentQuestion].correctAnswer) {
        const pointsEarned = Math.max(1, Math.floor(timeRemaining / 3));
        setScore((prevScore) => prevScore + pointsEarned);
        setStreakCount((prevStreak) => prevStreak + 1);
      } else {
        setStreakCount(0);
      }
    },
    [currentQuestion, shuffledQuestions, timeRemaining]
  );

  const handleNextQuestion = useCallback(() => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      endGame();
    }
  }, [currentQuestion, shuffledQuestions.length]);

  const startGame = useCallback(() => {
    if (playerName.trim()) {
      setGameState(GameState.Playing);
      setCurrentQuestion(0);
      setScore(0);
      setStreakCount(0);
      setShuffledQuestions(shuffleArray(questions));
    }
  }, [playerName]);

  const endGame = useCallback(() => {
    setGameState(GameState.GameOver);
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem("triviaHighScore", score.toString());
    }
  }, [score, highScore]);

  const restartGame = useCallback(() => {
    setGameState(GameState.Intro);
    setPlayerName("");
    setCurrentQuestion(0);
    setScore(0);
    setStreakCount(0);
  }, []);

  const showHintHandler = useCallback(() => {
    setShowHint(true);
    setTimeRemaining((prev) => Math.max(prev - 5, 0));
  }, []);

  switch (gameState) {
    case GameState.Intro:
      return (
        <IntroScreen
          playerName={playerName}
          setPlayerName={setPlayerName}
          highScore={highScore}
          startGame={startGame}
        />
      );
    case GameState.Playing:
      return (
        <QuestionScreen
          question={shuffledQuestions[currentQuestion].question}
          answers={shuffledQuestions[currentQuestion].answers}
          currentQuestion={currentQuestion}
          totalQuestions={shuffledQuestions.length}
          selectedAnswer={selectedAnswer}
          showFeedback={showFeedback}
          timeRemaining={timeRemaining}
          showHint={showHint}
          correctAnswer={shuffledQuestions[currentQuestion].correctAnswer}
          score={score}
          streakCount={streakCount}
          handleAnswer={handleAnswer}
          handleNextQuestion={handleNextQuestion}
          showHintHandler={showHintHandler}
        />
      );
    case GameState.GameOver:
      return (
        <GameOverScreen
          playerName={playerName}
          score={score}
          highScore={highScore}
          totalPossibleScore={shuffledQuestions.length * 10}
          restartGame={restartGame}
        />
      );
  }
}
