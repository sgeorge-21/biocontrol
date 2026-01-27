import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, MapPin, Phone, Calendar, Edit2, Loader } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';

export const Dashboard: React.FC = () => {
  const { user, logout, updateProfile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    county: user?.county || '',
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setError('');
    setSuccess('');
    setIsSaving(true);

    try {
      await updateProfile({
        full_name: formData.full_name,
        phone: formData.phone,
        location: formData.location,
        county: formData.county,
      });
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-white/10">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{user.full_name}</h1>
                <p className="text-white/80">{user.email}</p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="bg-white/10 border-white/20 hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Your account details</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}

              {isEditing ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <Input
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone</label>
                    <Input
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isSaving}
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      disabled={isSaving}
                      placeholder="City/Town"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">County</label>
                    <Input
                      name="county"
                      value={formData.county}
                      onChange={handleChange}
                      disabled={isSaving}
                      placeholder="County"
                    />
                  </div>
                  <Button
                    onClick={handleSaveProfile}
                    className="w-full"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">{user.full_name}</p>
                    </div>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{user.phone}</p>
                      </div>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-medium">{user.location}</p>
                      </div>
                    </div>
                  )}
                  {user.county && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">County</p>
                        <p className="font-medium">{user.county}</p>
                      </div>
                    </div>
                  )}
                  {user.created_at && (
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Member Since</p>
                        <p className="font-medium">
                          {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Account Summary</CardTitle>
              <CardDescription>Your account activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-primary/5">
                <p className="text-sm text-muted-foreground">Account Status</p>
                <p className="text-lg font-semibold text-primary">
                  {user.is_active ? '✓ Active' : 'Inactive'}
                </p>
              </div>
              {user.last_login && (
                <div className="p-4 rounded-lg bg-secondary/5">
                  <p className="text-sm text-muted-foreground">Last Login</p>
                  <p className="text-lg font-semibold">
                    {new Date(user.last_login).toLocaleDateString()} at{' '}
                    {new Date(user.last_login).toLocaleTimeString()}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Navigate to features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => navigate('/home')}
              >
                Go to Assessment Tool
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => navigate('/home')}
              >
                View Learning Resources
              </Button>
              <Button
                variant="outline"
                className="justify-start"
                onClick={() => navigate('/home')}
              >
                Find Health Facilities
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};
