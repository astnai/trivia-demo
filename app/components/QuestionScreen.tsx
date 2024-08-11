import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface QuestionProps {
  question: string;
  answers: string[];
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  showFeedback: boolean;
  timeRemaining: number;
  showHint: boolean;
  correctAnswer: number;
  score: number;
  streakCount: number;
  handleAnswer: (index: number) => void;
  handleNextQuestion: () => void;
  showHintHandler: () => void;
}

export function QuestionScreen({
  question,
  answers,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  showFeedback,
  timeRemaining,
  showHint,
  correctAnswer,
  score,
  streakCount,
  handleAnswer,
  handleNextQuestion,
  showHintHandler,
}: QuestionProps) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Trivia Challenge</CardTitle>
        <CardDescription>
          Pregunta {currentQuestion + 1} de {totalQuestions}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress
          value={((currentQuestion + 1) / totalQuestions) * 100}
          className="mb-4"
        />
        <div className="flex justify-between items-center mb-4">
          <p className="font-semibold">{question}</p>
          <div className="flex items-center">
            <Clock className="mr-1" size={16} />
            <span
              className={`font-bold ${
                timeRemaining <= 5 ? "text-red-500" : ""
              }`}
            >
              {timeRemaining}s
            </span>
          </div>
        </div>
        <RadioGroup
          onValueChange={(value) => handleAnswer(parseInt(value))}
          value={selectedAnswer?.toString()}
        >
          {answers.map((answer, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem
                value={index.toString()}
                id={`answer-${index}`}
                disabled={showFeedback}
              />
              <Label
                htmlFor={`answer-${index}`}
                className={`flex items-center ${
                  showFeedback && index === correctAnswer
                    ? "text-green-600"
                    : showFeedback &&
                      index === selectedAnswer &&
                      index !== correctAnswer
                    ? "text-red-600"
                    : ""
                }`}
              >
                {answer}
                {showFeedback && index === correctAnswer && (
                  <CheckCircle className="ml-2 h-4 w-4 text-green-600" />
                )}
                {showFeedback &&
                  index === selectedAnswer &&
                  index !== correctAnswer && (
                    <XCircle className="ml-2 h-4 w-4 text-red-600" />
                  )}
              </Label>
            </div>
          ))}
        </RadioGroup>
        {showHint && (
          <Alert className="mt-4">
            <AlertTitle>Pista</AlertTitle>
            <AlertDescription>
              La respuesta correcta comienza con la letra "
              {answers[correctAnswer][0]}".
            </AlertDescription>
          </Alert>
        )}
        <div className="mt-4 flex justify-between items-center">
          <p>Puntuación: {score}</p>
          <p
            className={`font-bold ${streakCount >= 3 ? "text-green-500" : ""}`}
          >
            Racha: {streakCount} {streakCount >= 3 ? "🔥" : ""}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button
          onClick={handleNextQuestion}
          disabled={!showFeedback}
          className="w-full"
        >
          {currentQuestion === totalQuestions - 1
            ? "Finalizar"
            : "Siguiente pregunta"}
        </Button>
        {!showFeedback && !showHint && (
          <Button
            onClick={showHintHandler}
            variant="outline"
            className="w-full"
          >
            Mostrar pista (-5 segundos)
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
