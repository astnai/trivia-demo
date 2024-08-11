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
import { Trophy } from "lucide-react";

interface GameOverProps {
  playerName: string;
  score: number;
  highScore: number;
  totalPossibleScore: number;
  restartGame: () => void;
}

export function GameOverScreen({
  playerName,
  score,
  highScore,
  totalPossibleScore,
  restartGame,
}: GameOverProps) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>¡Juego terminado, {playerName}!</CardTitle>
        <CardDescription>Tu puntuación final:</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <Trophy className="text-yellow-500 mr-2" size={32} />
          <p className="text-4xl font-bold text-center">{score}</p>
        </div>
        <p className="text-center mt-2">
          de {totalPossibleScore} puntos posibles
        </p>
        {score === highScore && (
          <p className="text-center mt-2 text-green-500">¡Nuevo récord!</p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={restartGame} className="w-full">
          Jugar de nuevo
        </Button>
      </CardFooter>
    </Card>
  );
}
