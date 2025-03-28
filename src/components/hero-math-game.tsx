"use client";

import { useState, useEffect, useReducer, useCallback } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import GameBoard from "../components/game-board";
import GameControls from "../components/game-controls";
import GameStatus from "../components/game-status";
import LevelIntro from "../components/level-intro";
import { Shield, Clock, Lightbulb } from "lucide-react";

// Game rule types
type RuleType = "addition" | "subtraction" | "multiples";

// Cell type for grid items
type Cell = {
  type: "empty" | "number" | "obstacle" | "powerup";
  value: number | null;
};

// Entity position and movement
type Position = {
  x: number;
  y: number;
};

type Direction = "right" | "left" | "up" | "down";

type Enemy = Position & {
  direction: Direction;
};

// Power-ups state
type PowerUps = {
  timeFreeze: number;
  mathBoost: number;
  shield: number;
};

// Game state interface
type GameState = {
  level: number;
  lives: number;
  score: number;
  ruleType: RuleType;
  target: number;
  secondaryValue?: number;
  collected: number[];
  heroPosition: Position;
  gameOver: boolean;
  levelComplete: boolean;
  showLevelIntro: boolean;
  powerUps: PowerUps;
  enemyPositions: Enemy[];
  gridItems: Cell[][];
};

// Action types for reducer
type GameAction =
  | { type: "INITIALIZE_GRID"; payload: Cell[][] }
  | { type: "MOVE_HERO"; payload: Position }
  | { type: "MOVE_ENEMIES" }
  | { type: "COLLECT_ITEM"; payload: { position: Position; value: number } }
  | { type: "USE_POWERUP"; payload: { type: keyof PowerUps; duration: number } }
  | { type: "UPDATE_POWERUPS" }
  | { type: "START_LEVEL" }
  | { type: "COMPLETE_LEVEL" }
  | { type: "NEXT_LEVEL" }
  | { type: "LOSE_LIFE" }
  | { type: "GAME_OVER" }
  | { type: "RESET_GAME" };

// Initial game state
const initialGameState: GameState = {
  level: 1,
  lives: 3,
  score: 0,
  ruleType: "addition",
  target: 10,
  collected: [],
  heroPosition: { x: 2, y: 5 },
  gameOver: false,
  levelComplete: false,
  showLevelIntro: true,
  powerUps: {
    timeFreeze: 0,
    mathBoost: 0,
    shield: 0,
  },
  enemyPositions: [
    { x: 0, y: 0, direction: "right" as Direction },
    { x: 4, y: 2, direction: "left" as Direction },
  ],
  gridItems: [],
};

// Game reducer for handling all state changes
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "INITIALIZE_GRID":
      return {
        ...state,
        gridItems: action.payload,
      };

    case "MOVE_HERO":
      return {
        ...state,
        heroPosition: action.payload,
      };

    case "MOVE_ENEMIES": {
      if (
        state.gameOver ||
        state.levelComplete ||
        state.showLevelIntro ||
        state.powerUps.timeFreeze > 0
      ) {
        return state;
      }

      const newEnemyPositions = state.enemyPositions.map((enemy) => {
        let { x, y, direction } = enemy;

        // Move enemy based on direction
        if (direction === "right") {
          x = x + 1 >= 5 ? 4 : x + 1;
          if (x === 4) direction = "left";
        } else if (direction === "left") {
          x = x - 1 < 0 ? 0 : x - 1;
          if (x === 0) direction = "right";
        } else if (direction === "down") {
          y = y + 1 >= 6 ? 5 : y + 1;
          if (y === 5) direction = "up";
        } else if (direction === "up") {
          y = y - 1 < 0 ? 0 : y - 1;
          if (y === 0) direction = "down";
        }

        return { x, y, direction };
      });

      // Check for collision with hero
      const heroCollision = newEnemyPositions.some(
        (enemy) =>
          enemy.x === state.heroPosition.x && enemy.y === state.heroPosition.y,
      );

      if (heroCollision && state.powerUps.shield <= 0) {
        const newLives = state.lives - 1;
        return {
          ...state,
          enemyPositions: newEnemyPositions,
          lives: newLives,
          gameOver: newLives <= 0,
        };
      }

      return {
        ...state,
        enemyPositions: newEnemyPositions,
      };
    }

    case "COLLECT_ITEM": {
      const { position, value } = action.payload;
      const { x, y } = position;
      const newCollected = [...state.collected, value];

      // Create a properly typed copy of the grid
      const newGridItems = state.gridItems.map((row, rowIdx) =>
        row.map((cell, cellIdx) =>
          rowIdx === y && cellIdx === x
            ? { type: "empty" as const, value: null }
            : cell,
        ),
      );

      // Check if the collected numbers satisfy the rule
      let levelComplete = false;
      let scoreIncrease = 10; // Base score for collecting a number

      if (state.ruleType === "addition") {
        const sum = newCollected.reduce((a, b) => a + b, 0);
        if (sum === state.target) {
          levelComplete = true;
          scoreIncrease = 100; // Bonus for completing level
        } else if (sum > state.target) {
          // Penalty for going over the target
          return {
            ...state,
            lives: state.lives - 1,
            collected: [],
            gameOver: state.lives <= 1,
            score: Math.max(0, state.score - 5),
          };
        }
      } else if (state.ruleType === "subtraction" && state.secondaryValue) {
        // For subtraction, we check if the collected number is the correct answer
        if (value === state.secondaryValue - state.target) {
          levelComplete = true;
          scoreIncrease = 100;
        } else {
          // Penalty for wrong answer
          return {
            ...state,
            lives: state.lives - 1,
            gameOver: state.lives <= 1,
            score: Math.max(0, state.score - 5),
          };
        }
      } else if (state.ruleType === "multiples") {
        // For multiples, check if the collected number is a multiple of the target
        if (value % state.target === 0 && value <= 12) {
          scoreIncrease = 20;
          // Level complete if they've collected 3 correct multiples
          if (newCollected.filter((n) => n % state.target === 0).length >= 3) {
            levelComplete = true;
            scoreIncrease = 100;
          }
        } else {
          // Penalty for wrong multiple
          return {
            ...state,
            lives: state.lives - 1,
            gameOver: state.lives <= 1,
            score: Math.max(0, state.score - 5),
          };
        }
      }

      return {
        ...state,
        collected: newCollected,
        gridItems: newGridItems,
        score: state.score + scoreIncrease,
        levelComplete,
      };
    }

    case "USE_POWERUP": {
      const { type, duration } = action.payload;
      return {
        ...state,
        powerUps: {
          ...state.powerUps,
          [type]: duration,
        },
        score: state.score + 15, // Bonus for using power-up
      };
    }

    case "UPDATE_POWERUPS": {
      return {
        ...state,
        powerUps: {
          timeFreeze: Math.max(0, state.powerUps.timeFreeze - 1),
          mathBoost: Math.max(0, state.powerUps.mathBoost - 1),
          shield: Math.max(0, state.powerUps.shield - 1),
        },
      };
    }

    case "START_LEVEL":
      return {
        ...state,
        showLevelIntro: false,
      };

    case "COMPLETE_LEVEL":
      return {
        ...state,
        levelComplete: true,
      };

    case "NEXT_LEVEL": {
      const newLevel = state.level + 1;
      let newRuleType: RuleType = state.ruleType;
      let newTarget = state.target;
      let newSecondaryValue = state.secondaryValue;

      // Change rule type every 3 levels
      if (newLevel % 3 === 1) {
        newRuleType = "addition";
        newTarget = 10 + Math.floor(newLevel / 3) * 5;
      } else if (newLevel % 3 === 2) {
        newRuleType = "subtraction";
        newSecondaryValue = 15 + Math.floor(newLevel / 3) * 5;
        newTarget = Math.floor(Math.random() * (newSecondaryValue - 5)) + 5;
      } else {
        newRuleType = "multiples";
        newTarget = Math.floor(Math.random() * 6) + 2; // Multiples of 2-7
      }

      return {
        ...state,
        level: newLevel,
        ruleType: newRuleType,
        target: newTarget,
        secondaryValue: newSecondaryValue,
        collected: [],
        heroPosition: { x: 2, y: 5 },
        levelComplete: false,
        showLevelIntro: true,
        enemyPositions: [
          { x: 0, y: 0, direction: "right" as Direction },
          { x: 4, y: 2, direction: "left" as Direction },
          ...(newLevel > 2
            ? [{ x: 2, y: 1, direction: "down" as Direction }]
            : []),
        ],
        gridItems: [],
      };
    }

    case "LOSE_LIFE":
      return {
        ...state,
        lives: state.lives - 1,
        gameOver: state.lives - 1 <= 0,
      };

    case "GAME_OVER":
      return {
        ...state,
        gameOver: true,
      };

    case "RESET_GAME":
      return initialGameState;

    default:
      return state;
  }
}

export default function HeroMathGame() {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

  // Initialize grid items based on level and rule type
  const initializeGrid = useCallback(() => {
    const grid: Cell[][] = [];
    const { level, ruleType } = gameState;

    // Create a 5x6 grid
    for (let y = 0; y < 6; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < 5; x++) {
        // Default to empty cell
        let cellType: Cell["type"] = "empty";
        let cellValue: number | null = null;

        // Randomly place numbers based on rule type
        if (Math.random() > 0.4) {
          cellType = "number";

          if (ruleType === "addition") {
            // For addition, place numbers 1-9
            cellValue = Math.floor(Math.random() * 9) + 1;
          } else if (ruleType === "subtraction") {
            // For subtraction, place numbers that could be valid answers
            const max = gameState.secondaryValue ?? 15;
            cellValue = Math.floor(Math.random() * max) + 1;
          } else if (ruleType === "multiples") {
            // For multiples, place numbers 1-12
            cellValue = Math.floor(Math.random() * 12) + 1;
          }
        }
        // Randomly place obstacles
        else if (Math.random() > 0.7) {
          cellType = "obstacle";
        }
        // Randomly place power-ups (more common in higher levels)
        else if (Math.random() > 0.9 - level * 0.05) {
          cellType = "powerup";
          // 0 = timeFreeze, 1 = mathBoost, 2 = shield
          cellValue = Math.floor(Math.random() * 3);
        }

        row.push({ type: cellType, value: cellValue });
      }
      grid.push(row);
    }

    // Ensure the hero's starting position is empty
    const heroY = gameState.heroPosition.y;
    const heroX = gameState.heroPosition.x;
    if (heroY < grid.length && heroX < (grid[heroY]?.length ?? 0)) {
      if (grid[heroY]) {
        grid[heroY][heroX] = { type: "empty", value: null };
      }
    }

    return grid;
  }, [
    gameState.level,
    gameState.ruleType,
    gameState.secondaryValue,
    gameState.heroPosition,
  ]);

  // Initialize the game
  useEffect(() => {
    if (gameState.gridItems.length === 0) {
      const newGrid = initializeGrid();
      dispatch({ type: "INITIALIZE_GRID", payload: newGrid });
    }
  }, [gameState.gridItems.length, initializeGrid]);

  // Handle level progression
  useEffect(() => {
    if (gameState.levelComplete) {
      const timer = setTimeout(() => {
        dispatch({ type: "NEXT_LEVEL" });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [gameState.levelComplete]);

  // Move enemies
  useEffect(() => {
    if (
      gameState.gameOver ||
      gameState.levelComplete ||
      gameState.showLevelIntro ||
      gameState.powerUps.timeFreeze > 0
    ) {
      return;
    }

    const enemyMovementInterval = setInterval(() => {
      dispatch({ type: "MOVE_ENEMIES" });
    }, 1000); // Move enemies every second

    return () => clearInterval(enemyMovementInterval);
  }, [
    gameState.gameOver,
    gameState.levelComplete,
    gameState.showLevelIntro,
    gameState.powerUps.timeFreeze,
  ]);

  // Update power-ups duration
  useEffect(() => {
    if (
      gameState.powerUps.timeFreeze > 0 ||
      gameState.powerUps.mathBoost > 0 ||
      gameState.powerUps.shield > 0
    ) {
      const powerUpInterval = setInterval(() => {
        dispatch({ type: "UPDATE_POWERUPS" });
      }, 1000);

      return () => clearInterval(powerUpInterval);
    }
  }, [gameState.powerUps]);

  // Handle keyboard input for hero movement
  useEffect(() => {
    if (
      gameState.gameOver ||
      gameState.levelComplete ||
      gameState.showLevelIntro
    ) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      const { x, y } = gameState.heroPosition;
      let newX = x;
      let newY = y;
      let collectItem = false;

      // Move hero based on key press
      if ((e.key === "ArrowUp" || e.key === "w" || e.key === "W") && y > 0) {
        newY -= 1;
      } else if (
        (e.key === "ArrowDown" || e.key === "s" || e.key === "S") &&
        y < 5
      ) {
        newY += 1;
      } else if (
        (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") &&
        x > 0
      ) {
        newX -= 1;
      } else if (
        (e.key === "ArrowRight" || e.key === "d" || e.key === "D") &&
        x < 4
      ) {
        newX += 1;
      } else if (e.key === " ") {
        // Space bar to collect item
        collectItem = true;
      }

      // Update hero position
      if (newX !== x || newY !== y) {
        // Check for enemy collision
        const enemyCollision = gameState.enemyPositions.some(
          (enemy) => enemy.x === newX && enemy.y === newY,
        );

        if (enemyCollision && gameState.powerUps.shield <= 0) {
          dispatch({ type: "LOSE_LIFE" });
          return;
        }

        // Check for obstacle collision
        const cell = gameState.gridItems[newY]?.[newX];
        if (cell?.type === "obstacle") {
          // Can't move into obstacles
          return;
        }

        dispatch({ type: "MOVE_HERO", payload: { x: newX, y: newY } });
      }

      // Handle item collection
      if (collectItem) {
        const cell = gameState.gridItems[y]?.[x];

        if (!cell) return;

        if (cell.type === "number" && cell.value !== null) {
          dispatch({
            type: "COLLECT_ITEM",
            payload: {
              position: { x, y },
              value: cell.value,
            },
          });
        } else if (cell.type === "powerup" && cell.value !== null) {
          // Handle power-up collection
          let powerUpType: keyof PowerUps;
          let duration: number;

          if (cell.value === 0) {
            powerUpType = "timeFreeze";
            duration = 10;
          } else if (cell.value === 1) {
            powerUpType = "mathBoost";
            duration = 15;
          } else {
            powerUpType = "shield";
            duration = 8;
          }

          // First update the grid to remove the power-up
          const newGridItems = [...gameState.gridItems];
          if (newGridItems[y]?.[x]) {
            newGridItems[y][x] = { type: "empty", value: null };
            dispatch({ type: "INITIALIZE_GRID", payload: newGridItems });

            // Then activate the power-up
            dispatch({
              type: "USE_POWERUP",
              payload: { type: powerUpType, duration },
            });
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  // Start a new game
  const startNewGame = () => {
    dispatch({ type: "RESET_GAME" });
  };

  // Start the level after intro
  const startLevel = () => {
    const newGrid = initializeGrid();
    dispatch({ type: "INITIALIZE_GRID", payload: newGrid });
    dispatch({ type: "START_LEVEL" });
  };

  // Render game UI
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-2">
      <Card className="w-full max-w-3xl overflow-hidden rounded-xl bg-white/90 p-3 shadow-xl">
        {/* Game status bar */}
        <GameStatus
          level={gameState.level}
          lives={gameState.lives}
          score={gameState.score}
          ruleType={gameState.ruleType}
          target={gameState.target}
          secondaryValue={gameState.secondaryValue}
          collected={gameState.collected}
        />

        {/* Power-ups display */}
        <div className="mb-2 flex justify-center gap-4">
          <div
            className={`flex items-center gap-1 ${gameState.powerUps.timeFreeze > 0 ? "font-bold text-blue-600" : "text-gray-400"}`}
          >
            <Clock size={20} />
            <span>
              {gameState.powerUps.timeFreeze > 0
                ? gameState.powerUps.timeFreeze
                : ""}
            </span>
          </div>
          <div
            className={`flex items-center gap-1 ${gameState.powerUps.mathBoost > 0 ? "font-bold text-yellow-600" : "text-gray-400"}`}
          >
            <Lightbulb size={20} />
            <span>
              {gameState.powerUps.mathBoost > 0
                ? gameState.powerUps.mathBoost
                : ""}
            </span>
          </div>
          <div
            className={`flex items-center gap-1 ${gameState.powerUps.shield > 0 ? "font-bold text-green-600" : "text-gray-400"}`}
          >
            <Shield size={20} />
            <span>
              {gameState.powerUps.shield > 0 ? gameState.powerUps.shield : ""}
            </span>
          </div>
        </div>

        {/* Game board */}
        {gameState.showLevelIntro ? (
          <LevelIntro
            level={gameState.level}
            ruleType={gameState.ruleType}
            target={gameState.target}
            secondaryValue={gameState.secondaryValue}
            onStart={startLevel}
          />
        ) : (
          <GameBoard
            gridItems={gameState.gridItems}
            heroPosition={gameState.heroPosition}
            enemyPositions={gameState.enemyPositions}
            powerUps={gameState.powerUps}
          />
        )}

        {/* Game over or level complete overlay */}
        {(gameState.gameOver || gameState.levelComplete) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 p-4 text-white">
            {gameState.gameOver ? (
              <>
                <h2 className="mb-4 text-4xl font-bold">Game Over!</h2>
                <p className="mb-6 text-xl">Final Score: {gameState.score}</p>
                <Button
                  onClick={startNewGame}
                  size="lg"
                  className="bg-red-600 hover:bg-red-700"
                >
                  Play Again
                </Button>
              </>
            ) : (
              <>
                <h2 className="mb-4 text-4xl font-bold">Level Complete!</h2>
                <p className="mb-6 text-xl">Score: {gameState.score}</p>
              </>
            )}
          </div>
        )}
      </Card>

      {/* Game controls */}
      <GameControls />
    </div>
  );
}
