import { useState } from 'react';
import { Activity, BookOpen, MapPin, Hospital } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const [activeTab, setActiveTab] = useState('assess');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Activity className="w-5 h-5" />
              <span className="text-sm font-medium">AI-Powered Malaria Assistant</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Health, Our Priority
            </h1>
            <p className="text-lg md:text-xl text-white/90">
              Get instant symptom assessment, learn about prevention, and find nearby health facilities
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-8">
            <TabsTrigger value="assess" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Assess</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Learn</span>
            </TabsTrigger>
            <TabsTrigger value="outbreak" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Outbreak</span>
            </TabsTrigger>
            <TabsTrigger value="facilities" className="flex items-center gap-2">
              <Hospital className="w-4 h-4" />
              <span className="hidden sm:inline">Facilities</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assess" className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  AI Symptom Assessment
                </h2>
                <p className="text-muted-foreground">
                  Describe your symptoms to get an instant risk assessment
                </p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Malaria Chat Assistant</CardTitle>
                  <CardDescription>Coming soon - AI-powered symptom assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Chat feature is being loaded...</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="learn" className="max-w-6xl mx-auto">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Understanding Malaria
                </h2>
                <p className="text-muted-foreground">
                  Evidence-based information on prevention and treatment
                </p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Education Resources</CardTitle>
                  <CardDescription>Coming soon - Learn about malaria</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Education content is being loaded...</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="outbreak" className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Outbreak Monitoring
                </h2>
                <p className="text-muted-foreground">
                  Stay informed about malaria risks in your area
                </p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Outbreak Data</CardTitle>
                  <CardDescription>Coming soon - Real-time outbreak tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Outbreak information is being loaded...</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="facilities" className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Find Health Facilities
                </h2>
                <p className="text-muted-foreground">
                  Locate nearby facilities for testing and treatment
                </p>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle>Facility Finder</CardTitle>
                  <CardDescription>Coming soon - Find hospitals and clinics near you</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Facility finder is being loaded...</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-muted mt-16 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p className="mb-2">
              <strong>Medical Disclaimer:</strong> This tool provides information only and is not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
            <p>Always seek the advice of qualified health providers with questions about medical conditions.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
