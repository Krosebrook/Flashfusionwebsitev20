import {
  CheckCircle2,
  Target,
  AlertCircle,
  Brain,
  ArrowRight
} from "lucide-react";
import { Button } from "../../ui/button";

interface OptimizationRecommendationProps {
  type: "success" | "info" | "warning" | "insight";
  title: string;
  description: string;
  onApply?: () => void;
}

export function OptimizationRecommendation({
  type,
  title,
  description,
  onApply
}: OptimizationRecommendationProps) {
  const getRecommendationConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: CheckCircle2,
          borderColor: "border-green-500/50",
          iconColor: "text-green-400",
          gradient: "from-green-500/10 to-transparent"
        };
      case "info":
        return {
          icon: Target,
          borderColor: "border-blue-500/50",
          iconColor: "text-blue-400",
          gradient: "from-blue-500/10 to-transparent"
        };
      case "warning":
        return {
          icon: AlertCircle,
          borderColor: "border-yellow-500/50",
          iconColor: "text-yellow-400",
          gradient: "from-yellow-500/10 to-transparent"
        };
      case "insight":
        return {
          icon: Brain,
          borderColor: "border-purple-500/50",
          iconColor: "text-purple-400",
          gradient: "from-purple-500/10 to-transparent"
        };
      default:
        return {
          icon: AlertCircle,
          borderColor: "border-gray-500/50",
          iconColor: "text-gray-400",
          gradient: "from-gray-500/10 to-transparent"
        };
    }
  };

  const config = getRecommendationConfig();
  const IconComponent = config.icon;

  return (
    <div className={`
      relative overflow-hidden rounded-lg border ${config.borderColor} 
      bg-card/50 backdrop-blur-sm transition-all duration-300
      hover:shadow-lg hover:border-opacity-100 group
    `}>
      {/* Subtle Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-20`} />
      
      <div className="relative p-4 flex items-start gap-4">
        <div className={`p-2 rounded-full bg-background/50 ring-1 ring-white/10 ${config.iconColor}`}>
          <IconComponent className="h-5 w-5" />
        </div>
        
        <div className="flex-1 space-y-1">
          <h4 className="font-semibold text-foreground tracking-tight">
            {title}
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
          
          {onApply && (
            <div className="pt-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-0 text-xs hover:bg-transparent hover:text-primary"
                onClick={onApply}
              >
                Apply Optimization <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
