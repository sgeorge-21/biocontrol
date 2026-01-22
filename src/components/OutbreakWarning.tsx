import { useState, useMemo } from 'react';
import { MapPin, AlertTriangle, Search, TrendingUp, TrendingDown, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// WHO Regional Epidemiological Data (Based on WHO 2017-2021 estimates)
const epidemiologicalData: Record<string, {
  region: string;
  riskLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'MINIMAL';
  casesPerYear: number;
  deathsPerYear: number;
  percentOfGlobal: number;
  trend: 'increasing' | 'stable' | 'decreasing';
  countries: string[];
}> = {
  'africa': {
    region: 'WHO Africa Region',
    riskLevel: 'HIGH',
    casesPerYear: 233000000,
    deathsPerYear: 593000,
    percentOfGlobal: 95,
    trend: 'stable',
    countries: ['nigeria', 'dr congo', 'uganda', 'mozambique', 'niger', 'burkina faso', 'mali', 'ghana', 'cameroon', 'tanzania', 'kenya', 'ethiopia', 'sudan', 'south sudan', 'angola', 'zambia', 'malawi', 'rwanda', 'benin', 'togo', 'senegal', 'guinea', 'sierra leone', 'liberia', 'ivory coast', 'chad', 'central african republic']
  },
  'nigeria': {
    region: 'Nigeria',
    riskLevel: 'HIGH',
    casesPerYear: 65000000,
    deathsPerYear: 114000,
    percentOfGlobal: 27,
    trend: 'increasing',
    countries: ['nigeria']
  },
  'dr congo': {
    region: 'Democratic Republic of Congo',
    riskLevel: 'HIGH',
    casesPerYear: 28000000,
    deathsPerYear: 26000,
    percentOfGlobal: 12,
    trend: 'increasing',
    countries: ['dr congo', 'congo', 'democratic republic of congo']
  },
  'south-east asia': {
    region: 'WHO South-East Asia Region',
    riskLevel: 'MEDIUM',
    casesPerYear: 5700000,
    deathsPerYear: 9000,
    percentOfGlobal: 2.4,
    trend: 'decreasing',
    countries: ['india', 'indonesia', 'myanmar', 'bangladesh', 'thailand', 'nepal', 'cambodia', 'vietnam', 'laos', 'sri lanka', 'timor-leste']
  },
  'india': {
    region: 'India',
    riskLevel: 'MEDIUM',
    casesPerYear: 5600000,
    deathsPerYear: 7700,
    percentOfGlobal: 2.3,
    trend: 'decreasing',
    countries: ['india']
  },
  'eastern mediterranean': {
    region: 'WHO Eastern Mediterranean Region',
    riskLevel: 'MEDIUM',
    casesPerYear: 8200000,
    deathsPerYear: 15000,
    percentOfGlobal: 3.4,
    trend: 'stable',
    countries: ['afghanistan', 'pakistan', 'yemen', 'sudan', 'djibouti', 'somalia', 'saudi arabia', 'iran', 'iraq']
  },
  'americas': {
    region: 'WHO Americas Region',
    riskLevel: 'LOW',
    casesPerYear: 680000,
    deathsPerYear: 400,
    percentOfGlobal: 0.3,
    trend: 'increasing',
    countries: ['brazil', 'venezuela', 'colombia', 'peru', 'haiti', 'dominican republic', 'honduras', 'guatemala', 'nicaragua', 'panama', 'guyana', 'suriname', 'french guiana', 'bolivia', 'ecuador']
  },
  'western pacific': {
    region: 'WHO Western Pacific Region',
    riskLevel: 'LOW',
    casesPerYear: 1100000,
    deathsPerYear: 800,
    percentOfGlobal: 0.5,
    trend: 'decreasing',
    countries: ['papua new guinea', 'solomon islands', 'vanuatu', 'philippines', 'malaysia']
  },
  'europe': {
    region: 'WHO Europe Region',
    riskLevel: 'MINIMAL',
    casesPerYear: 0,
    deathsPerYear: 0,
    percentOfGlobal: 0,
    trend: 'stable',
    countries: ['united kingdom', 'uk', 'france', 'germany', 'spain', 'italy', 'portugal', 'netherlands', 'belgium', 'switzerland', 'austria', 'poland', 'czech republic', 'sweden', 'norway', 'finland', 'denmark', 'ireland', 'greece', 'turkey', 'russia', 'ukraine']
  }
};

const findRegionData = (searchTerm: string) => {
  const term = searchTerm.toLowerCase().trim();
  
  // Direct match
  if (epidemiologicalData[term]) {
    return epidemiologicalData[term];
  }
  
  // Search within countries
  for (const [key, data] of Object.entries(epidemiologicalData)) {
    if (data.countries.some(country => country.includes(term) || term.includes(country))) {
      // Return specific country data if available, otherwise regional
      return epidemiologicalData[key.toLowerCase()] || data;
    }
  }
  
  // Default to Africa if no match (educational fallback)
  return null;
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
  const [location, setLocation] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchedLocation, setSearchedLocation] = useState('');

  const regionData = useMemo(() => {
    if (!showResults || !searchedLocation) return null;
    return findRegionData(searchedLocation);
  }, [showResults, searchedLocation]);

  const handleSearch = () => {
    if (location.trim()) {
      setSearchedLocation(location);
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
      case 'MINIMAL':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getRiskMessage = (level: string) => {
    switch (level) {
      case 'HIGH':
        return {
          title: 'High Risk - Immediate Prevention Required',
          message: 'This region has high malaria transmission. Use insecticide-treated bed nets, take prophylaxis if traveling, and seek immediate medical care if symptoms develop.'
        };
      case 'MEDIUM':
        return {
          title: 'Moderate Risk - Prevention Recommended',
          message: 'Malaria is present in this region. Use bed nets, apply repellent, and consider prophylaxis for travel to rural areas.'
        };
      case 'LOW':
        return {
          title: 'Lower Risk - Precautions Advised',
          message: 'Limited malaria transmission. Standard precautions recommended, especially in rural and forested areas.'
        };
      case 'MINIMAL':
        return {
          title: 'Minimal/No Local Risk',
          message: 'Only imported cases occur. Seek care if symptoms develop after traveling to endemic areas.'
        };
      default:
        return {
          title: 'Risk Assessment',
          message: 'Please consult local health authorities for current information.'
        };
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
            <CardDescription>Check malaria risk levels based on WHO epidemiological data</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter country or region (e.g., Nigeria, India, Brazil)..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} size="icon">
            <Search className="w-4 h-4" />
          </Button>
        </div>

        {showResults && regionData && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium">{regionData.region}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  WHO Risk Classification
                </p>
              </div>
              <Badge className={getRiskColor(regionData.riskLevel)}>
                {regionData.riskLevel} RISK
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-primary/5 rounded-lg text-center">
                <p className="text-xl font-bold text-primary">
                  {formatNumber(regionData.casesPerYear)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Cases/Year
                </p>
              </div>
              <div className="p-3 bg-destructive/5 rounded-lg text-center">
                <p className="text-xl font-bold text-destructive">
                  {formatNumber(regionData.deathsPerYear)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Deaths/Year
                </p>
              </div>
              <div className="p-3 bg-secondary/5 rounded-lg text-center">
                <div className="flex items-center justify-center gap-1">
                  {regionData.trend === 'increasing' ? (
                    <TrendingUp className="w-4 h-4 text-destructive" />
                  ) : regionData.trend === 'decreasing' ? (
                    <TrendingDown className="w-4 h-4 text-secondary" />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                  <p className="text-sm font-semibold capitalize">
                    {regionData.trend}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Trend</p>
              </div>
            </div>

            {regionData.percentOfGlobal > 0 && (
              <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                <Globe className="w-4 h-4 text-primary" />
                <p className="text-sm">
                  <span className="font-semibold">{regionData.percentOfGlobal}%</span> of global malaria cases
                </p>
              </div>
            )}

            <div className={`flex items-start gap-2 p-4 rounded-lg border ${
              regionData.riskLevel === 'HIGH' 
                ? 'bg-destructive/10 border-destructive/20' 
                : regionData.riskLevel === 'MEDIUM'
                ? 'bg-accent/10 border-accent/20'
                : 'bg-secondary/10 border-secondary/20'
            }`}>
              <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                regionData.riskLevel === 'HIGH' ? 'text-destructive' : 'text-accent'
              }`} />
              <div className="text-sm">
                <p className="font-medium">
                  {getRiskMessage(regionData.riskLevel).title}
                </p>
                <p className="text-muted-foreground mt-1">
                  {getRiskMessage(regionData.riskLevel).message}
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              Data source: WHO World Malaria Report (2017-2021 estimates)
            </p>
          </div>
        )}

        {showResults && !regionData && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="text-center py-6 text-muted-foreground">
              <Globe className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">Region not found in database</p>
              <p className="text-xs mt-1">
                Try searching for a country name (e.g., "Nigeria", "India") or WHO region (e.g., "Africa", "Americas")
              </p>
            </div>
          </div>
        )}

        {!showResults && (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              Enter a country or region to view malaria risk data
            </p>
            <p className="text-xs mt-2 opacity-75">
              Examples: Nigeria, India, Brazil, Southeast Asia
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};