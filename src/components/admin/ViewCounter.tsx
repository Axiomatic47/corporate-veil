// src/components/admin/ViewCounter.tsx

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const ViewCounter = () => {
  const [views, setViews] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0
  });

  const fetchViewCounts = async () => {
    try {
      // Get all views
      const { data: allViews, error } = await supabase
        .from('page_views')
        .select('viewed_at');

      if (error) throw error;

      if (!allViews) return;

      const now = new Date();
      const today = new Date(now.setHours(0, 0, 0, 0));
      const thisWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      setViews({
        total: allViews.length,
        today: allViews.filter(view => new Date(view.viewed_at) >= today).length,
        thisWeek: allViews.filter(view => new Date(view.viewed_at) >= thisWeek).length,
        thisMonth: allViews.filter(view => new Date(view.viewed_at) >= thisMonth).length,
      });
    } catch (error) {
      console.error('Error fetching view counts:', error);
    }
  };

  useEffect(() => {
    fetchViewCounts();
    // Update every minute
    const interval = setInterval(fetchViewCounts, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-black/50 border border-white/20">
        <CardHeader>
          <CardTitle className="text-xl">Total Views</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{views.total.toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card className="bg-black/50 border border-white/20">
        <CardHeader>
          <CardTitle className="text-xl">Today</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{views.today.toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card className="bg-black/50 border border-white/20">
        <CardHeader>
          <CardTitle className="text-xl">This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{views.thisWeek.toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card className="bg-black/50 border border-white/20">
        <CardHeader>
          <CardTitle className="text-xl">This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{views.thisMonth.toLocaleString()}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewCounter;