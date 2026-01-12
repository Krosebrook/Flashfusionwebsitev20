import { Download } from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { OptimizationRecommendation } from './OptimizationRecommendation';

export function PortfolioOptimizationView() {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Portfolio Optimization Recommendations</h3>
        <Button variant="outline" className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>
      
      <div className="space-y-4">
        <OptimizationRecommendation
          type="success"
          title="High-Impact Optimization"
          description="Reallocating Backend Developer between E-commerce and Analytics projects could improve overall portfolio delivery by 23% with minimal effort."
        />

        <OptimizationRecommendation
          type="info"
          title="Efficiency Opportunity"
          description="Cross-training UI Designer on mobile patterns could reduce dependency bottlenecks and improve project resilience."
        />

        <OptimizationRecommendation
          type="warning"
          title="Resource Bottleneck Alert"
          description="QA Engineer is at 95% capacity across multiple projects. Consider redistributing testing tasks or adding additional QA resources."
        />

        <OptimizationRecommendation
          type="insight"
          title="Knowledge Sharing Opportunity"
          description="Frontend Developer's component library work on E-commerce project could accelerate Mobile Banking App development by 30%."
        />
      </div>
    </Card>
  );
}