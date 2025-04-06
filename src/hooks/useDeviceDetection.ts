import { useState, useEffect } from 'react';
import { supabase, DB_TABLES, getCurrentUserId } from '../lib/supabase';

export function useDeviceDetection() {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const detectDevice = async () => {
      const tg = window.Telegram?.WebApp;
      
      // Log Telegram WebApp info for debugging
      console.log('Telegram WebApp Info:', tg);
      
      // If we're in Telegram WebApp, use its platform info
      if (tg?.platform) {
        // Desktop platforms in Telegram
        const desktopPlatforms = ['macos', 'linux', 'windows', 'tdesktop'];
        
        // Check if platform is desktop
        const isMobile = !desktopPlatforms.includes(tg.platform.toLowerCase());
        
        // Log detection results
        console.log('Device detection (Telegram):', {
          platform: tg.platform,
          isMobile,
          desktopPlatforms
        });

        // Initialize user in campaign_users if needed
        const userId = getCurrentUserId();
        if (userId) {
          try {
            const { data: existingUser } = await supabase
              .from(DB_TABLES.USERS)
              .select('id')
              .eq('telegram_id', userId)
              .single();

            if (!existingUser) {
              await supabase
                .from(DB_TABLES.USERS)
                .insert([{
                  telegram_id: userId,
                  first_name: tg.initDataUnsafe.user?.first_name || 'Unknown',
                  username: tg.initDataUnsafe.user?.username,
                  avatar_url: tg.initDataUnsafe.user?.photo_url,
                  start_data: tg.initDataUnsafe.start_param ? JSON.parse(atob(tg.initDataUnsafe.start_param)) : null
                }]);
            }
          } catch (error) {
            console.error('Error initializing user:', error);
          }
        }
        
        setIsMobileDevice(isMobile);
        setIsLoading(false);
        return;
      }

      // Fallback detection for non-Telegram environments
      const userAgent = navigator.userAgent.toLowerCase();
      
      // Check for common mobile keywords
      const mobileKeywords = [
        'android',
        'webos',
        'iphone',
        'ipad',
        'ipod',
        'blackberry',
        'windows phone'
      ];
      
      const isMobile = mobileKeywords.some(keyword => userAgent.includes(keyword)) ||
        // Check for mobile-specific features
        ('ontouchstart' in window && window.innerWidth <= 768);

      // Log detection results
      console.log('Device Detection Results:', {
        userAgent,
        isMobile,
        innerWidth: window.innerWidth,
        hasTouch: 'ontouchstart' in window
      });

      setIsMobileDevice(isMobile);
      setIsLoading(false);
    };

    detectDevice();

    // Re-check on resize
    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  return { isMobileDevice, isLoading };
}