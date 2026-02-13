import React, { useState } from 'react';
import AssistantPanel from './AssistantPanel';

export default function AssistantBubble({ lotId }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        aria-label="Asistente Guiado"
        onClick={() => setOpen((s) => !s)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center"
      >
        🤖
      </button>

      <AssistantPanel lotId={lotId} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
