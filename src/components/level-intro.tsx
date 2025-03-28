"use client";

import { Button } from "~/components/ui/button";
import { motion } from "framer-motion";

interface LevelIntroProps {
  level: number;
  ruleType: string;
  target: number;
  secondaryValue?: number;
  onStart: () => void;
}

export default function LevelIntro({
  level,
  ruleType,
  target,
  secondaryValue,
  onStart,
}: LevelIntroProps) {
  // Generate rule explanation based on rule type
  const getRuleExplanation = () => {
    if (ruleType === "addition") {
      return (
        <>
          <h3 className="mb-2 text-xl font-bold">Addition Challenge!</h3>
          <p className="mb-4">
            Collect numbers that add up to exactly{" "}
            <span className="font-bold text-red-600">{target}</span>.
          </p>
          <p className="mb-2 text-sm">
            Be careful not to go over the target sum or you&apos;ll lose a life!
          </p>
        </>
      );
    } else if (ruleType === "subtraction" && secondaryValue) {
      return (
        <>
          <h3 className="mb-2 text-xl font-bold">Subtraction Mission!</h3>
          <p className="mb-4">
            Find the number that makes{" "}
            <span className="font-bold text-red-600">
              {secondaryValue} - ? = {target}
            </span>
          </p>
          <p className="mb-2 text-sm">
            Select the correct number to solve the equation!
          </p>
        </>
      );
    } else if (ruleType === "multiples") {
      return (
        <>
          <h3 className="mb-2 text-xl font-bold">Multiples Mayhem!</h3>
          <p className="mb-4">
            Collect <span className="font-bold text-red-600">3 multiples</span>{" "}
            of <span className="font-bold text-red-600">{target}</span> (12 and
            under).
          </p>
          <p className="mb-2 text-sm">
            Remember, a multiple is a number that can be divided evenly by{" "}
            {target}!
          </p>
        </>
      );
    }
    return null;
  };

  return (
    <div className="flex aspect-[4/4] w-full flex-col items-center justify-center overflow-hidden rounded-lg border-4 border-yellow-500 bg-blue-100 p-6 shadow-inner">
      <motion.div
        className="max-w-md rounded-lg bg-white p-6 text-center shadow-lg"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-4 text-3xl font-extrabold text-blue-600">
          Level {level}
        </div>

        {getRuleExplanation()}

        <div className="mt-4">
          <h4 className="mb-2 font-bold">Power-Ups:</h4>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="rounded bg-blue-100 p-2">
              <div className="font-bold text-blue-600">Time Freeze</div>
              <div>Stops enemies</div>
            </div>
            <div className="rounded bg-yellow-100 p-2">
              <div className="font-bold text-yellow-600">Math Boost</div>
              <div>Highlights answers</div>
            </div>
            <div className="rounded bg-green-100 p-2">
              <div className="font-bold text-green-600">Shield</div>
              <div>Temporary protection</div>
            </div>
          </div>
        </div>

        <Button
          onClick={onStart}
          size="lg"
          className="mt-6 bg-red-600 hover:bg-red-700"
        >
          Start Level
        </Button>
      </motion.div>
    </div>
  );
}
