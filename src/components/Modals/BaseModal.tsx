import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { MODAL_SPACING } from '../../constants/modals';

interface BaseModalProps {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  showCloseButton?: boolean;
  maxWidth?: number;
}

export function BaseModal({ 
  title, 
  onClose, 
  children, 
  showCloseButton = true,
  maxWidth = MODAL_SPACING.CONTAINER_MAX_WIDTH 
}: BaseModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white relative flex flex-col w-full overflow-hidden"
        style={{
          maxWidth: `${maxWidth}px`,
          maxHeight: MODAL_SPACING.CONTAINER_MAX_HEIGHT,
          borderRadius: MODAL_SPACING.BORDER_RADIUS,
        }}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-900 hover:text-gray-600 transition-colors z-10"
            style={{
              width: MODAL_SPACING.CLOSE_BUTTON_SIZE,
              height: MODAL_SPACING.CLOSE_BUTTON_SIZE,
              right: MODAL_SPACING.CLOSE_BUTTON_POSITION,
              top: MODAL_SPACING.CLOSE_BUTTON_POSITION,
            }}
          >
            <X size={MODAL_SPACING.CLOSE_BUTTON_SIZE} />
          </button>
        )}

        {title && (
          <div 
            className="border-b flex-shrink-0"
            style={{
              padding: `${MODAL_SPACING.HEADER_PADDING_Y}px ${MODAL_SPACING.HEADER_PADDING_X}px`,
            }}
          >
            <h3 
              className="font-semibold text-center text-gray-900"
              style={{
                fontSize: MODAL_SPACING.HEADER_FONT_SIZE,
              }}
            >
              {title}
            </h3>
          </div>
        )}

        <div 
          className="overflow-y-auto"
          style={{
            padding: `${MODAL_SPACING.CONTENT_PADDING_Y}px ${MODAL_SPACING.CONTENT_PADDING_X}px`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}