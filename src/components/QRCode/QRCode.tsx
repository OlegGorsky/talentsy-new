import React from 'react';
import { QrCode, Smartphone, ExternalLink } from 'lucide-react';
import { Logo } from '../Logo/Logo';

export function QRCode() {
  const appUrl = 'https://t.me/talentsy_kds_bot/app';
  
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="max-w-sm w-full text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Logo className="w-32 h-auto" />
        </div>

        {/* Title and Description */}
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-[#865df6] bg-opacity-5 p-3 rounded-full">
            <Smartphone className="text-[#865df6] w-8 h-8" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">
            Откройте в мобильном приложении
          </h1>
          <p className="text-sm text-gray-600">
            Отсканируйте QR-код камерой телефона или нажмите на кнопку, чтобы открыть приложение в Telegram
          </p>
        </div>

        {/* QR Code */}
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
          <div className="relative group">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(appUrl)}&bgcolor=FFFFFF&color=865df6&margin=2`}
              alt="QR Code"
              className="w-48 h-48 mx-auto transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#865df6] bg-opacity-5 rounded-lg transition-opacity duration-300 opacity-0 group-hover:opacity-100" />
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-4">
          <div className="flex items-center justify-center text-[#865df6] bg-[#865df6] bg-opacity-5 p-3 rounded-xl">
            <QrCode size={20} className="mr-2" />
            <span className="font-medium text-sm">Наведите камеру на QR-код</span>
          </div>

          <div className="flex items-center justify-center">
            <span className="text-gray-400 text-sm px-3">или</span>
          </div>

          <a
            href={appUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full bg-[#865df6] text-white py-3 px-6 rounded-xl font-medium hover:bg-[#7147f5] transition-colors"
          >
            <ExternalLink size={20} className="mr-2" />
            Открыть в Telegram
          </a>
        </div>
      </div>
    </div>
  );
}