import React from 'react';
import EmojiPicker from 'emoji-picker-react';
import { useState, useEffect, useRef } from 'react';

const EmojiPickers2 = ({ openEmoji, setopenEmoji, addToComment }: any) => {
  const emojiBox2: React.RefObject<HTMLDivElement> | null = useRef(null);
  console.log({ openEmoji });
  useEffect(() => {
    const handleclickOutside = (e: any) => {
      if (e.target.id !== 'outside') {
        if (emojiBox2.current) {
          if (emojiBox2.current && !emojiBox2?.current?.contains(e.target)) {
            setopenEmoji(false);
          }
        }
      }
    };
    document.addEventListener('click', handleclickOutside);
    return () => {
      document.removeEventListener('click', handleclickOutside);
    };
  }, []);
  return (
    <div id="outside" ref={emojiBox2} className="absolute inset-0 z-50 ">
      <EmojiPicker
        onEmojiClick={(e) => {
          addToComment((prev: any) => (prev += e.emoji));
        }}
        previewConfig={{ showPreview: false }}
      />
    </div>
  );
};

export default EmojiPickers2;
