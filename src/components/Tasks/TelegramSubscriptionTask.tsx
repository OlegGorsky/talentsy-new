import React, { useState, useEffect } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { supabase, DB_TABLES, getCurrentUserId } from '../../lib/supabase';

interface TelegramSubscriptionTaskProps {
  channelUsername: string;
}

export function TelegramSubscriptionTask({ channelUsername }: TelegramSubscriptionTaskProps) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSubscriptionStatus();
  }, []);

  const checkSubscriptionStatus = async () => {
    const userId = getCurrentUserId();
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from(DB_TABLES.TELEGRAM_SUBSCRIPTIONS)
        .select('subscribed_at')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      setIsSubscribed(!!data);
    } catch (error) {
      console.error('Error checking subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifySubscription = async () => {
    const userId = getCurrentUserId();
    if (!userId || isChecking) return;

    setIsChecking(true);
    try {
      // Check if user already has subscription
      const { data: existingSubscription } = await supabase
        .from(DB_TABLES.TELEGRAM_SUBSCRIPTIONS)
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existingSubscription) {
        setIsSubscribed(true);
        alert('Вы уже получили баллы за подписку на канал');
        return;
      }

      // Verify subscription with Telegram
      try {
        const response = await fetch(`https://api.telegram.org/bot${import.meta.env.VITE_TELEGRAM_BOT_TOKEN}/getChatMember`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: '@' + channelUsername,
            user_id: parseInt(userId)
          })
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        if (data.ok && ['member', 'administrator', 'creator'].includes(data.result.status)) {
          // First update user points
          const { error: pointsError } = await supabase.rpc('add_campaign_points', {
            user_id_param: userId,
            points_to_add: 150
          });

          if (pointsError) throw pointsError;

          // Then record subscription
          const { error: subscriptionError } = await supabase
            .from(DB_TABLES.TELEGRAM_SUBSCRIPTIONS)
            .insert([{
              user_id: userId
            }]);

          if (subscriptionError) throw subscriptionError;

          setIsSubscribed(true);
        } else {
          alert('Пожалуйста, подпишитесь на канал, чтобы получить баллы');
        }
      } catch (error) {
        console.error('Error verifying subscription:', error);
        alert('Произошла ошибка при проверке подписки. Пожалуйста, попробуйте позже.');
      }
    } catch (error) {
      console.error('Error during subscription verification:', error);
      alert('Произошла ошибка. Пожалуйста, попробуйте позже.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubscribeClick = () => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.openTelegramLink('https://t.me/' + channelUsername);
    } else {
      window.open('https://t.me/' + channelUsername, '_blank');
    }
  };

  if (loading) {
    return <div className="animate-pulse bg-gray-100 h-32 rounded-lg"></div>;
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleSubscribeClick}
        className="w-full bg-[#865df6] text-white py-2.5 rounded-lg font-medium hover:bg-[#7147f5] transition-colors flex items-center justify-center"
      >
        <Send size={18} className="mr-2" />
        {isSubscribed ? 'Перейти в ТГ-канал' : 'Подписаться на канал'}
      </button>
      
      {!isSubscribed && (
        <button
          onClick={verifySubscription}
          disabled={isChecking}
          className={`w-full bg-white border border-[#865df6] text-[#865df6] py-2.5 rounded-lg font-medium transition-colors ${
            isChecking ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#865df6] hover:text-white'
          }`}
        >
          {isChecking ? 'Проверяем...' : 'Проверить подписку'}
        </button>
      )}

      {isSubscribed && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg text-center">
          <CheckCircle className="mx-auto mb-2" size={24} />
          <p className="font-medium">Вы подписаны на канал!</p>
          <p className="text-sm">Вы получили 150 баллов</p>
        </div>
      )}
    </div>
  );
}