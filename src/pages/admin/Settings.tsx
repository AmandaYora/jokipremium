import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SettingRow } from '@/components/admin/SettingRow';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Shield, Database, MapPin, Link as LinkIcon } from 'lucide-react';

interface Setting {
  key: string;
  value: string;
  is_sensitive: boolean;
}

const SETTING_CATEGORIES = {
  supabase: {
    title: 'Supabase Configuration',
    icon: Database,
    settings: [
      {
        key: 'SUPABASE_URL',
        description: 'Base project URL for all Supabase API and function calls',
      },
      {
        key: 'SUPABASE_ANON_KEY',
        description: 'Public anon key used by frontend (safe to expose)',
      },
      {
        key: 'SUPABASE_SERVICE_ROLE_KEY',
        description: 'Privileged service role key (NEVER expose client-side)',
      },
    ],
  },
  geolocation: {
    title: 'IP Geolocation',
    icon: MapPin,
    settings: [
      {
        key: 'IP_GEO_PROVIDER',
        description: 'IP geolocation provider name (e.g., ipdata)',
      },
      {
        key: 'IP_GEO_API_KEY',
        description: 'API key from ipdata.co (server-side only)',
      },
      {
        key: 'IP_GEO_TIMEOUT_MS',
        description: 'Request timeout in milliseconds (default: 3000)',
      },
    ],
  },
  social: {
    title: 'Social Media Links',
    icon: LinkIcon,
    settings: [
      {
        key: 'whatsapp_number',
        description: 'WhatsApp number for contact form (format: 628xxxxxxxxxx)',
      },
      {
        key: 'instagram_url',
        description: 'Instagram profile URL',
      },
      {
        key: 'tiktok_url',
        description: 'TikTok profile URL',
      },
    ],
  },
};

const Settings = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('settings-manager', {
        body: { action: 'get_settings' },
      });

      if (error) throw error;

      setSettings(data.settings || []);
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReveal = async (key: string): Promise<string> => {
    try {
      const { data, error } = await supabase.functions.invoke('settings-manager', {
        body: { action: 'reveal_value', key_name: key },
      });

      if (error) throw error;

      return data.value;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to reveal value',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const handleUpdate = async (key: string, value: string) => {
    try {
      const { error } = await supabase.functions.invoke('settings-manager', {
        body: { action: 'update_setting', key_name: key, key_value: value },
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: `${key} updated successfully`,
      });

      // Refresh settings
      await fetchSettings();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update setting',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const getSettingValue = (key: string) => {
    const setting = settings.find(s => s.key === key);
    return setting?.value || '';
  };

  const getSettingSensitive = (key: string) => {
    const setting = settings.find(s => s.key === key);
    return setting?.is_sensitive || false;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">System Settings</h1>
          <p className="text-muted-foreground">
            Manage environment configuration keys and application settings
          </p>
        </div>

        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-destructive">Security Notice</h3>
              <p className="text-xs text-muted-foreground">
                Sensitive values are encrypted before storage. All changes are logged in the audit trail.
                Never share sensitive keys or expose them client-side.
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="supabase" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            {Object.entries(SETTING_CATEGORIES).map(([key, category]) => {
              const Icon = category.icon;
              return (
                <TabsTrigger key={key} value={key} className="gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.title}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(SETTING_CATEGORIES).map(([categoryKey, category]) => (
            <TabsContent key={categoryKey} value={categoryKey} className="space-y-4">
              <div className="space-y-3">
                {category.settings.map((setting) => (
                  <SettingRow
                    key={setting.key}
                    keyName={setting.key}
                    value={getSettingValue(setting.key)}
                    isSensitive={getSettingSensitive(setting.key)}
                    description={setting.description}
                    onReveal={handleReveal}
                    onUpdate={handleUpdate}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;
