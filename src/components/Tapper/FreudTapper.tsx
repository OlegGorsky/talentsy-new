import React, { useState, useCallback, useEffect, useRef } from 'react';
import { supabase, DB_TABLES, getCurrentUserId, dbHelpers } from '../../lib/supabase';
import { QUOTES } from './FreudQuotes';
import { TapProgress } from './TapProgress';
import { BALANCE_SPACING } from '../../constants/layout';

// Image size configuration in pixels
const IMAGE_CONFIG = {
  width: 280,
  height: 280,
  imageUrl: 'https://files.salebot.pro/uploads/file_item/file/535162/8c83f27e1029995b4d5f21487898cffd-fotor-bg-remover-2025032712659.png'
};

function FreudTapper({ points, onPointsEarned }: { points: number; onPointsEarned: (points: number) => void }) {
  const [isPressed, setIsPressed] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  const [showPoints, setShowPoints] = useState(false);
  const [pointsPosition, setPointsPosition] = useState({ x: 0, y: 0 });
  const [reachedDailyLimit, setReachedDailyLimit] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const lastTapTime = useRef(0);
  const usedQuotes = useRef<Set<string>>(new Set());
  const tapAreaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Preload Freud image
    const img = new Image();
    img.src = IMAGE_CONFIG.imageUrl;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => {
      console.error('Failed to load Freud image');
      setImageLoaded(true);
    };

    const timeoutId = setTimeout(() => {
      setImageLoaded(true);
    }, 3000);

    // Set initial quote
    const randomIndex = Math.floor(Math.random() * QUOTES.length);
    setCurrentQuote(QUOTES[randomIndex]);

    return () => clearTimeout(timeoutId);
  }, []);

  const checkDailyLimit = useCallback(async () => {
    const userId = getCurrentUserId();
    if (!userId) return;

    try {
      const tapCount = await dbHelpers.getDailyTaps(userId);
      setTapCount(tapCount);
      if (tapCount >= 10) {
        setReachedDailyLimit(true);
        setCurrentQuote("Всё! Сегодня натапались. Ничего умнее я уже не придумаю. Приходи завтра.");
      }
    } catch (error) {
      console.error('Error checking daily limit:', error);
    }
  }, []);

  useEffect(() => {
    checkDailyLimit();
  }, [checkDailyLimit]);

  const handleTap = useCallback(async (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    const now = Date.now();
    if (now - lastTapTime.current < 300) return;
    lastTapTime.current = now;

    const userId = getCurrentUserId();
    if (!userId || reachedDailyLimit) return;

    let x = 0, y = 0;
    if (tapAreaRef.current) {
      const rect = tapAreaRef.current.getBoundingClientRect();
      if ('touches' in e) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
      } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
      }
      setPointsPosition({ x, y: y - 30 });
    }

    setShowPoints(true);
    setTimeout(() => setShowPoints(false), 1500);

    let availableQuotes = QUOTES.filter(quote => !usedQuotes.current.has(quote));
    if (availableQuotes.length === 0) {
      usedQuotes.current.clear();
      availableQuotes = QUOTES;
    }
    const randomIndex = Math.floor(Math.random() * availableQuotes.length);
    const newQuote = availableQuotes[randomIndex];
    usedQuotes.current.add(newQuote);
    setCurrentQuote(newQuote);

    onPointsEarned(2);

    const tg = window.Telegram?.WebApp;
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('medium');
    }

    try {
      const canTap = await dbHelpers.incrementTaps(userId);
      if (!canTap) {
        setReachedDailyLimit(true);
        setCurrentQuote("Всё! Сегодня натапались. Ничего умнее я уже не придумаю. Приходи завтра.");
        return;
      }

      const newTapCount = tapCount + 1;
      setTapCount(newTapCount);
      
      if (newTapCount >= 10) {
        setReachedDailyLimit(true);
        setCurrentQuote("Всё! Сегодня натапались. Ничего умнее я уже не придумаю. Приходи завтра.");
      }
    } catch (error) {
      console.error('Error handling tap:', error);
    }
  }, [onPointsEarned, reachedDailyLimit, tapCount]);

  const handlePressStart = (e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsPressed(true);
    handleTap(e);
  };

  const handlePressEnd = () => {
    setIsPressed(false);
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* Quote Dialog */}
      <div className="relative w-full mb-4 h-24 flex items-center justify-center px-4 z-20">
        {currentQuote && (
          <div 
            className={`${reachedDailyLimit ? 'bg-red-500' : 'bg-[#865df6]'} text-white p-4 rounded-xl max-w-sm animate-fade-in shadow-lg relative mx-auto`}
          >
            <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent ${reachedDailyLimit ? 'border-t-red-500' : 'border-t-[#865df6]'}`} />
            <p className="text-sm italic leading-relaxed text-center font-medium">{currentQuote}</p>
          </div>
        )}
      </div>

      <div className="relative">
        {/* Glow effect */}
        <div 
          className={`absolute inset-[-20%] rounded-[50%] blur-[40px] transition-all duration-150 ease-in-out ${
            isPressed ? 'opacity-40 scale-90' : 'opacity-20 scale-100'
          } ${reachedDailyLimit ? 'bg-red-500' : 'bg-[#865df6]'}`}
          style={{
            transform: `scale(${isPressed ? 0.9 : 1})`,
            willChange: 'transform, opacity'
          }}
        />
        
        <button
          ref={tapAreaRef}
          onMouseDown={handlePressStart}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
          onTouchStart={handlePressStart}
          onTouchEnd={handlePressEnd}
          className={`relative transition-all duration-150 ease-in-out transform z-10 ${
            isPressed 
              ? 'scale-95 brightness-110' 
              : 'scale-100 hover:scale-102 hover:brightness-105'
          } ${reachedDailyLimit ? 'cursor-not-allowed' : ''}`}
          disabled={reachedDailyLimit}
          style={{
            width: `${IMAGE_CONFIG.width}px`,
            height: `${IMAGE_CONFIG.height}px`
          }}
        >
          {!imageLoaded ? (
            <div 
              className="bg-gray-200 rounded-full animate-pulse"
              style={{
                width: `${IMAGE_CONFIG.width}px`,
                height: `${IMAGE_CONFIG.height}px`
              }}
            />
          ) : (
            <img
              src={IMAGE_CONFIG.imageUrl}
              alt="Tap Freud"
              className="object-contain relative"
              draggable="false"
              style={{
                width: `${IMAGE_CONFIG.width}px`,
                height: `${IMAGE_CONFIG.height}px`
              }}
            />
          )}
          
          {showPoints && (
            <div 
              className="absolute text-[#865df6] font-bold text-2xl animate-points pointer-events-none"
              style={{
                left: `${pointsPosition.x}px`,
                top: `${pointsPosition.y}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              +2
            </div>
          )}
        </button>
      </div>

      {/* Points Balance */}
      <div 
        className="bg-white shadow-md border border-gray-100/50 rounded-full flex items-center justify-center mt-4 relative z-20"
        style={{
          padding: `${BALANCE_SPACING.PADDING_Y}px ${BALANCE_SPACING.PADDING_X}px`,
          borderRadius: BALANCE_SPACING.BORDER_RADIUS,
          marginTop: BALANCE_SPACING.TOP,
          marginBottom: BALANCE_SPACING.BOTTOM
        }}
      >
        <img 
          src="https://files.salebot.pro/uploads/file_item/file/535162/image-removebg-preview__67___1__1.png" 
          alt="Coins"
          className="object-contain"
          draggable="false"
          style={{
            width: BALANCE_SPACING.ICON_SIZE,
            height: BALANCE_SPACING.ICON_SIZE,
            marginRight: BALANCE_SPACING.GAP
          }}
        />
        <p className="font-manrope text-xl font-bold text-gray-900 no-select">
          {points === null ? '—' : points.toLocaleString()}
        </p>
      </div>

      {/* Tap Progress */}
      <TapProgress currentTaps={tapCount} maxTaps={10} />
    </div>
  );
}

export { FreudTapper }