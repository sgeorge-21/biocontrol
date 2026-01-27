import React, { useState, useEffect, useRef } from 'react';
import { Hospital, MapPin, Phone, Navigation, Clock, Loader, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Facility {
  name: string;
  distance: string;
  phone: string;
  hours: string;
  hasLab: boolean;
  lat: number;
  lng: number;
}

interface UserLocation {
  lat: number;
  lng: number;
}

export const FacilityFinder = () => {
  const [location, setLocation] = useState('');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const mapRef = useRef<google.maps.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  // Mock data with coordinates - in production, this would use real facility data
  const mockFacilities: Facility[] = [
    {
      name: 'Central District Hospital',
      distance: '1.2 km',
      phone: '+123 456 7890',
      hours: '24/7',
      hasLab: true,
      lat: 40.7128,
      lng: -74.0060,
    },
    {
      name: 'Community Health Center',
      distance: '2.5 km',
      phone: '+123 456 7891',
      hours: '8 AM - 8 PM',
      hasLab: true,
      lat: 40.7260,
      lng: -73.9897,
    },
    {
      name: 'Regional Medical Clinic',
      distance: '3.8 km',
      phone: '+123 456 7892',
      hours: '7 AM - 10 PM',
      hasLab: false,
      lat: 40.7489,
      lng: -73.9680,
    },
  ];

  // Initialize Google Map
  useEffect(() => {
    if (mapContainerRef.current && userLocation) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        const map = new window.google.maps.Map(mapContainerRef.current!, {
          zoom: 13,
          center: { lat: userLocation.lat, lng: userLocation.lng },
          mapTypeControl: true,
          fullscreenControl: true,
          streetViewControl: false,
        });

        mapRef.current = map;
        updateMapMarkers(map);
      };

      if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
        document.head.appendChild(script);
      } else {
        const map = new window.google.maps.Map(mapContainerRef.current!, {
          zoom: 13,
          center: { lat: userLocation.lat, lng: userLocation.lng },
        });
        mapRef.current = map;
        updateMapMarkers(map);
      }
    }
  }, [userLocation]);

  const updateMapMarkers = (map: google.maps.Map) => {
    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    // Add user location marker
    if (userLocation) {
      const userMarker = new window.google.maps.Marker({
        position: { lat: userLocation.lat, lng: userLocation.lng },
        map: map,
        title: 'Your Location',
        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      });
      markersRef.current.push(userMarker);
    }

    // Add facility markers
    facilities.forEach((facility) => {
      const marker = new window.google.maps.Marker({
        position: { lat: facility.lat, lng: facility.lng },
        map: map,
        title: facility.name,
        icon: 'http://maps.google.com/mapfiles/ms/icons/hospital.png',
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div class="p-2">
            <h3 class="font-semibold text-sm">${facility.name}</h3>
            <p class="text-xs text-gray-600">${facility.distance} away</p>
            <p class="text-xs">${facility.hours}</p>
          </div>
        `,
      });

      marker.addListener('click', () => {
        // Close all other info windows
        // Open this one
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers
    if (markersRef.current.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      markersRef.current.forEach((marker) => {
        bounds.extend(marker.getPosition()!);
      });
      map.fitBounds(bounds);
    }
  };

  // Get user's device location
  const getUserLocation = () => {
    setLoading(true);
    setError('');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setFacilities(mockFacilities);
          setLoading(false);
        },
        (err) => {
          setError(
            'Unable to get your location. Please enable location services and try again.'
          );
          setLoading(false);
          console.error('Geolocation error:', err);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  };

  const handleGetDirections = (facilityName: string) => {
    const facility = facilities.find((f) => f.name === facilityName);
    if (facility && userLocation) {
      const directionsUrl = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${facility.lat},${facility.lng}`;
      window.open(directionsUrl, '_blank');
    }
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
              Locate hospitals and clinics for malaria testing and treatment using your device location
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button
          onClick={getUserLocation}
          className="w-full"
          disabled={loading}
          variant={userLocation ? 'outline' : 'default'}
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Getting Your Location...
            </>
          ) : userLocation ? (
            <>
              <MapPin className="w-4 h-4 mr-2" />
              Location Found - Showing Facilities
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4 mr-2" />
              Use My Device Location
            </>
          )}
        </Button>

        {/* Google Map Container */}
        {userLocation && (
          <div className="space-y-4">
            <div
              ref={mapContainerRef}
              className="w-full h-96 rounded-lg border border-input overflow-hidden"
            />
          </div>
        )}

        {/* Facilities List */}
        {facilities.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">Nearby Health Facilities</h3>
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

        {!userLocation && !loading && (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              Click "Use My Device Location" to find nearby health facilities on the map.
            </p>
          </div>
        )}

        {userLocation && facilities.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Hospital className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              No facilities found in your area.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
