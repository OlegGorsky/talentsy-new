import React from 'react';
import { TITLE_SPACING } from '../../constants/title';

export function FreudTitle() {
  return (
    <div 
      className="flex justify-center items-center w-full overflow-visible"
      style={{
        marginTop: TITLE_SPACING.CONTAINER_MARGIN_TOP,
        marginBottom: TITLE_SPACING.CONTAINER_MARGIN_BOTTOM
      }}
    >
      <div 
        className="w-full"
        style={{
          padding: `${TITLE_SPACING.CONTAINER_PADDING_Y}px ${TITLE_SPACING.CONTAINER_PADDING_X}px`,
        }}
      >
        <p 
          className="font-atyp font-bold bg-gradient-to-r from-[#865df6] to-[#7147f5] bg-clip-text text-transparent drop-shadow-sm whitespace-nowrap no-select text-center"
          style={{
            fontSize: `${TITLE_SPACING.TEXT_SIZE}px`,
            lineHeight: `${TITLE_SPACING.TEXT_LINE_HEIGHT}px`,
            letterSpacing: `${TITLE_SPACING.TEXT_LETTER_SPACING}px`,
            textShadow: `${TITLE_SPACING.SHADOW_OFFSET}px ${TITLE_SPACING.SHADOW_OFFSET}px ${TITLE_SPACING.SHADOW_BLUR}px rgba(0,0,0,0.1)`,
            transform: 'scale(1)',
            transformOrigin: 'center center'
          }}
        >
          Тапай по Фрейду!
        </p>
      </div>
    </div>
  );
}