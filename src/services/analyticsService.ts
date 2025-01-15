// src/services/analyticsService.ts

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export interface ViewCount {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
}

export const analyticsService = {
  async recordPageView(path: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('page_views')
        .insert([
          {
            path,
            viewed_at: new Date().toISOString(),
          },
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error recording page view:', error);
    }
  },

  async getViewCounts(): Promise<ViewCount> {
    try {
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

      const { data, error } = await supabase
        .from('page_views')
        .select('viewed_at')
        .order('viewed_at', { ascending: false });

      if (error) throw error;

      if (!data) return { total: 0, today: 0, thisWeek: 0, thisMonth: 0 };

      return {
        total: data.length,
        today: data.filter(view => view.viewed_at >= startOfDay).length,
        thisWeek: data.filter(view => view.viewed_at >= startOfWeek).length,
        thisMonth: data.filter(view => view.viewed_at >= startOfMonth).length,
      };
    } catch (error) {
      console.error('Error getting view counts:', error);
      return { total: 0, today: 0, thisWeek: 0, thisMonth: 0 };
    }
  },
};