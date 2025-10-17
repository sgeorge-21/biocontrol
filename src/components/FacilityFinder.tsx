import { useState } from 'react';
import { Hospital, MapPin, Phone, Navigation, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Facility {
  name: string;
  distance: string;
  phone: string;
  hours: string;
  hasLab: boolean;
}

export const FacilityFinder = () => {
  const [location, setLocation] = useState('');
  const [facilities, setFacilities] = useState<Facility[]>([]);

  // Mock data - in production, this would use geolocation and real facility data
  const mockFacilities: Facility[] = [
    {
      name: 'Central District Hospital',
      distance: '1.2 km',
      phone: '+123 456 7890',
      hours: '24/7',
      hasLab: true,
    },
    {
      name: 'Community Health Center',
      distance: '2.5 km',
      phone: '+123 456 7891',
      hours: '8 AM - 8 PM',
      hasLab: true,
    },
    {
      name: 'Regional Medical Clinic',
      distance: '3.8 km',
      phone: '+123 456 7892',
      hours: '7 AM - 10 PM',
      hasLab: false,
    },
  ];

  const handleSearch = () => {
    if (location.trim()) {
      setFacilities(mockFacilities);
    }
  };

  const handleGetDirections = (facilityName: string) => {
    // In production, this would open maps with directions
    console.log('Getting directions to:', facilityName);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-secondary/10">
            <Hospital className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <CardTitle>Find Nearest Health Facility</CardTitle>
            <CardDescription>
              Locate facilities for malaria testing and treatment
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter your location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>

        {facilities.length > 0 && (
          <div className="space-y-3">
            {facilities.map((facility, index) => (
              <Card key={index} className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold">{facility.name}</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {facility.hasLab && (
                            <Badge variant="secondary" className="text-xs">
                              Lab Testing Available
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {facility.hours}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-primary" />
                        <span>{facility.distance} away</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <span>{facility.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{facility.hours}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleGetDirections(facility.name)}
                      variant="outline"
                      className="w-full"
                      size="sm"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {facilities.length === 0 && location && (
          <div className="text-center py-8 text-muted-foreground">
            <Hospital className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              No facilities found. Try a different location.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
