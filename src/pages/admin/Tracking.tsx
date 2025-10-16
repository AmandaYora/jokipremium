import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, MapPin, Clock, Users, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SummaryStats {
  totalVisits: number;
  uniqueVisitors: number;
  avgFocusPerSession: number;
  topCountry: string;
}

interface SectionFocus {
  section_id: string;
  total_focus_ms: number;
  avg_focus_ms: number;
  total_samples: number;
}

interface RecentVisit {
  created_at: string;
  city: string;
  region: string;
  country: string;
  network_prefix: string;
  location_source: string;
  path: string;
  referrer?: string;
  utm_source?: string;
}

interface TopLocation {
  country: string;
  region: string;
  city: string;
  unique_visitors: number;
  precise_count: number;
}

const Tracking = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7');
  const [pathFilter, setPathFilter] = useState('');
  const [utmFilter, setUtmFilter] = useState('');
  
  const [summaryStats, setSummaryStats] = useState<SummaryStats>({
    totalVisits: 0,
    uniqueVisitors: 0,
    avgFocusPerSession: 0,
    topCountry: 'Unknown',
  });
  
  const [sectionFocus, setSectionFocus] = useState<SectionFocus[]>([]);
  const [recentVisits, setRecentVisits] = useState<RecentVisit[]>([]);
  const [topLocations, setTopLocations] = useState<TopLocation[]>([]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const daysAgo = parseInt(dateRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);
      const startDateStr = startDate.toISOString();

      // Total visits
      let pageviewsQuery = supabase
        .from('analytics_pageviews')
        .select('*', { count: 'exact' })
        .gte('created_at', startDateStr);
      
      if (pathFilter) {
        pageviewsQuery = pageviewsQuery.ilike('path', `%${pathFilter}%`);
      }
      if (utmFilter) {
        pageviewsQuery = pageviewsQuery.or(`utm_source.ilike.%${utmFilter}%,utm_medium.ilike.%${utmFilter}%,utm_campaign.ilike.%${utmFilter}%`);
      }

      const { count: totalVisits } = await pageviewsQuery;

      // Unique visitors
      const { data: sessions } = await supabase
        .from('analytics_sessions')
        .select('visitor_id')
        .gte('created_at', startDateStr);
      
      const uniqueVisitors = new Set(sessions?.map(s => s.visitor_id) || []).size;

      // Top country
      const { data: topCountryData } = await supabase
        .from('analytics_sessions')
        .select('country')
        .gte('created_at', startDateStr)
        .not('country', 'is', null)
        .limit(1000);
      
      const countryCounts: Record<string, number> = {};
      topCountryData?.forEach(s => {
        if (s.country) {
          countryCounts[s.country] = (countryCounts[s.country] || 0) + 1;
        }
      });
      const topCountry = Object.entries(countryCounts).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown';

      // Avg focus per session
      const { data: focusData } = await supabase
        .from('analytics_section_focus')
        .select('focus_ms, samples')
        .gte('created_at', startDateStr);
      
      const totalFocusMs = focusData?.reduce((sum, f) => sum + f.focus_ms, 0) || 0;
      const totalSamples = focusData?.reduce((sum, f) => sum + f.samples, 0) || 0;
      const avgFocusPerSession = totalSamples > 0 ? totalFocusMs / totalSamples : 0;

      setSummaryStats({
        totalVisits: totalVisits || 0,
        uniqueVisitors,
        avgFocusPerSession,
        topCountry,
      });

      // Section focus
      const { data: sectionData } = await supabase
        .from('analytics_section_focus')
        .select('section_id, focus_ms, samples')
        .gte('created_at', startDateStr);
      
      const sectionMap: Record<string, { total_focus_ms: number; total_samples: number }> = {};
      sectionData?.forEach(s => {
        if (!sectionMap[s.section_id]) {
          sectionMap[s.section_id] = { total_focus_ms: 0, total_samples: 0 };
        }
        sectionMap[s.section_id].total_focus_ms += s.focus_ms;
        sectionMap[s.section_id].total_samples += s.samples;
      });
      
      const sections: SectionFocus[] = Object.entries(sectionMap).map(([section_id, data]) => ({
        section_id,
        total_focus_ms: data.total_focus_ms,
        avg_focus_ms: data.total_samples > 0 ? data.total_focus_ms / data.total_samples : 0,
        total_samples: data.total_samples,
      })).sort((a, b) => b.total_focus_ms - a.total_focus_ms);
      
      setSectionFocus(sections);

      // Recent visits
      const { data: visitsData } = await supabase
        .from('analytics_sessions')
        .select(`
          created_at,
          city,
          region,
          country,
          network_prefix,
          location_source,
          analytics_pageviews(path, referrer, utm_source)
        `)
        .gte('created_at', startDateStr)
        .order('created_at', { ascending: false })
        .limit(50);
      
      const visits: RecentVisit[] = visitsData?.map(v => ({
        created_at: v.created_at || '',
        city: v.city || 'Unknown',
        region: v.region || 'Unknown',
        country: v.country || 'Unknown',
        network_prefix: v.network_prefix || 'Unknown',
        location_source: v.location_source || 'ip',
        path: (v.analytics_pageviews as any)?.[0]?.path || '/',
        referrer: (v.analytics_pageviews as any)?.[0]?.referrer,
        utm_source: (v.analytics_pageviews as any)?.[0]?.utm_source,
      })) || [];
      
      setRecentVisits(visits);

      // Top locations
      const { data: locationData } = await supabase
        .from('analytics_sessions')
        .select('country, region, city, visitor_id, is_precise')
        .gte('created_at', startDateStr)
        .not('country', 'is', null);
      
      const locationMap: Record<string, { visitors: Set<string>; precise: number }> = {};
      locationData?.forEach(l => {
        const key = `${l.country}|${l.region}|${l.city}`;
        if (!locationMap[key]) {
          locationMap[key] = { visitors: new Set(), precise: 0 };
        }
        locationMap[key].visitors.add(l.visitor_id);
        if (l.is_precise) {
          locationMap[key].precise++;
        }
      });
      
      const locations: TopLocation[] = Object.entries(locationMap).map(([key, data]) => {
        const [country, region, city] = key.split('|');
        return {
          country,
          region,
          city,
          unique_visitors: data.visitors.size,
          precise_count: data.precise,
        };
      }).sort((a, b) => b.unique_visitors - a.unique_visitors).slice(0, 20);
      
      setTopLocations(locations);

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch analytics data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, pathFilter, utmFilter]);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const exportToCSV = () => {
    const headers = ['Time', 'City', 'Region', 'Country', 'Network Prefix', 'Location Source', 'Path', 'Referrer', 'UTM Source'];
    const rows = recentVisits.map(v => [
      new Date(v.created_at).toLocaleString(),
      v.city,
      v.region,
      v.country,
      v.network_prefix,
      v.location_source,
      v.path,
      v.referrer || '',
      v.utm_source || '',
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: 'Export Complete',
      description: 'Analytics data exported successfully',
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-pulse text-xl">Loading analytics...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gradient">Tracking & Analytics</h1>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Last 24 hours</SelectItem>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Path Filter</label>
                <Input
                  placeholder="Filter by path..."
                  value={pathFilter}
                  onChange={(e) => setPathFilter(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">UTM Filter</label>
                <Input
                  placeholder="Filter by UTM..."
                  value={utmFilter}
                  onChange={(e) => setUtmFilter(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.totalVisits}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.uniqueVisitors}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg. Focus</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatTime(summaryStats.avgFocusPerSession)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Top Country</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.topCountry}</div>
            </CardContent>
          </Card>
        </div>

        {/* Section Focus Table */}
        <Card>
          <CardHeader>
            <CardTitle>Top Sections by Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Section ID</TableHead>
                  <TableHead>Total Focus</TableHead>
                  <TableHead>Avg/Session</TableHead>
                  <TableHead>Samples</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sectionFocus.map((section) => (
                  <TableRow key={section.section_id}>
                    <TableCell className="font-medium">{section.section_id}</TableCell>
                    <TableCell>{formatTime(section.total_focus_ms)}</TableCell>
                    <TableCell>{formatTime(section.avg_focus_ms)}</TableCell>
                    <TableCell>{section.total_samples}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Visits Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Network</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>UTM</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentVisits.map((visit, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{new Date(visit.created_at).toLocaleString()}</TableCell>
                    <TableCell>{`${visit.city}, ${visit.region}, ${visit.country}`}</TableCell>
                    <TableCell className="text-xs">{visit.network_prefix}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                        visit.location_source === 'gps' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {visit.location_source.toUpperCase()}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs">{visit.path}</TableCell>
                    <TableCell className="text-xs">{visit.utm_source || '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Locations Table */}
        <Card>
          <CardHeader>
            <CardTitle>Top Locations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Country</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Uniques</TableHead>
                  <TableHead>Precision</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topLocations.map((location, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{location.country}</TableCell>
                    <TableCell>{location.region}</TableCell>
                    <TableCell>{location.city}</TableCell>
                    <TableCell>{location.unique_visitors}</TableCell>
                    <TableCell>
                      {location.precise_count > 0 ? (
                        <span className="text-green-600">
                          {location.precise_count} Precise
                        </span>
                      ) : (
                        <span className="text-blue-600">Approx</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Tracking;
