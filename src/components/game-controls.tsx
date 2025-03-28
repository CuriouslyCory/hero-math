import { Card } from "~/components/ui/card"
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Space } from "lucide-react"

export default function GameControls() {
  return (
    <Card className="p-4 mt-4 bg-gray-100 max-w-md">
      <h3 className="text-lg font-bold mb-2 text-center">Controls</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="font-medium mb-1">Movement:</p>
          <div className="flex items-center gap-1 mb-1">
            <ArrowUp size={16} /> <span>/ W - Move Up</span>
          </div>
          <div className="flex items-center gap-1 mb-1">
            <ArrowDown size={16} /> <span>/ S - Move Down</span>
          </div>
          <div className="flex items-center gap-1 mb-1">
            <ArrowLeft size={16} /> <span>/ A - Move Left</span>
          </div>
          <div className="flex items-center gap-1 mb-1">
            <ArrowRight size={16} /> <span>/ D - Move Right</span>
          </div>
        </div>
        <div>
          <p className="font-medium mb-1">Actions:</p>
          <div className="flex items-center gap-1 mb-1">
            <Space size={16} /> <span>Space - Collect Item</span>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Collect the correct numbers to solve the math challenge and advance to the next level!
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}

