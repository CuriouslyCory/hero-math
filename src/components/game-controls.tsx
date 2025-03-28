import { Card } from "~/components/ui/card";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Space } from "lucide-react";

export default function GameControls() {
  return (
    <Card className="mt-2 max-w-md bg-gray-100 p-3">
      <h3 className="mb-1 text-center text-base font-bold">Controls</h3>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="mb-1 text-sm font-medium">Movement:</p>
          <div className="mb-0.5 flex items-center gap-1 text-xs">
            <ArrowUp size={14} /> <span>/ W - Move Up</span>
          </div>
          <div className="mb-0.5 flex items-center gap-1 text-xs">
            <ArrowDown size={14} /> <span>/ S - Move Down</span>
          </div>
          <div className="mb-0.5 flex items-center gap-1 text-xs">
            <ArrowLeft size={14} /> <span>/ A - Move Left</span>
          </div>
          <div className="mb-0.5 flex items-center gap-1 text-xs">
            <ArrowRight size={14} /> <span>/ D - Move Right</span>
          </div>
        </div>
        <div>
          <p className="mb-1 text-sm font-medium">Actions:</p>
          <div className="mb-1 flex items-center gap-1 text-xs">
            <Space size={14} /> <span>Space - Collect Item</span>
          </div>
          <div className="mt-1">
            <p className="text-xs text-gray-600">
              Collect the correct numbers to solve the math challenge!
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
