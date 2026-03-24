import React, { useState, useEffect, useRef, useCallback } from 'react';

type Point = { x: number; y: number };
const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 };
const GAME_SPEED = 100;

const generateFood = (snake: Point[]): Point => {
  let newFood: Point;
  while (true) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    if (!snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)) {
      break;
    }
  }
  return newFood;
};

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 15, y: 5 });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(true);

  const directionRef = useRef(INITIAL_DIRECTION);
  const lastProcessedDirectionRef = useRef(INITIAL_DIRECTION);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    lastProcessedDirectionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const currentDir = directionRef.current;
      lastProcessedDirectionRef.current = currentDir;

      const head = prevSnake[0];
      const newHead = { x: head.x + currentDir.x, y: head.y + currentDir.y };

      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [food, gameOver, isPaused, score, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }

      if (gameOver && e.key === 'Enter') {
        resetGame();
        return;
      }

      const lastDir = lastProcessedDirectionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (lastDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (lastDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (lastDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (lastDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
        case ' ':
          setIsPaused((p) => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    const interval = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(interval);
  }, [moveSnake]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-black border-4 border-[#0ff] box-glitch w-full max-w-[460px]">
      <div className="flex justify-between w-full mb-4 px-2 border-b-4 border-[#f0f] pb-4">
        <div className="flex flex-col items-start">
          <span className="text-[#f0f] text-xl tracking-widest">SEQ_SCORE</span>
          <span className="text-4xl font-bold text-[#0ff]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[#f0f] text-xl tracking-widest">MAX_YIELD</span>
          <span className="text-4xl font-bold text-[#0ff]">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div 
        className="relative bg-black border-4 border-[#0ff] overflow-hidden"
        style={{
          width: GRID_SIZE * 20,
          height: GRID_SIZE * 20,
        }}
      >
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(to right, #0ff 1px, transparent 1px), linear-gradient(to bottom, #0ff 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />

        <div
          className="absolute bg-[#f0f] animate-pulse"
          style={{
            left: food.x * 20,
            top: food.y * 20,
            width: 20,
            height: 20,
          }}
        />

        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute ${isHead ? 'bg-[#fff]' : 'bg-[#0ff]'}`}
              style={{
                left: segment.x * 20,
                top: segment.y * 20,
                width: 20,
                height: 20,
                border: '1px solid #000'
              }}
            />
          );
        })}

        {gameOver && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20">
            <h2 className="text-5xl font-black text-[#f0f] mb-2 glitch" data-text="CRITICAL_FAIL">CRITICAL_FAIL</h2>
            <p className="text-[#0ff] mb-6 text-2xl">YIELD: {score}</p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-black border-4 border-[#0ff] text-[#0ff] hover:bg-[#0ff] hover:text-black transition-colors text-2xl uppercase"
            >
              EXECUTE_REBOOT
            </button>
          </div>
        )}

        {!gameOver && isPaused && (
          <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20">
            <h2 className="text-5xl font-bold text-[#0ff] mb-6 glitch animate-pulse" data-text="SYSTEM_HALT">SYSTEM_HALT</h2>
            <button
              onClick={() => setIsPaused(false)}
              className="px-8 py-4 bg-black border-4 border-[#f0f] text-[#f0f] hover:bg-[#f0f] hover:text-black transition-colors text-2xl uppercase"
            >
              INIT_SEQUENCE
            </button>
            <p className="mt-8 text-[#0ff] text-xl tracking-widest">INPUT: WASD || ARROWS</p>
          </div>
        )}
      </div>

      <div className="mt-6 text-[#f0f] text-xl tracking-widest flex gap-8 w-full justify-between px-2">
        <span>[SPC] HALT</span>
        <span>[ENT] REBOOT</span>
      </div>
    </div>
  );
}
