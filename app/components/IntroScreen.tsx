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
import { Input } from "@/components/ui/input";
import { Brain } from "lucide-react";

interface IntroProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  highScore: number;
  startGame: () => void;
}

export function IntroScreen({
  playerName,
  setPlayerName,
  highScore,
  startGame,
}: IntroProps) {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-center">
          <Brain className="mr-2" /> Trivia Challenge
        </CardTitle>
        <CardDescription>¡Pon a prueba tus conocimientos!</CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          type="text"
          placeholder="Ingresa tu nombre"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="mb-4"
        />
        <p className="text-sm text-gray-500 mb-2">
          Puntuación más alta: {highScore}
        </p>
        <ul className="list-disc list-inside text-sm">
          <li>Responde rápido para ganar más puntos</li>
          <li>Responde bien para ganar puntos</li>
          <li>Usa pistas si necesitas ayuda</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          onClick={startGame}
          className="w-full"
          disabled={!playerName.trim()}
        >
          Comenzar juego
        </Button>
      </CardFooter>
    </Card>
  );
}
