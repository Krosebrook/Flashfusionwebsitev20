import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowLeft, Construction } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  description?: string;
}

const PlaceholderPage: React.FC<PlaceholderProps> = ({ 
  title, 
  description = "This feature is currently under development. Check back soon!" 
}) => {
  return (
    <div className="container mx-auto p-8 max-w-4xl ff-fade-in-up">
      <Button 
        variant="ghost" 
        className="mb-6 text-[var(--ff-text-muted)] hover:text-[var(--ff-text-primary)]"
        onClick={() => window.history.back()}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>
      
      <Card className="ff-card border-dashed border-2 border-[var(--ff-border)]">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 bg-[var(--ff-surface)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Construction className="w-8 h-8 text-[var(--ff-primary)]" />
          </div>
          <CardTitle className="text-2xl ff-text-headline">{title}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-[var(--ff-text-secondary)] text-lg">
            {description}
          </p>
          <div className="p-4 bg-[var(--ff-surface)] rounded-lg text-sm text-[var(--ff-text-muted)] max-w-md mx-auto">
            <p className="font-mono">Status: Pending Implementation</p>
            <p className="font-mono mt-1">Priority: High</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
