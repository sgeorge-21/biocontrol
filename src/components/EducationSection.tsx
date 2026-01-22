import { Shield, Bug, Pill, AlertTriangle, BarChart3, Globe, Users, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export const EducationSection = () => {
  const educationCards = [
    {
      icon: Bug,
      title: 'What is Malaria?',
      description: 'Malaria is a life-threatening disease caused by parasites transmitted through infected mosquito bites.',
      details: [
        'Caused by Plasmodium parasites (5 species infect humans)',
        'Transmitted by female Anopheles mosquitoes',
        'Most common in tropical/subtropical regions',
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
      title: 'Prevention',
      description: 'Protect yourself with these proven prevention methods.',
      details: [
        'Insecticide-treated bed nets (ITNs) - 50% reduction',
        'Indoor residual spraying (IRS)',
        'DEET or picaridin repellents',
        'Prophylaxis for travelers to endemic areas',
        'Eliminate standing water near homes',
      ],
    },
    {
      icon: Pill,
      title: 'Treatment',
      description: 'Early diagnosis and treatment are crucial for recovery.',
      details: [
        'Artemisinin-based Combination Therapy (ACT)',
        'IV artesunate for severe malaria',
        'Primaquine for P. vivax/ovale liver stages',
        'Complete full treatment course',
        'Seek care within 24 hours of symptoms',
      ],
    },
  ];

  // WHO Global Statistics (2021 estimates)
  const globalStats = {
    totalCases: 247000000,
    totalDeaths: 619000,
    childDeaths: 80, // percentage
    africaBurden: 95, // percentage
    countriesEndemic: 84,
  };

  // Regional burden data
  const regionalBurden = [
    { region: 'Africa', cases: 233, color: 'bg-destructive', percentage: 95 },
    { region: 'South-East Asia', cases: 5.7, color: 'bg-accent', percentage: 2.4 },
    { region: 'Eastern Mediterranean', cases: 8.2, color: 'bg-primary', percentage: 3.4 },
    { region: 'Americas', cases: 0.68, color: 'bg-secondary', percentage: 0.3 },
    { region: 'Western Pacific', cases: 1.1, color: 'bg-muted-foreground', percentage: 0.5 },
  ];

  return (
    <div className="space-y-8">
      {/* Global Statistics Banner */}
      <Card className="shadow-lg bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/20">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle>Global Malaria Statistics</CardTitle>
              <CardDescription>WHO World Malaria Report 2021 Data</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <Activity className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold text-primary">247M</p>
              <p className="text-xs text-muted-foreground">Cases Globally</p>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-destructive mx-auto mb-2" />
              <p className="text-2xl font-bold text-destructive">619K</p>
              <p className="text-xs text-muted-foreground">Deaths Annually</p>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <Users className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-2xl font-bold text-accent">80%</p>
              <p className="text-xs text-muted-foreground">Deaths in Children &lt;5</p>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <Globe className="w-6 h-6 text-secondary mx-auto mb-2" />
              <p className="text-2xl font-bold text-secondary">84</p>
              <p className="text-xs text-muted-foreground">Endemic Countries</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Burden */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            Malaria Burden by WHO Region
          </CardTitle>
          <CardDescription>Annual cases in millions (2021 estimates)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {regionalBurden.map((region) => (
            <div key={region.region} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{region.region}</span>
                <span className="text-muted-foreground">
                  {region.cases}M cases ({region.percentage}%)
                </span>
              </div>
              <Progress value={region.percentage} className="h-2" />
            </div>
          ))}
          <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-sm text-center">
              <span className="font-semibold text-destructive">95%</span> of all malaria cases and{' '}
              <span className="font-semibold text-destructive">96%</span> of deaths occur in{' '}
              <span className="font-semibold">Sub-Saharan Africa</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* High Burden Countries */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Highest Burden Countries
          </CardTitle>
          <CardDescription>Countries with the most malaria cases globally</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { country: 'Nigeria', percent: 27, cases: '65M' },
              { country: 'DR Congo', percent: 12, cases: '28M' },
              { country: 'Uganda', percent: 5, cases: '12M' },
              { country: 'Mozambique', percent: 4, cases: '10M' },
            ].map((item) => (
              <div key={item.country} className="p-3 bg-destructive/5 rounded-lg border border-destructive/10 text-center">
                <p className="font-semibold text-sm">{item.country}</p>
                <p className="text-2xl font-bold text-destructive">{item.percent}%</p>
                <p className="text-xs text-muted-foreground">{item.cases} cases/yr</p>
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