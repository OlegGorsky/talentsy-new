import React, { useState } from 'react';
import { FreudTapper } from './Tapper/FreudTapper';
import { usePoints } from '../hooks/usePoints';
import { RulesModal } from './Modals/RulesModal';
import { FreudTitle } from './Tapper/FreudTitle';

interface HomeContentProps {
  prizes: Array<{
    id: number;
    name: string;
    points: number;
    description: string;
  }>;
  onPrizeSelect: (prize: any) => void;
  onShare: () => void;
  onCopy: () => void;
}

export function HomeContent({ onShare, onCopy }: HomeContentProps) {
  const { points, setPoints } = usePoints();
  const [showRules, setShowRules] = useState(false);

  const handlePointsEarned = (earnedPoints: number) => {
    setPoints(prev => (prev || 0) + earnedPoints);
  };

  return (
    <div className="px-4 md:px-6 lg:px-8 max-w-2xl mx-auto">
      {/* Title */}
      <div className="mt-4">
        <FreudTitle />
      </div>

      {/* Freud Tapper with Points */}
      <div className="mt-2 md:mt-4 freud-tapper-section">
        <FreudTapper points={points} onPointsEarned={handlePointsEarned} />
      </div>

      {/* Rules Modal */}
      {showRules && <RulesModal onClose={() => setShowRules(false)} />}
    </div>
  );
}