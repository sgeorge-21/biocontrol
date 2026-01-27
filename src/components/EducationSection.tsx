import { Shield, Bug, Pill, AlertTriangle, BarChart3, MapPin, Users, Activity, Hospital } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export const EducationSection = () => {
  const educationCards = [
    {
      icon: Bug,
      title: 'What is Malaria?',
      description: 'Malaria is a life-threatening disease caused by parasites transmitted through infected mosquito bites.',
      details: [
        'Caused by Plasmodium parasites (P. falciparum is 98% of cases in Liberia)',
        'Transmitted by female Anopheles mosquitoes',
        'Endemic throughout Liberia with year-round transmission',
        'Preventable and treatable when caught early',
      ],
    },
    {
      icon: AlertTriangle,
      title: 'Common Symptoms',
      description: 'Recognize the warning signs early for prompt treatment.',
      details: [
        'Cyclical fever (every 48-72 hours)',
        'Severe chills and rigors',
        'Profuse sweating after fever',
        'Headache, nausea, muscle pain',
        '⚠️ DANGER: Confusion, seizures, breathing difficulty',
      ],
    },
    {
      icon: Shield,
      title: 'Prevention in Liberia',
      description: 'Protect yourself with these proven prevention methods.',
      details: [
        'Sleep under insecticide-treated bed nets (ITNs)',
        'Use indoor residual spraying (IRS) if available',
        'Apply mosquito repellents (DEET or picaridin)',
        'Wear long sleeves and pants at dusk/dawn',
        'Eliminate standing water near homes',
      ],
    },
    {
      icon: Pill,
      title: 'Treatment',
      description: 'Early diagnosis and treatment are crucial for recovery.',
      details: [
        'Artemisinin-based Combination Therapy (ACT) is first-line',
        'Artesunate-Amodiaquine (ASAQ) commonly used in Liberia',
        'IV artesunate for severe malaria',
        'Complete full treatment course (usually 3 days)',
        'Seek care within 24 hours of symptoms',
      ],
    },
  ];

  // Liberia-specific statistics
  const liberiaStats = {
    totalCases: 1800000,
    totalDeaths: 1200,
    childDeaths: 40, // percentage
    populationAtRisk: 100, // percentage - all of Liberia
    healthFacilities: 725,
  };

  // County burden data for Liberia
  const countyBurden = [
    { county: 'Montserrado', cases: 450, color: 'bg-destructive', percentage: 25 },
    { county: 'Nimba', cases: 280, color: 'bg-accent', percentage: 15.5 },
    { county: 'Bong', cases: 220, color: 'bg-primary', percentage: 12.2 },
    { county: 'Lofa', cases: 180, color: 'bg-secondary', percentage: 10 },
    { county: 'Grand Bassa', cases: 150, color: 'bg-muted-foreground', percentage: 8.3 },
    { county: 'Other Counties', cases: 520, color: 'bg-muted', percentage: 28.9 },
  ];

  return (
    <div className="space-y-8">
      {/* Liberia Statistics Banner */}
      <Card className="shadow-lg bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/20">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>Malaria in Liberia</CardTitle>
              <CardDescription>National Malaria Control Program Statistics</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <Activity className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary">1.8M</p>
              <p className="text-xs text-muted-foreground">Cases/Year</p>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-destructive mx-auto mb-2" />
              <p className="text-2xl font-bold text-destructive">1,200</p>
              <p className="text-xs text-muted-foreground">Deaths/Year</p>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <Users className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-accent">40%</p>
              <p className="text-xs text-muted-foreground">Deaths in Children &lt;5</p>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <Hospital className="w-6 h-6 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold text-secondary">725</p>
              <p className="text-xs text-muted-foreground">Health Facilities</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* County Burden */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Malaria Burden by County
          </CardTitle>
          <CardDescription>Annual cases in thousands (estimates)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {countyBurden.map((county) => (
            <div key={county.county} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{county.county}</span>
                <span className="text-muted-foreground">
                  {county.cases}K cases ({county.percentage}%)
                </span>
              </div>
              <Progress value={county.percentage * 2} className="h-2" />
            </div>
          ))}
          <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-sm text-center">
              <span className="font-semibold text-destructive">Montserrado County</span> (including Monrovia) 
              has the highest burden with{' '}
              <span className="font-semibold text-destructive">25%</span> of all cases
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Vulnerable Groups */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-accent" />
            High-Risk Groups in Liberia
          </CardTitle>
          <CardDescription>Populations requiring special attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { group: 'Children under 5', risk: '40% of malaria deaths', icon: '👶' },
              { group: 'Pregnant women', risk: '3x risk of severe malaria', icon: '🤰' },
              { group: 'Rural communities', risk: 'Limited access to healthcare', icon: '🏘️' },
              { group: 'Displaced persons', risk: 'Inadequate shelter/protection', icon: '🏕️' },
            ].map((item) => (
              <div key={item.group} className="p-3 bg-accent/5 rounded-lg border border-accent/10">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-sm">{item.group}</p>
                    <p className="text-xs text-muted-foreground">{item.risk}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Education Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {educationCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{card.title}</CardTitle>
                  </div>
                </div>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {card.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-secondary mt-1">•</span>
                      <span className={detail.startsWith('⚠️') ? 'text-destructive font-medium' : ''}>
                        {detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
