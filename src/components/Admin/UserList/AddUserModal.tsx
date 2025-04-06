import React from 'react';
import { X } from 'lucide-react';

interface NewUser {
  telegram_id: string;
  first_name: string;
  username?: string;
  points: number;
}

interface AddUserModalProps {
  user: NewUser;
  onChange: (user: NewUser) => void;
  onSubmit: () => void;
  onClose: () => void;
}

export function AddUserModal({ user, onChange, onSubmit, onClose }: AddUserModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h3 className="text-lg font-semibold mb-4">Добавить пользователя</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telegram ID *
            </label>
            <input
              type="text"
              value={user.telegram_id}
              onChange={(e) => onChange({ ...user, telegram_id: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#865df6]"
              placeholder="Например: 123456789"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Имя *
            </label>
            <input
              type="text"
              value={user.first_name}
              onChange={(e) => onChange({ ...user, first_name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#865df6]"
              placeholder="Имя пользователя"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={user.username}
              onChange={(e) => onChange({ ...user, username: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#865df6]"
              placeholder="@username"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Баллы
            </label>
            <input
              type="number"
              value={user.points}
              onChange={(e) => onChange({ ...user, points: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#865df6]"
              placeholder="0"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Отмена
          </button>
          <button
            onClick={onSubmit}
            className="bg-[#865df6] text-white px-4 py-2 rounded-lg hover:bg-[#7147f5] transition-colors"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
}