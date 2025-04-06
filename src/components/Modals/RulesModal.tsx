import React from 'react';
import { X } from 'lucide-react';
import { BaseModal } from './BaseModal';
import { MODAL_SPACING } from '../../constants/modals';

interface RulesModalProps {
  onClose: () => void;
}

export function RulesModal({ onClose }: RulesModalProps) {
  return (
    <BaseModal
      title="Правила розыгрыша от Talentsy!"
      onClose={onClose}
    >
      <div 
        className="space-y-3"
        style={{ gap: MODAL_SPACING.CONTENT_GAP }}
      >
        <div className="space-y-2">
          {[
            'В розыгрыше могут принять участие все желающие, не важно учились вы в нашем онлайн-университете или нет.',
            'Выигрыш составляет 20.000 рублей и будет распределен среди пяти участников, собравших наибольшее количество баллов.',
            'Баллы начисляются за выполнение несложных заданий и приглашение друзей в это приложение розыгрыша.',
            'Свою ссылку для приглашения можно скопировать ниже в реферальном блоке или отправить ее сразу своим контактам в Телеграм.',
            'Кроме того, вы можете обменять накопленные баллы на полезные материалы от Talentsy на вкладке "Магазин".',
            'На вкладке "Рейтинг" вы можете узнать свой статус в турнирной таблице и посмотреть, кто сколько уже заработал баллов, чтоб оценить свои шансы на победу.',
            'В этом блоке на главной странице также видно количество накопленных баллов.',
            'также подписывайтесь на наши соцсети, если еще не подписаны - нажмите на плашку "Подпишись" в правом верхнем углу.'
          ].map((rule, index) => (
            <div key={index} className="flex items-start text-xs">
              <span className="text-[#865df6] font-medium mr-1.5 flex-shrink-0">{index + 1}.</span>
              <p className="text-gray-900">{rule}</p>
            </div>
          ))}
        </div>

        <div 
          className="border-t mt-3 -mx-4 px-4"
          style={{
            marginTop: MODAL_SPACING.CONTENT_GAP,
            padding: `${MODAL_SPACING.FOOTER_PADDING_Y}px ${MODAL_SPACING.FOOTER_PADDING_X}px`,
          }}
        >
          <button
            onClick={onClose}
            className="w-full bg-[#865df6] text-white font-medium hover:bg-[#7147f5] transition-colors rounded-lg"
            style={{
              height: MODAL_SPACING.FOOTER_BUTTON_HEIGHT,
            }}
          >
            Понятно
          </button>
        </div>
      </div>
    </BaseModal>
  );
}