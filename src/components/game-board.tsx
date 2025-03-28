"use client"

import { motion } from "framer-motion"
import { Shield, Clock, Lightbulb } from "lucide-react"

interface GameBoardProps {
  gridItems: Array<Array<{ type: string; value: number | null }>>
  heroPosition: { x: number; y: number }
  enemyPositions: Array<{ x: number; y: number; direction: string }>
  powerUps: {
    timeFreeze: number
    mathBoost: number
    shield: number
  }
}

export default function GameBoard({ gridItems, heroPosition, enemyPositions, powerUps }: GameBoardProps) {
  return (
    <div className="relative w-full aspect-[5/6] bg-blue-100 rounded-lg overflow-hidden border-4 border-yellow-500 shadow-inner">
      {/* Comic book style background */}
      <div className="absolute inset-0 grid grid-cols-5 grid-rows-6 gap-1 p-1">
        {gridItems.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              className={`relative flex items-center justify-center rounded ${
                (x + y) % 2 === 0 ? "bg-blue-50/80" : "bg-blue-100/80"
              }`}
            >
              {cell.type === "number" && cell.value !== null && (
                <motion.div
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl font-bold shadow-md"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", duration: 0.5 }}
                >
                  {cell.value}
                </motion.div>
              )}
              {cell.type === "obstacle" && <div className="w-full h-full bg-gray-700 rounded-md shadow-inner"></div>}
              {cell.type === "powerup" && cell.value !== null && (
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                    cell.value === 0 ? "bg-blue-500" : cell.value === 1 ? "bg-yellow-500" : "bg-green-500"
                  }`}
                  initial={{ y: 0 }}
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
                >
                  {cell.value === 0 && <Clock size={20} className="text-white" />}
                  {cell.value === 1 && <Lightbulb size={20} className="text-white" />}
                  {cell.value === 2 && <Shield size={20} className="text-white" />}
                </motion.div>
              )}
            </div>
          )),
        )}
      </div>

      {/* Hero character */}
      <motion.div
        className="absolute w-12 h-12 z-10"
        style={{
          left: `calc(${heroPosition.x * 20}% + 4%)`,
          top: `calc(${heroPosition.y * 16.66}% + 2.5%)`,
        }}
        initial={{ scale: 1 }}
        animate={{
          scale: [1, 1.05, 1],
          rotate: powerUps.shield > 0 ? [0, 10, 0, -10, 0] : 0,
        }}
        transition={{
          duration: 0.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      >
        <div className={`relative w-full h-full ${powerUps.shield > 0 ? "animate-pulse" : ""}`}>
          {/* Hero body */}
          <div className="absolute inset-0 bg-red-600 rounded-md transform rotate-45"></div>

          {/* Hero cape */}
          <div
            className="absolute w-8 h-8 bg-yellow-500 rounded-t-full"
            style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
          ></div>

          {/* Hero head */}
          <div
            className="absolute w-6 h-6 bg-[#f5f5dc] rounded-full"
            style={{ top: "25%", left: "50%", transform: "translate(-50%, -50%)" }}
          >
            {/* Hero mask */}
            <div
              className="absolute w-6 h-2 bg-black rounded-full"
              style={{ top: "30%", left: "50%", transform: "translate(-50%, -50%)" }}
            ></div>
          </div>

          {/* Shield effect */}
          {powerUps.shield > 0 && (
            <div className="absolute inset-0 rounded-full border-4 border-green-400 animate-ping opacity-70"></div>
          )}
        </div>
      </motion.div>

      {/* Enemies */}
      {enemyPositions.map((enemy, index) => (
        <motion.div
          key={index}
          className="absolute w-10 h-10 z-5"
          style={{
            left: `calc(${enemy.x * 20}% + 5%)`,
            top: `calc(${enemy.y * 16.66}% + 3.3%)`,
          }}
          initial={{ scale: 1 }}
          animate={{
            scale: powerUps.timeFreeze > 0 ? 1 : [1, 1.1, 1],
            rotate: powerUps.timeFreeze > 0 ? 0 : [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: 0.8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          {/* Enemy body */}
          <div className="w-full h-full bg-purple-700 rounded-md flex items-center justify-center">
            <div className="w-6 h-6 bg-purple-900 rounded-full flex items-center justify-center">
              <div className="w-4 h-1 bg-yellow-400 rounded-full"></div>
            </div>
          </div>

          {/* Frozen effect */}
          {powerUps.timeFreeze > 0 && <div className="absolute inset-0 bg-blue-200 rounded-md opacity-50"></div>}
        </motion.div>
      ))}

      {/* Comic book style overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[url('/placeholder.svg?height=600&width=500')] bg-cover opacity-10"></div>
    </div>
  )
}

