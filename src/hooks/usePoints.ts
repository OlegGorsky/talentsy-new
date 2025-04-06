import { useState, useEffect } from 'react';
import { supabase, DB_TABLES, getCurrentUserId } from '../lib/supabase';

export function usePoints() {
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoints = async () => {
      const userId = getCurrentUserId();
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from(DB_TABLES.USERS)
          .select('points')
          .eq('telegram_id', userId)
          .single();

        if (error) throw error;
        setPoints(data.points || 0);
      } catch (error) {
        console.error('Error fetching points:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();

    // Subscribe to points changes
    const userId = getCurrentUserId();
    if (userId) {
      const channel = supabase
        .channel('user_points')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: DB_TABLES.USERS,
            filter: `telegram_id=eq.${userId}`,
          },
          (payload: any) => {
            if (payload.new.points !== undefined) {
              setPoints(payload.new.points);
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  return { points, setPoints, loading };
}