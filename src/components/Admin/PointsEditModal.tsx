import React, { useState } from 'react';
import { X } from 'lucide-react';

interface PointsEditModalProps {
  user: {
    telegram_id: string;
    first_name: string;
    points: number;
  };
  onClose: () => void;
  onSave: (userId: string, points: number) => void;
}

export function PointsEditModal({ user, onClose, onSave }: PointsEditModalProps) {
  const [points, setPoints] = useState(user.points.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const newPoints = parseInt(points);
    if (isNaN(newPoints)) {
      alert('Пожалуйста, введите корректное число');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(user.telegram_id, newPoints);
      onClose();
    } catch (error) {
      console.error('Error updating points:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-semibold">Изменить баллы</h3>
            <p className="text-sm text-gray-500 mt-1">Пользователь: {user.first_name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Количество баллов
            </label>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#865df6]"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-[#865df6] text-white px-4 py-2 rounded-lg hover:bg-[#7147f5] transition-colors disabled:opacity-50"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}