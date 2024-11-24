import {
  AlertCircle,
  ArrowUpCircle,
  ArrowRightCircle,
  ArrowDownCircle,
  Circle,
} from "lucide-react";

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "Critical":
      return <AlertCircle className="text-red-600" />;
    case "High":
      return <ArrowUpCircle className="text-orange-500" />;
    case "Medium":
      return <ArrowRightCircle className="text-yellow-500" />;
    case "Low":
      return <ArrowDownCircle className="text-green-500" />;
    case "Cosmetic":
      return <Circle className="text-gray-400" />;
    default:
      return <Circle className="text-neutral-400" />;
  }
};

const getPriorityStyle = (priority: string) => {
  switch (priority) {
    case "Critical":
      return "text-red-600 font-bold";
    case "High":
      return "text-orange-500 font-medium";
    case "Medium":
      return "text-yellow-500";
    case "Low":
      return "text-green-500";
    case "Cosmetic":
      return "text-gray-400";
    default:
      return "text-neutral-500";
  }
};

export const PriorityDisplay = ({ priority }: { priority: string }) => (
  <div className="flex items-center gap-2">
    {getPriorityIcon(priority)}
    <span className={getPriorityStyle(priority)}>{priority}</span>
  </div>
);
