import { useState, useEffect } from 'react';
import { supabase, DB_TABLES, getCurrentUserId } from '../lib/supabase';

export function useKeywordCompletion() {
  const [completed, setCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkCompletion = async () => {
      const userId = getCurrentUserId();
      if (!userId) return;

      try {
        const { data, error } = await supabase
          .from(DB_TABLES.USERS)
          .select('keyword_completed')
          .eq('telegram_id', userId)
          .single();

        if (error) throw error;
        setCompleted(data?.keyword_completed || false);
      } catch (error) {
        console.error('Error checking keyword completion:', error);
      }
    };

    checkCompletion();
  }, []);

  const submitKeyword = async (keyword: string) => {
    const userId = getCurrentUserId();
    if (!userId || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (keyword.toLowerCase() !== 'talentsy') {
        throw new Error('Неверное ключевое слово');
      }

      const { error } = await supabase
        .from(DB_TABLES.USERS)
        .update({ keyword_completed: true })
        .eq('telegram_id', userId);

      if (error) throw error;

      // Add points
      await supabase.rpc('add_campaign_points', {
        user_id_param: userId,
        points_to_add: 100
      });

      setCompleted(true);
    } catch (error) {
      throw error instanceof Error ? error : new Error('Произошла ошибка');
    } finally {
      setIsSubmitting(false);
    }
  };

  return { completed, isSubmitting, submitKeyword };
}