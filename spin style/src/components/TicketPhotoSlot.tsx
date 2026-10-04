import React, { useRef } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import { sounds } from '../utils/sound';

interface TicketPhotoSlotProps {
  photoUrl: string | null | undefined;
  onPhotoChange: (url: string | null) => void;
}

export const TicketPhotoSlot: React.FC<TicketPhotoSlotProps> = ({
  photoUrl,
  onPhotoChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        onPhotoChange(result);
        sounds.playPop(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full flex justify-center my-3">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelected}
        className="hidden"
      />

      {photoUrl ? (
        /* Pinned Polaroid with Couple Photo */
        <div className="relative group p-2 pb-5 bg-white border-2 border-gray-200 shadow-md rounded-md transform rotate-[-2deg] max-w-[200px] transition-transform hover:rotate-0">
          {/* Tape Accent */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 bg-amber-200/80 border border-amber-300/60 rotate-1 shadow-sm backdrop-blur-[1px]" />
          
          <img
            src={photoUrl}
            alt="Date Keepsake Photo"
            className="w-full h-32 object-cover rounded-sm border border-gray-100"
          />
          <p className="text-[10px] font-mono-ticket text-gray-500 text-center mt-2 font-bold tracking-wider">
            ★ US TWO ★
          </p>

          {/* Action buttons on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-full bg-white text-gray-800 hover:text-carnival-pink shadow-md"
              title="Change photo"
            >
              <Camera className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                onPhotoChange(null);
                sounds.playPop(false);
              }}
              className="p-1.5 rounded-full bg-white text-red-600 hover:text-red-800 shadow-md"
              title="Remove photo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Add Photo Button Badge */
        <button
          type="button"
          onClick={() => {
            sounds.playPop(true);
            fileInputRef.current?.click();
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-dashed border-carnival-gold/80 text-carnival-bg text-xs font-mono-ticket hover:bg-amber-100 transition-all hover:scale-105 shadow-sm"
        >
          <Camera className="w-3.5 h-3.5 text-carnival-pink" />
          <span>+ Add our photo to ticket 📸</span>
        </button>
      )}
    </div>
  );
};
