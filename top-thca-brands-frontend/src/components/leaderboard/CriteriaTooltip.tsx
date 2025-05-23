import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface CriteriaTooltipProps {
  type?: "potency" | "flavor" | "effects" | "value" | "overall";
  criteria?: "potency" | "flavor" | "effects" | "value" | "overall";
}

const criteriaDescriptions = {
  potency: "Measures the strength of THCa content and overall effectiveness of the product.",
  flavor: "Evaluates taste, aroma, and terpene profile quality.",
  effects: "Rates the quality, duration, and balance of effects experienced.",
  value: "Considers price point relative to quality and quantity provided.",
  overall: "A holistic score combining all factors including brand reputation and consistency.",
};

const CriteriaTooltip = ({ type, criteria }: CriteriaTooltipProps) => {
  // Use either type or criteria prop, defaulting to 'overall' if neither is provided
  const tooltipType = type || criteria || "overall";
  
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center cursor-help">
            <Info className="h-4 w-4 ml-1 text-thc-white/50 hover:text-thc-gold" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="bg-thc-black border-thc-grey/30 p-3 max-w-[250px]">
          <p className="text-xs text-thc-white">{criteriaDescriptions[tooltipType]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CriteriaTooltip; 