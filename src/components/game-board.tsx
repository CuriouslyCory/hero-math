"use client";

import { motion } from "framer-motion";
import { Shield, Clock, Lightbulb } from "lucide-react";

interface GameBoardProps {
  gridItems: Array<Array<{ type: string; value: number | null }>>;
  heroPosition: { x: number; y: number };
  enemyPositions: Array<{ x: number; y: number; direction: string }>;
  powerUps: {
    timeFreeze: number;
    mathBoost: number;
    shield: number;
  };
}

export default function GameBoard({
  gridItems,
  heroPosition,
  enemyPositions,
  powerUps,
}: GameBoardProps) {
  return (
    <div className="relative mx-auto max-h-[calc(100vh-12rem)] w-full">
      {/* This container maintains the 5:6 aspect ratio */}
      <div className="relative aspect-[4/4]">
        <div className="absolute inset-0 overflow-hidden rounded-lg border-4 border-yellow-500 bg-blue-100 shadow-inner">
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
                      className="flex h-[min(10vw,2.5rem)] w-[min(10vw,2.5rem)] items-center justify-center rounded-full bg-white text-xl font-bold shadow-md"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                        duration: 0.5,
                      }}
                    >
                      {cell.value}
                    </motion.div>
                  )}
                  {cell.type === "obstacle" && (
                    <div className="h-full w-full rounded-md bg-gray-700 shadow-inner"></div>
                  )}
                  {cell.type === "powerup" && cell.value !== null && (
                    <motion.div
                      className={`flex h-[min(10vw,2.5rem)] w-[min(10vw,2.5rem)] items-center justify-center rounded-full shadow-md ${
                        cell.value === 0
                          ? "bg-blue-500"
                          : cell.value === 1
                            ? "bg-yellow-500"
                            : "bg-green-500"
                      }`}
                      initial={{ y: 0 }}
                      animate={{ y: [-5, 5, -5] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 1.5,
                      }}
                    >
                      {cell.value === 0 && (
                        <Clock size={20} className="text-white" />
                      )}
                      {cell.value === 1 && (
                        <Lightbulb size={20} className="text-white" />
                      )}
                      {cell.value === 2 && (
                        <Shield size={20} className="text-white" />
                      )}
                    </motion.div>
                  )}
                </div>
              )),
            )}
          </div>

          {/* Hero character */}
          <motion.div
            className="absolute z-10 h-[min(12vw,3rem)] w-[min(12vw,3rem)]"
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
            <div
              className={`relative h-full w-full ${powerUps.shield > 0 ? "animate-pulse" : ""}`}
            >
              {/* Hero body */}
              <div className="absolute inset-0 rotate-45 transform rounded-md bg-red-600"></div>

              {/* Hero cape */}
              <div
                className="absolute h-8 w-8 rounded-t-full bg-yellow-500"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              ></div>

              {/* Hero head */}
              <div
                className="absolute h-6 w-6 rounded-full bg-[#f5f5dc]"
                style={{
                  top: "25%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Hero mask */}
                <div
                  className="absolute h-2 w-6 rounded-full bg-black"
                  style={{
                    top: "30%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                ></div>
              </div>

              {/* Shield effect */}
              {powerUps.shield > 0 && (
                <div className="absolute inset-0 animate-ping rounded-full border-4 border-green-400 opacity-70"></div>
              )}
            </div>
          </motion.div>

          {/* Enemies */}
          {enemyPositions.map((enemy, index) => (
            <motion.div
              key={index}
              className="absolute z-5 h-[min(10vw,2.5rem)] w-[min(10vw,2.5rem)]"
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
              <div className="flex h-full w-full items-center justify-center rounded-md bg-purple-700">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-900">
                  <div className="h-1 w-4 rounded-full bg-yellow-400"></div>
                </div>
              </div>

              {/* Frozen effect */}
              {powerUps.timeFreeze > 0 && (
                <div className="absolute inset-0 rounded-md bg-blue-200 opacity-50"></div>
              )}
            </motion.div>
          ))}

          {/* Comic book style overlay */}
          <div className="pointer-events-none absolute inset-0 bg-[url('/placeholder.svg?height=600&width=500')] bg-cover opacity-10"></div>
        </div>
      </div>
    </div>
  );
}
