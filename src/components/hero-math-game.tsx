"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "~/components/ui/button"
import { Card } from "~/components/ui/card"
import GameBoard from "../components/game-board"
import GameControls from "../components/game-controls"
import GameStatus from "../components/game-status"
import LevelIntro from "../components/level-intro"
import { Shield, Clock, Lightbulb } from "lucide-react"

// Game rule types
type RuleType = "addition" | "subtraction" | "multiples"

// Game state interface
interface GameState {
  level: number
  lives: number
  score: number
  ruleType: RuleType
  target: number
  secondaryValue?: number
  collected: number[]
  heroPosition: { x: number; y: number }
  gameOver: boolean
  levelComplete: boolean
  showLevelIntro: boolean
  powerUps: {
    timeFreeze: number
    mathBoost: number
    shield: number
  }
  enemyPositions: Array<{ x: number; y: number; direction: string }>
  gridItems: Array<Array<{ type: string; value: number | null }>>
}

export default function HeroMathGame() {
  const [gameState, setGameState] = useState<GameState>({
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
      { x: 0, y: 0, direction: "right" },
      { x: 4, y: 2, direction: "left" },
    ],
    gridItems: [],
  })

  // Initialize grid items based on level and rule type
  const initializeGrid = useCallback(() => {
    const grid = []
    const { level, ruleType } = gameState

    // Create a 5x6 grid
    for (let y = 0; y < 6; y++) {
      const row = []
      for (let x = 0; x < 5; x++) {
        // Default to empty cell
        let cellType = "empty"
        let cellValue = null

        // Randomly place numbers based on rule type
        if (Math.random() > 0.4) {
          cellType = "number"

          if (ruleType === "addition") {
            // For addition, place numbers 1-9
            cellValue = Math.floor(Math.random() * 9) + 1
          } else if (ruleType === "subtraction") {
            // For subtraction, place numbers that could be valid answers
            const max = gameState.secondaryValue || 15
            cellValue = Math.floor(Math.random() * max) + 1
          } else if (ruleType === "multiples") {
            // For multiples, place numbers 1-12
            cellValue = Math.floor(Math.random() * 12) + 1
          }
        }
        // Randomly place obstacles
        else if (Math.random() > 0.7) {
          cellType = "obstacle"
        }
        // Randomly place power-ups (more common in higher levels)
        else if (Math.random() > 0.9 - level * 0.05) {
          cellType = "powerup"
          // 0 = timeFreeze, 1 = mathBoost, 2 = shield
          cellValue = Math.floor(Math.random() * 3)
        }

        row.push({ type: cellType, value: cellValue })
      }
      grid.push(row)
    }

    // Ensure the hero's starting position is empty
    const heroY = gameState.heroPosition.y
    const heroX = gameState.heroPosition.x
    if (heroY < grid.length && heroX < grid[0].length) {
      grid[heroY][heroX] = { type: "empty", value: null }
    }

    return grid
  }, [gameState.level, gameState.ruleType, gameState.secondaryValue, gameState.heroPosition])

  // Initialize the game
  useEffect(() => {
    if (gameState.gridItems.length === 0) {
      setGameState((prev) => ({
        ...prev,
        gridItems: initializeGrid(),
      }))
    }
  }, [gameState.gridItems.length, initializeGrid])

  // Handle level progression
  useEffect(() => {
    if (gameState.levelComplete) {
      const timer = setTimeout(() => {
        const newLevel = gameState.level + 1
        let newRuleType: RuleType = gameState.ruleType
        let newTarget = gameState.target
        let newSecondaryValue = gameState.secondaryValue

        // Change rule type every 3 levels
        if (newLevel % 3 === 1) {
          newRuleType = "addition"
          newTarget = 10 + Math.floor(newLevel / 3) * 5
        } else if (newLevel % 3 === 2) {
          newRuleType = "subtraction"
          newSecondaryValue = 15 + Math.floor(newLevel / 3) * 5
          newTarget = Math.floor(Math.random() * (newSecondaryValue - 5)) + 5
        } else {
          newRuleType = "multiples"
          newTarget = Math.floor(Math.random() * 6) + 2 // Multiples of 2-7
        }

        setGameState((prev) => ({
          ...prev,
          level: newLevel,
          ruleType: newRuleType,
          target: newTarget,
          secondaryValue: newSecondaryValue,
          collected: [],
          heroPosition: { x: 2, y: 5 },
          levelComplete: false,
          showLevelIntro: true,
          enemyPositions: [
            { x: 0, y: 0, direction: "right" },
            { x: 4, y: 2, direction: "left" },
            ...(newLevel > 2 ? [{ x: 2, y: 1, direction: "down" }] : []),
          ],
          gridItems: [],
        }))
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [gameState.levelComplete, gameState.level, gameState.ruleType, gameState.target, gameState.secondaryValue])

  // Move enemies
  useEffect(() => {
    if (
      gameState.gameOver ||
      gameState.levelComplete ||
      gameState.showLevelIntro ||
      gameState.powerUps.timeFreeze > 0
    ) {
      return
    }

    const enemyMovementInterval = setInterval(() => {
      setGameState((prev) => {
        const newEnemyPositions = prev.enemyPositions.map((enemy) => {
          let { x, y, direction } = enemy

          // Move enemy based on direction
          if (direction === "right") {
            x = x + 1 >= 5 ? 4 : x + 1
            if (x === 4) direction = "left"
          } else if (direction === "left") {
            x = x - 1 < 0 ? 0 : x - 1
            if (x === 0) direction = "right"
          } else if (direction === "down") {
            y = y + 1 >= 6 ? 5 : y + 1
            if (y === 5) direction = "up"
          } else if (direction === "up") {
            y = y - 1 < 0 ? 0 : y - 1
            if (y === 0) direction = "down"
          }

          return { x, y, direction }
        })

        // Check for collision with hero
        const heroCollision = newEnemyPositions.some(
          (enemy) => enemy.x === prev.heroPosition.x && enemy.y === prev.heroPosition.y,
        )

        if (heroCollision && prev.powerUps.shield <= 0) {
          const newLives = prev.lives - 1
          return {
            ...prev,
            enemyPositions: newEnemyPositions,
            lives: newLives,
            gameOver: newLives <= 0,
          }
        }

        return {
          ...prev,
          enemyPositions: newEnemyPositions,
        }
      })
    }, 1000) // Move enemies every second

    return () => clearInterval(enemyMovementInterval)
  }, [gameState.gameOver, gameState.levelComplete, gameState.showLevelIntro, gameState.powerUps.timeFreeze])

  // Update power-ups duration
  useEffect(() => {
    if (gameState.powerUps.timeFreeze > 0 || gameState.powerUps.mathBoost > 0 || gameState.powerUps.shield > 0) {
      const powerUpInterval = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          powerUps: {
            timeFreeze: Math.max(0, prev.powerUps.timeFreeze - 1),
            mathBoost: Math.max(0, prev.powerUps.mathBoost - 1),
            shield: Math.max(0, prev.powerUps.shield - 1),
          },
        }))
      }, 1000)

      return () => clearInterval(powerUpInterval)
    }
  }, [gameState.powerUps])

  // Handle keyboard input for hero movement
  useEffect(() => {
    if (gameState.gameOver || gameState.levelComplete || gameState.showLevelIntro) {
      return
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault()

      setGameState((prev) => {
        let { x, y } = prev.heroPosition
        let collectItem = false

        // Move hero based on key press
        if ((e.key === "ArrowUp" || e.key === "w" || e.key === "W") && y > 0) {
          y -= 1
        } else if ((e.key === "ArrowDown" || e.key === "s" || e.key === "S") && y < 5) {
          y += 1
        } else if ((e.key === "ArrowLeft" || e.key === "a" || e.key === "A") && x > 0) {
          x -= 1
        } else if ((e.key === "ArrowRight" || e.key === "d" || e.key === "D") && x < 4) {
          x += 1
        } else if (e.key === " ") {
          // Space bar to collect item
          collectItem = true
        }

        // Check for enemy collision
        const enemyCollision = prev.enemyPositions.some((enemy) => enemy.x === x && enemy.y === y)

        if (enemyCollision && prev.powerUps.shield <= 0) {
          const newLives = prev.lives - 1
          return {
            ...prev,
            lives: newLives,
            gameOver: newLives <= 0,
          }
        }

        // Handle item collection
        if (collectItem && prev.gridItems[y] && prev.gridItems[y][x]) {
          const cell = prev.gridItems[y][x]

          if (cell.type === "number" && cell.value !== null) {
            const newCollected = [...prev.collected, cell.value]
            const newGridItems = [...prev.gridItems]
            newGridItems[y][x] = { type: "empty", value: null }

            // Check if the collected numbers satisfy the rule
            let levelComplete = false
            let scoreIncrease = 10 // Base score for collecting a number

            if (prev.ruleType === "addition") {
              const sum = newCollected.reduce((a, b) => a + b, 0)
              if (sum === prev.target) {
                levelComplete = true
                scoreIncrease = 100 // Bonus for completing level
              } else if (sum > prev.target) {
                // Penalty for going over the target
                return {
                  ...prev,
                  lives: prev.lives - 1,
                  collected: [],
                  gameOver: prev.lives <= 1,
                  score: Math.max(0, prev.score - 5),
                  gridItems: initializeGrid(),
                }
              }
            } else if (prev.ruleType === "subtraction" && prev.secondaryValue) {
              // For subtraction, we check if the collected number is the correct answer
              if (cell.value === prev.secondaryValue - prev.target) {
                levelComplete = true
                scoreIncrease = 100
              } else {
                // Penalty for wrong answer
                return {
                  ...prev,
                  lives: prev.lives - 1,
                  gameOver: prev.lives <= 1,
                  score: Math.max(0, prev.score - 5),
                }
              }
            } else if (prev.ruleType === "multiples") {
              // For multiples, check if the collected number is a multiple of the target
              if (cell.value % prev.target === 0 && cell.value <= 12) {
                scoreIncrease = 20
                // Level complete if they've collected 3 correct multiples
                if (newCollected.filter((n) => n % prev.target === 0).length >= 3) {
                  levelComplete = true
                  scoreIncrease = 100
                }
              } else {
                // Penalty for wrong multiple
                return {
                  ...prev,
                  lives: prev.lives - 1,
                  gameOver: prev.lives <= 1,
                  score: Math.max(0, prev.score - 5),
                }
              }
            }

            return {
              ...prev,
              heroPosition: { x, y },
              collected: newCollected,
              gridItems: newGridItems,
              score: prev.score + scoreIncrease,
              levelComplete,
            }
          } else if (cell.type === "powerup" && cell.value !== null) {
            const newGridItems = [...prev.gridItems]
            newGridItems[y][x] = { type: "empty", value: null }

            const newPowerUps = { ...prev.powerUps }
            if (cell.value === 0) {
              newPowerUps.timeFreeze = 10 // 10 seconds of time freeze
            } else if (cell.value === 1) {
              newPowerUps.mathBoost = 15 // 15 seconds of math boost
            } else if (cell.value === 2) {
              newPowerUps.shield = 8 // 8 seconds of shield
            }

            return {
              ...prev,
              heroPosition: { x, y },
              gridItems: newGridItems,
              powerUps: newPowerUps,
              score: prev.score + 15, // Bonus for collecting power-up
            }
          } else if (cell.type === "obstacle") {
            // Can't move into obstacles
            return prev
          }
        }

        return {
          ...prev,
          heroPosition: { x, y },
        }
      })
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [gameState.gameOver, gameState.levelComplete, gameState.showLevelIntro, initializeGrid])

  // Start a new game
  const startNewGame = () => {
    setGameState({
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
        { x: 0, y: 0, direction: "right" },
        { x: 4, y: 2, direction: "left" },
      ],
      gridItems: [],
    })
  }

  // Start the level after intro
  const startLevel = () => {
    setGameState((prev) => ({
      ...prev,
      showLevelIntro: false,
      gridItems: initializeGrid(),
    }))
  }

  // Render game UI
  return (
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-4xl p-4 bg-white/90 shadow-xl rounded-xl overflow-hidden">
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
        <div className="flex justify-center gap-4 mb-4">
          <div
            className={`flex items-center gap-1 ${gameState.powerUps.timeFreeze > 0 ? "text-blue-600 font-bold" : "text-gray-400"}`}
          >
            <Clock size={20} />
            <span>{gameState.powerUps.timeFreeze > 0 ? gameState.powerUps.timeFreeze : ""}</span>
          </div>
          <div
            className={`flex items-center gap-1 ${gameState.powerUps.mathBoost > 0 ? "text-yellow-600 font-bold" : "text-gray-400"}`}
          >
            <Lightbulb size={20} />
            <span>{gameState.powerUps.mathBoost > 0 ? gameState.powerUps.mathBoost : ""}</span>
          </div>
          <div
            className={`flex items-center gap-1 ${gameState.powerUps.shield > 0 ? "text-green-600 font-bold" : "text-gray-400"}`}
          >
            <Shield size={20} />
            <span>{gameState.powerUps.shield > 0 ? gameState.powerUps.shield : ""}</span>
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
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white p-4">
            {gameState.gameOver ? (
              <>
                <h2 className="text-4xl font-bold mb-4">Game Over!</h2>
                <p className="text-xl mb-6">Final Score: {gameState.score}</p>
                <Button onClick={startNewGame} size="lg" className="bg-red-600 hover:bg-red-700">
                  Play Again
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-4xl font-bold mb-4">Level Complete!</h2>
                <p className="text-xl mb-6">Score: {gameState.score}</p>
              </>
            )}
          </div>
        )}
      </Card>

      {/* Game controls */}
      <GameControls />
    </div>
  )
}

