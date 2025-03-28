import { Card } from "~/components/ui/card";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Space } from "lucide-react";

export default function GameControls() {
  return (
    <Card className="mt-4 max-w-md bg-gray-100 p-4">
      <h3 className="mb-2 text-center text-lg font-bold">Controls</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="mb-1 font-medium">Movement:</p>
          <div className="mb-1 flex items-center gap-1">
            <ArrowUp size={16} /> <span>/ W - Move Up</span>
          </div>
          <div className="mb-1 flex items-center gap-1">
            <ArrowDown size={16} /> <span>/ S - Move Down</span>
          </div>
          <div className="mb-1 flex items-center gap-1">
            <ArrowLeft size={16} /> <span>/ A - Move Left</span>
          </div>
          <div className="mb-1 flex items-center gap-1">
            <ArrowRight size={16} /> <span>/ D - Move Right</span>
          </div>
        </div>
        <div>
          <p className="mb-1 font-medium">Actions:</p>
          <div className="mb-1 flex items-center gap-1">
            <Space size={16} /> <span>Space - Collect Item</span>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Collect the correct numbers to solve the math challenge and
              advance to the next level!
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
