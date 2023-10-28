import React from 'react';
import EmojiPicker from 'emoji-picker-react';
import { useState, useEffect, useRef } from 'react';

const EmojiPickers = ({ openEmoji, setopenEmoji, addToComment }: any) => {
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
    <div
      id="outside"
      ref={emojiBox2}
      className=" z-50 w-[360px] h-[400px] -left-5 absolute top-10"
    >
      <EmojiPicker
        width="400"
        height="100%"
        onEmojiClick={(e) => {
          addToComment((prev: any) => (prev += e.emoji));
        }}
        previewConfig={{ showPreview: false }}
      />
    </div>
  );
};

export default EmojiPickers;
