import { useState } from 'react';
import { MapPin, AlertTriangle, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const OutbreakWarning = () => {
  const [location, setLocation] = useState('');
  const [showResults, setShowResults] = useState(false);

  // Mock data - in production, this would come from an API
  const outbreakData = {
    riskLevel: 'MEDIUM',
    recentCases: 127,
    trend: 'increasing',
    lastUpdated: '2 hours ago',
  };

  const handleSearch = () => {
    if (location.trim()) {
      setShowResults(true);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'HIGH':
        return 'bg-destructive text-destructive-foreground';
      case 'MEDIUM':
        return 'bg-accent text-accent-foreground';
      case 'LOW':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-accent/10">
            <MapPin className="w-6 h-6 text-accent" />
          </div>
          <div>
            <CardTitle>Outbreak Early Warning</CardTitle>
            <CardDescription>Check malaria risk levels in your area</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter your location or region..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} size="icon">
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {showResults && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium">Current Risk Level</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on recent data
                </p>
              </div>
              <Badge className={getRiskColor(outbreakData.riskLevel)}>
                {outbreakData.riskLevel}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-primary/5 rounded-lg">
                <p className="text-2xl font-bold text-primary">
                  {outbreakData.recentCases}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Recent cases (30 days)
                </p>
              </div>
              <div className="p-4 bg-secondary/5 rounded-lg">
                <p className="text-2xl font-bold text-secondary capitalize">
                  {outbreakData.trend}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Trend</p>
              </div>
            </div>

            <div className="flex items-start gap-2 p-4 bg-accent/10 rounded-lg border border-accent/20">
              <AlertTriangle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-accent-foreground">
                  Prevention Recommended
                </p>
                <p className="text-muted-foreground mt-1">
                  Use bed nets and repellent. Seek immediate medical attention if symptoms develop.
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Last updated: {outbreakData.lastUpdated}
            </p>
          </div>
        )}

        {!showResults && (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              Enter your location to view outbreak information
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
