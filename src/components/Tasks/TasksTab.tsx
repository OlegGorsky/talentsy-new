import React, { useState, useEffect } from 'react';
import { CheckCircle, BookOpen, Send, Gift, ArrowRight, X } from 'lucide-react';
import { KeywordTask } from './KeywordTask';
import { TelegramSubscriptionTask } from './TelegramSubscriptionTask';
import { Quiz } from '../Quiz/Quiz';
import { ReferralBlock } from '../Referral/ReferralBlock';
import { supabase, DB_TABLES, getCurrentUserId } from '../../lib/supabase';

interface TasksTabProps {
  onShowArticle: () => void;
}

export function TasksTab({ onShowArticle }: TasksTabProps) {
  const [selectedTask, setSelectedTask] = useState<'quiz' | 'telegram' | 'article' | 'referral' | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [telegramCompleted, setTelegramCompleted] = useState(false);
  const [keywordCompleted, setKeywordCompleted] = useState(false);
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    const checkCompletions = async () => {
      const userId = getCurrentUserId();
      if (!userId) return;

      try {
        const [
          { data: quizData },
          { data: telegramData },
          { data: userData },
          { count: referralCount }
        ] = await Promise.all([
          supabase
            .from(DB_TABLES.QUIZ_COMPLETIONS)
            .select('completed_at')
            .eq('user_id', userId)
            .maybeSingle(),
          supabase
            .from(DB_TABLES.TELEGRAM_SUBSCRIPTIONS)
            .select('subscribed_at')
            .eq('user_id', userId)
            .maybeSingle(),
          supabase
            .from(DB_TABLES.USERS)
            .select('keyword_completed')
            .eq('telegram_id', userId)
            .single(),
          supabase
            .from(DB_TABLES.REFERRALS)
            .select('*', { count: 'exact' })
            .eq('referrer_id', userId)
        ]);

        setQuizCompleted(!!quizData);
        setTelegramCompleted(!!telegramData);
        setKeywordCompleted(userData?.keyword_completed || false);
        setReferralCount(referralCount || 0);
      } catch (error) {
        console.error('Error checking completions:', error);
      }
    };

    checkCompletions();

    const channels = [
      DB_TABLES.QUIZ_COMPLETIONS,
      DB_TABLES.TELEGRAM_SUBSCRIPTIONS,
      DB_TABLES.USERS,
      DB_TABLES.REFERRALS
    ].map(table => 
      supabase
        .channel(`${table}_changes`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table },
          () => checkCompletions()
        )
        .subscribe()
    );

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="p-4">
        <div className="bg-[#865df6] text-white p-4 rounded-lg">
          <div className="flex items-center space-x-3">
            <CheckCircle size={24} />
            <div>
              <h2 className="text-lg font-semibold">Задания</h2>
              <p className="text-sm opacity-90">Выполняйте задания и получайте баллы</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="p-4">
        <div className="space-y-3">
          {/* Quiz Task */}
          <button
            onClick={() => setSelectedTask('quiz')}
            className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow transition-shadow relative overflow-hidden"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600">
                <BookOpen size={24} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-gray-900">Пройдите опрос</h3>
                <div className="flex items-center mt-1">
                  <div className="flex items-center text-[#865df6] text-sm">
                    <Gift size={14} className="mr-1" />
                    <span>200 баллов</span>
                  </div>
                  {quizCompleted && (
                    <div className="ml-3 bg-green-50 text-green-600 text-xs px-2 py-0.5 rounded-full">
                      Выполнено
                    </div>
                  )}
                </div>
              </div>
              <ArrowRight size={20} className="text-gray-400 flex-shrink-0" />
            </div>
            {quizCompleted && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500" />
            )}
          </button>

          {/* Article Task */}
          <button
            onClick={() => setSelectedTask('article')}
            className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow transition-shadow relative overflow-hidden"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-50 text-green-600">
                <BookOpen size={24} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-gray-900">Введи ключевое слово</h3>
                <div className="flex items-center mt-1">
                  <div className="flex items-center text-[#865df6] text-sm">
                    <Gift size={14} className="mr-1" />
                    <span>100 баллов</span>
                  </div>
                  {keywordCompleted && (
                    <div className="ml-3 bg-green-50 text-green-600 text-xs px-2 py-0.5 rounded-full">
                      Выполнено
                    </div>
                  )}
                </div>
              </div>
              <ArrowRight size={20} className="text-gray-400 flex-shrink-0" />
            </div>
            {keywordCompleted && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500" />
            )}
          </button>

          {/* Telegram Task */}
          <button
            onClick={() => setSelectedTask('telegram')}
            className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow transition-shadow relative overflow-hidden"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-pink-50 text-pink-600">
                <Send size={24} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-gray-900">Подпишись на Телеграм-канал</h3>
                <div className="flex items-center mt-1">
                  <div className="flex items-center text-[#865df6] text-sm">
                    <Gift size={14} className="mr-1" />
                    <span>150 баллов</span>
                  </div>
                  {telegramCompleted && (
                    <div className="ml-3 bg-green-50 text-green-600 text-xs px-2 py-0.5 rounded-full">
                      Выполнено
                    </div>
                  )}
                </div>
              </div>
              <ArrowRight size={20} className="text-gray-400 flex-shrink-0" />
            </div>
            {telegramCompleted && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500" />
            )}
          </button>

          {/* Referral Task */}
          <button
            onClick={() => setSelectedTask('referral')}
            className="w-full bg-white rounded-xl p-4 shadow-sm hover:shadow transition-shadow relative overflow-hidden"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
                <Gift size={24} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-gray-900">Приглашайте друзей</h3>
                <div className="flex items-center mt-1">
                  <div className="flex items-center text-[#865df6] text-sm">
                    <Gift size={14} className="mr-1" />
                    <span>100 баллов за каждого</span>
                  </div>
                  {referralCount > 0 && (
                    <div className="ml-3 bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                      {referralCount} друзей
                    </div>
                  )}
                </div>
              </div>
              <ArrowRight size={20} className="text-gray-400 flex-shrink-0" />
            </div>
          </button>
        </div>
      </div>

      {/* Task Modals */}
      {selectedTask === 'quiz' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
            <div className="bg-[#865df6] text-white p-6 relative">
              <button
                onClick={() => setSelectedTask(null)}
                className="absolute right-4 top-4 text-white hover:text-white/80 transition-colors"
              >
                <X size={24} />
              </button>
              <h3 className="text-xl font-semibold">Пройдите опрос</h3>
              <p className="text-sm mt-1 opacity-90">Ответьте на несколько вопросов о Talentsy</p>
              <div className="mt-3 inline-flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
                <Gift size={16} className="mr-1" />
                <span className="text-sm font-medium">200 баллов</span>
              </div>
            </div>
            <div className="p-6">
              {quizCompleted ? (
                <div className="bg-green-50 text-green-700 p-6 rounded-lg text-center">
                  <CheckCircle className="mx-auto mb-4" size={32} />
                  <h3 className="text-lg font-semibold mb-2">Опрос пройден!</h3>
                  <p className="text-sm mb-4">Вы уже получили 200 баллов за прохождение опроса</p>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Закрыть
                  </button>
                </div>
              ) : (
                <Quiz onComplete={() => {
                  setQuizCompleted(true);
                  setSelectedTask(null);
                }} onClose={() => setSelectedTask(null)} />
              )}
            </div>
          </div>
        </div>
      )}

      {selectedTask === 'telegram' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
            <div className="bg-[#865df6] text-white p-6 relative">
              <button
                onClick={() => setSelectedTask(null)}
                className="absolute right-4 top-4 text-white hover:text-white/80 transition-colors"
              >
                <X size={24} />
              </button>
              <h3 className="text-xl font-semibold">Подпишись на Телеграм-канал</h3>
              <p className="text-sm mt-1 opacity-90">Подпишитесь на наш Telegram канал и получите баллы</p>
              <div className="mt-3 inline-flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
                <Gift size={16} className="mr-1" />
                <span className="text-sm font-medium">150 баллов</span>
              </div>
            </div>
            <div className="p-6">
              <TelegramSubscriptionTask channelUsername="talentsy_official" />
            </div>
          </div>
        </div>
      )}

      {selectedTask === 'article' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
            <div className="bg-[#865df6] text-white p-6 relative">
              <button
                onClick={() => setSelectedTask(null)}
                className="absolute right-4 top-4 text-white hover:text-white/80 transition-colors"
              >
                <X size={24} />
              </button>
              <h3 className="text-xl font-semibold">Введи ключевое слово</h3>
              <p className="text-sm mt-1 opacity-90">Прочитай статью, найди ключевое слово и напиши его ниже</p>
              <div className="mt-3 inline-flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
                <Gift size={16} className="mr-1" />
                <span className="text-sm font-medium">100 баллов</span>
              </div>
            </div>
            <div className="p-6">
              <KeywordTask onShowArticle={onShowArticle} />
            </div>
          </div>
        </div>
      )}

      {selectedTask === 'referral' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md overflow-hidden">
            <div className="bg-[#865df6] text-white p-6 relative">
              <button
                onClick={() => setSelectedTask(null)}
                className="absolute right-4 top-4 text-white hover:text-white/80 transition-colors"
              >
                <X size={24} />
              </button>
              <h3 className="text-xl font-semibold">Приглашайте друзей</h3>
              <p className="text-sm mt-1 opacity-90">За каждого приглашенного друга вы получите 100 баллов</p>
              <div className="mt-3 inline-flex items-center bg-white bg-opacity-20 px-3 py-1 rounded-full">
                <Gift size={16} className="mr-1" />
                <span className="text-sm font-medium">100 баллов</span>
              </div>
            </div>
            <div className="p-6">
              <ReferralBlock
                invitedCount={referralCount}
                onShare={() => {}}
                onCopy={() => {}}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}