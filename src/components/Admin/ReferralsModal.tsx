import React, { useState, useEffect } from 'react';
import { X, User, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ReferralUser {
  telegram_id: string;
  first_name: string;
  username?: string;
  avatar_url?: string;
}

interface ReferralsModalProps {
  user: {
    telegram_id: string;
    first_name: string;
  };
  onClose: () => void;
  selectedMonth: Date;
}

export function ReferralsModal({ user, onClose, selectedMonth }: ReferralsModalProps) {
  const [referrals, setReferrals] = useState<ReferralUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const getTableName = (table: string) => {
    const isAprilCampaign = selectedMonth.getMonth() === 3;
    const prefix = isAprilCampaign ? 'campaign_' : '';
    return `${prefix}${table}`;
  };

  const fetchReferrals = async () => {
    try {
      const { data, error } = await supabase
        .from(getTableName('referrals'))
        .select(`
          referred:${getTableName('users')}!referrals_referred_id_fkey (
            telegram_id,
            first_name,
            username,
            avatar_url
          )
        `)
        .eq('referrer_id', user.telegram_id);

      if (error) throw error;

      setReferrals(data?.map(r => r.referred) || []);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReferrals();
  }, [user.telegram_id, selectedMonth]);

  const handleDeleteReferral = async (referredId: string) => {
    if (isDeleting) return;
    if (!confirm('Вы уверены, что хотите удалить этого реферала?')) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from(getTableName('referrals'))
        .delete()
        .eq('referrer_id', user.telegram_id)
        .eq('referred_id', referredId);

      if (error) throw error;
      
      // Update local state
      setReferrals(referrals.filter(r => r.telegram_id !== referredId));
    } catch (error) {
      console.error('Error deleting referral:', error);
      alert('Ошибка при удалении реферала');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-sm">
        <div className="p-4 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">Рефералы</h3>
              <p className="text-sm text-gray-500 mt-1">Пользователь: {user.first_name}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
          <div className="p-4">
            {loading ? (
              <div className="text-center py-4">
                <div className="w-8 h-8 border-2 border-[#865df6] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-500 mt-2">Загрузка рефералов...</p>
              </div>
            ) : referrals.length > 0 ? (
              <div className="space-y-3">
                {referrals.map((referral) => (
                  <div key={referral.telegram_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 min-w-0">
                      {referral.avatar_url ? (
                        <img
                          src={referral.avatar_url}
                          alt={referral.first_name}
                          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <User size={16} className="text-gray-400" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-medium truncate">{referral.first_name}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {referral.username ? `@${referral.username}` : 'Нет username'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteReferral(referral.telegram_id)}
                      disabled={isDeleting}
                      className="ml-2 p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                У пользователя нет рефералов
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}