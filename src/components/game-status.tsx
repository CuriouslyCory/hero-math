import { Card } from "~/components/ui/card"

interface GameStatusProps {
  level: number
  lives: number
  score: number
  ruleType: string
  target: number
  secondaryValue?: number
  collected: number[]
}

export default function GameStatus({
  level,
  lives,
  score,
  ruleType,
  target,
  secondaryValue,
  collected,
}: GameStatusProps) {
  // Generate rule text based on rule type
  const getRuleText = () => {
    if (ruleType === "addition") {
      return `Collect numbers that add up to ${target}`
    } else if (ruleType === "subtraction" && secondaryValue) {
      return `Find the number that makes ${secondaryValue} - ? = ${target}`
    } else if (ruleType === "multiples") {
      return `Collect 3 multiples of ${target} (12 and under)`
    }
    return ""
  }

  // Calculate progress based on rule type
  const getProgress = () => {
    if (ruleType === "addition") {
      const sum = collected.reduce((a, b) => a + b, 0)
      return `Sum: ${sum} / ${target}`
    } else if (ruleType === "subtraction") {
      return collected.length > 0 ? `Selected: ${collected[0]}` : "Select a number"
    } else if (ruleType === "multiples") {
      const validMultiples = collected.filter((n) => n % target === 0)
      return `Multiples: ${validMultiples.length} / 3`
    }
    return ""
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">Level: {level}</span>
          <div className="flex">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`w-5 h-5 mx-0.5 rounded-full ${i < lives ? "bg-red-500" : "bg-gray-300"}`}></div>
            ))}
          </div>
        </div>
        <span className="text-lg font-bold">Score: {score}</span>
      </div>

      <Card className="p-3 bg-yellow-100 border-2 border-yellow-500 relative overflow-hidden">
        {/* Comic speech bubble style */}
        <div className="absolute -top-3 -left-3 w-6 h-6 bg-yellow-100 transform rotate-45 border-2 border-yellow-500"></div>

        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-center mb-1">{getRuleText()}</h3>
          <p className="text-center text-sm">{getProgress()}</p>
        </div>
      </Card>
    </div>
  )
}

