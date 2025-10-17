import { Shield, Bug, Pill, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const EducationSection = () => {
  const educationCards = [
    {
      icon: Bug,
      title: 'What is Malaria?',
      description: 'Malaria is a life-threatening disease caused by parasites transmitted through infected mosquito bites.',
      details: [
        'Caused by Plasmodium parasites',
        'Transmitted by Anopheles mosquitoes',
        'Most common in tropical regions',
        'Preventable and treatable',
      ],
    },
    {
      icon: AlertTriangle,
      title: 'Common Symptoms',
      description: 'Recognize the warning signs early for prompt treatment.',
      details: [
        'High fever and chills',
        'Severe sweating',
        'Headache and body aches',
        'Nausea and vomiting',
        'Fatigue and weakness',
      ],
    },
    {
      icon: Shield,
      title: 'Prevention',
      description: 'Protect yourself with these proven prevention methods.',
      details: [
        'Use insecticide-treated bed nets',
        'Apply mosquito repellent',
        'Wear long sleeves and pants',
        'Use indoor insecticide sprays',
        'Take preventive medication if traveling',
      ],
    },
    {
      icon: Pill,
      title: 'Treatment',
      description: 'Early diagnosis and treatment are crucial for recovery.',
      details: [
        'Antimalarial medications',
        'Hospital care for severe cases',
        'Complete the full treatment course',
        'Follow-up testing recommended',
        'Seek treatment within 24 hours',
      ],
    },
  ];

  return (
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
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
