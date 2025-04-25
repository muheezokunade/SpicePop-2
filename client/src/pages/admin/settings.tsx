import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import SettingsForm from '@/components/admin/SettingsForm';
import { API_ENDPOINTS } from '@/lib/constants';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Store, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  MessageCircle
} from 'lucide-react';

interface SettingsMap {
  [key: string]: string;
}

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch settings
  const { data: settings, isLoading } = useQuery<SettingsMap>({
    queryKey: [API_ENDPOINTS.settings.list],
  });
  
  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      const response = await apiRequest('PUT', API_ENDPOINTS.settings.update(key), { value });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.settings.list] });
      toast({
        title: 'Settings Updated',
        description: 'Your settings have been saved successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to update settings: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  // Handle settings update
  const handleUpdateSetting = (key: string, value: string) => {
    updateMutation.mutate({ key, value });
  };
  
  // Group settings by type
  const groupedSettings = {
    general: {
      site_name: settings?.site_name || '',
      site_description: settings?.site_description || '',
    },
    contact: {
      contact_email: settings?.contact_email || '',
      contact_phone: settings?.contact_phone || '',
      contact_whatsapp: settings?.contact_whatsapp || '',
      contact_address: settings?.contact_address || '',
    },
    social: {
      social_facebook: settings?.social_facebook || '',
      social_instagram: settings?.social_instagram || '',
      social_twitter: settings?.social_twitter || '',
    }
  };
  
  // Update document title
  useEffect(() => {
    document.title = 'Site Settings | SpicePop Admin';
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Site Settings | SpicePop Admin</title>
      </Helmet>
      
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-gray-500">Manage your site settings</p>
          </div>
          
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                <span>General</span>
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>Contact Info</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>Social Media</span>
              </TabsTrigger>
            </TabsList>
            
            {isLoading ? (
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <TabsContent value="general">
                  <Card>
                    <CardHeader>
                      <CardTitle>General Settings</CardTitle>
                      <CardDescription>
                        Basic information about your store
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SettingsForm 
                        settings={groupedSettings.general}
                        onUpdate={handleUpdateSetting}
                        isPending={updateMutation.isPending}
                        fields={[
                          {
                            key: 'site_name',
                            label: 'Site Name',
                            description: 'The name of your store',
                            icon: <Store className="h-4 w-4 text-muted-foreground" />
                          },
                          {
                            key: 'site_description',
                            label: 'Site Description',
                            description: 'Short description for SEO purposes',
                            type: 'textarea',
                            icon: <Globe className="h-4 w-4 text-muted-foreground" />
                          }
                        ]}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="contact">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                      <CardDescription>
                        How customers can reach you
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SettingsForm 
                        settings={groupedSettings.contact}
                        onUpdate={handleUpdateSetting}
                        isPending={updateMutation.isPending}
                        fields={[
                          {
                            key: 'contact_email',
                            label: 'Email Address',
                            description: 'Public email for customer inquiries',
                            icon: <Mail className="h-4 w-4 text-muted-foreground" />
                          },
                          {
                            key: 'contact_phone',
                            label: 'Phone Number',
                            description: 'Main customer support phone',
                            icon: <Phone className="h-4 w-4 text-muted-foreground" />
                          },
                          {
                            key: 'contact_whatsapp',
                            label: 'WhatsApp Number',
                            description: 'Include country code (e.g., +234)',
                            icon: <MessageCircle className="h-4 w-4 text-muted-foreground" />
                          },
                          {
                            key: 'contact_address',
                            label: 'Business Address',
                            description: 'Physical location',
                            type: 'textarea',
                            icon: <MapPin className="h-4 w-4 text-muted-foreground" />
                          }
                        ]}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="social">
                  <Card>
                    <CardHeader>
                      <CardTitle>Social Media</CardTitle>
                      <CardDescription>
                        Connect with your customers on social media
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SettingsForm 
                        settings={groupedSettings.social}
                        onUpdate={handleUpdateSetting}
                        isPending={updateMutation.isPending}
                        fields={[
                          {
                            key: 'social_facebook',
                            label: 'Facebook URL',
                            description: 'Full URL to your Facebook page',
                            icon: <i className="fab fa-facebook text-muted-foreground text-sm" />
                          },
                          {
                            key: 'social_instagram',
                            label: 'Instagram URL',
                            description: 'Full URL to your Instagram profile',
                            icon: <i className="fab fa-instagram text-muted-foreground text-sm" />
                          },
                          {
                            key: 'social_twitter',
                            label: 'Twitter URL',
                            description: 'Full URL to your Twitter profile',
                            icon: <i className="fab fa-twitter text-muted-foreground text-sm" />
                          }
                        ]}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </AdminLayout>
    </>
  );
}
