'use client';

import { ShoppingBag, Settings, Video, Calendar, FileText } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="w-full bg-[#e8f4f8]">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 py-3">
          <button className="flex items-center justify-center gap-2 bg-white px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors w-full">
            <ShoppingBag className="w-5 h-5 text-[#17a2b8] flex-shrink-0" strokeWidth={2} />
            <span className="text-[#17a2b8] font-medium text-base">Shop</span>
          </button>

          <button className="flex items-center justify-center gap-2 bg-white px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors w-full">
            <Settings className="w-5 h-5 text-[#17a2b8] flex-shrink-0" strokeWidth={2} />
            <span className="text-[#17a2b8] font-medium text-base">Services</span>
          </button>

          <button className="flex items-center justify-center gap-2 bg-white px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors w-full">
            <Video className="w-5 h-5 text-[#17a2b8] flex-shrink-0" strokeWidth={2} />
            <span className="text-[#17a2b8] font-medium text-base">Socio</span>
          </button>

          <button className="flex items-center justify-center gap-2 bg-white px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors w-full">
            <Calendar className="w-5 h-5 text-[#17a2b8] flex-shrink-0" strokeWidth={2} />
            <span className="text-[#17a2b8] font-medium text-base">Booking</span>
          </button>

          <button className="flex items-center justify-center gap-2 bg-white px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors w-full">
            <FileText className="w-5 h-5 text-[#17a2b8] flex-shrink-0" strokeWidth={2} />
            <span className="text-[#17a2b8] font-medium text-base">Classified</span>
          </button>
        </div>
      </div>
    </nav>
  );
}