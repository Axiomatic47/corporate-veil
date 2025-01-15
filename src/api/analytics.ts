// src/api/analytics.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const GET = async (request) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const { data, error } = await supabase
      .from('page_views')
      .select('viewed_at');

    if (error) throw error;

    const views = {
      total: data?.length || 0,
      today: data?.filter(view => new Date(view.viewed_at) >= startOfDay).length || 0,
      thisWeek: data?.filter(view => new Date(view.viewed_at) >= startOfWeek).length || 0,
      thisMonth: data?.filter(view => new Date(view.viewed_at) >= startOfMonth).length || 0
    };

    return new Response(JSON.stringify(views), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error getting view counts:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch analytics data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};

export const POST = async (request) => {
  try {
    const { path } = await request.json();
    const { error } = await supabase
      .from('page_views')
      .insert([{ path, viewed_at: new Date().toISOString() }]);

    if (error) throw error;

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error recording page view:', error);
    return new Response(JSON.stringify({ error: 'Failed to record page view' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};