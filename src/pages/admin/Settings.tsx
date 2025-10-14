import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Save } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    whatsapp_number: '',
    instagram_url: '',
    tiktok_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value')
        .in('key', ['whatsapp_number', 'instagram_url', 'tiktok_url']);

      if (error) throw error;

      const settingsObj: any = {};
      data?.forEach((item) => {
        settingsObj[item.key] = item.value;
      });

      setSettings({
        whatsapp_number: settingsObj.whatsapp_number || '',
        instagram_url: settingsObj.instagram_url || '',
        tiktok_url: settingsObj.tiktok_url || '',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Update each setting
      for (const [key, value] of Object.entries(settings)) {
        const { error } = await supabase
          .from('settings')
          .update({ value })
          .eq('key', key);

        if (error) throw error;
      }

      toast({
        title: 'Success',
        description: 'Settings updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded w-1/4"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage application settings and social media links
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">
              WhatsApp Number
              <span className="text-muted-foreground font-normal ml-2">
                (Format: 628xxxxxxxxxx)
              </span>
            </label>
            <input
              type="text"
              value={settings.whatsapp_number}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              className="form-input"
              placeholder="6285173471146"
            />
            <p className="text-sm text-muted-foreground mt-1">
              This number will be used in the contact form on the landing page
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Instagram URL</label>
            <input
              type="url"
              value={settings.instagram_url}
              onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
              className="form-input"
              placeholder="https://www.instagram.com/jokipremium"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">TikTok URL</label>
            <input
              type="url"
              value={settings.tiktok_url}
              onChange={(e) => setSettings({ ...settings, tiktok_url: e.target.value })}
              className="form-input"
              placeholder="https://www.tiktok.com/@jokipremium"
            />
          </div>

          <Button type="submit" variant="hero" disabled={saving} className="w-full sm:w-auto">
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default Settings;
