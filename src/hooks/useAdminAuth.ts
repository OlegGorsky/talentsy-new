import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// List of admin Telegram IDs
const ADMIN_IDS = [
  '6013783385', // Add your admin Telegram IDs here
];

export function useAdminAuth() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const tg = window.Telegram?.WebApp;
        if (!tg?.initDataUnsafe?.user?.id) {
          setIsAdmin(false);
          return;
        }

        // Check if user's Telegram ID is in the admin list
        setIsAdmin(ADMIN_IDS.includes(tg.initDataUnsafe.user.id));
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, []);

  return { isAdmin, loading };
}