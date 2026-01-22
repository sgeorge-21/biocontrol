import { MapPin, AlertTriangle, Activity, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Liberia-specific malaria epidemiological data
const liberiaData = {
  country: 'Liberia',
  riskLevel: 'HIGH' as const,
  casesPerYear: 1800000,
  deathsPerYear: 1200,
  populationAtRisk: 5000000,
  transmissionSeason: 'Year-round (peaks May-October during rainy season)',
  prevalentSpecies: ['P. falciparum (98%)', 'P. malariae (2%)'],
  highRiskCounties: [
    { name: 'Montserrado', cases: 450000, population: 1500000 },
    { name: 'Nimba', cases: 280000, population: 462000 },
    { name: 'Bong', cases: 220000, population: 333000 },
    { name: 'Lofa', cases: 180000, population: 276000 },
    { name: 'Grand Bassa', cases: 150000, population: 221000 },
    { name: 'Margibi', cases: 140000, population: 199000 },
  ],
  keyFacts: [
    'Malaria is the leading cause of morbidity in Liberia',
    'Children under 5 account for 40% of all malaria deaths',
    'Pregnant women face 3x higher risk of severe malaria',
    'ITN coverage has increased to ~55% of households',
    'P. falciparum causes nearly all cases (highly dangerous)',
  ],
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
};

export const OutbreakWarning = () => {
  return (
    <div className="space-y-6">
      {/* Liberia Risk Alert Banner */}
      <Card className="shadow-lg border-destructive/30 bg-gradient-to-r from-destructive/10 to-accent/10">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-destructive/20">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <CardTitle>Liberia Malaria Risk Status</CardTitle>
                <CardDescription>National Malaria Control Program Data</CardDescription>
              </div>
            </div>
            <Badge className="bg-destructive text-destructive-foreground text-sm px-3 py-1">
              HIGH RISK ENDEMIC
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            <div className="text-center p-4 bg-background/60 rounded-lg">
              <Activity className="w-5 h-5 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary">{formatNumber(liberiaData.casesPerYear)}</p>
              <p className="text-xs text-muted-foreground">Cases/Year</p>
            </div>
            <div className="text-center p-4 bg-background/60 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-destructive mx-auto mb-2" />
              <p className="text-2xl font-bold text-destructive">{formatNumber(liberiaData.deathsPerYear)}</p>
              <p className="text-xs text-muted-foreground">Deaths/Year</p>
            </div>
            <div className="text-center p-4 bg-background/60 rounded-lg">
              <Users className="w-5 h-5 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-accent">{formatNumber(liberiaData.populationAtRisk)}</p>
              <p className="text-xs text-muted-foreground">Population at Risk</p>
            </div>
            <div className="text-center p-4 bg-background/60 rounded-lg">
              <TrendingUp className="w-5 h-5 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold text-secondary">98%</p>
              <p className="text-xs text-muted-foreground">P. falciparum</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* County-Level Data */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Malaria Cases by County
          </CardTitle>
          <CardDescription>High-burden counties in Liberia (annual estimates)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {liberiaData.highRiskCounties.map((county) => {
            const percentage = (county.cases / liberiaData.casesPerYear) * 100;
            return (
              <div key={county.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{county.name} County</span>
                  <span className="text-muted-foreground">
                    {formatNumber(county.cases)} cases ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Transmission Info */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Transmission Season</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
            <p className="text-sm font-medium text-accent">{liberiaData.transmissionSeason}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Peak transmission coincides with the rainy season. Extra precautions recommended during this period.
            </p>
          </div>
          
          <div className="mt-4 space-y-2">
            <p className="text-sm font-medium">Prevalent Malaria Species:</p>
            <div className="flex flex-wrap gap-2">
              {liberiaData.prevalentSpecies.map((species) => (
                <Badge key={species} variant="outline" className="text-xs">
                  {species}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Facts */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Key Facts for Liberia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {liberiaData.keyFacts.map((fact, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="text-destructive font-bold mt-0.5">•</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        Data sources: Liberia National Malaria Control Program, WHO estimates
      </p>
    </div>
  );
};
