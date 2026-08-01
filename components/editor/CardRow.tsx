'use client';

import { useRef, useState } from 'react';
import { Image as ImageIcon, Music, Sparkles, X, Loader2 } from 'lucide-react';
import { Flashcard } from '@/lib/types';
import { useCardEditor } from './CardEditorProvider';
import { compressImage, dataUrlToBlob } from '@/lib/imageCompression';

const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp';
const AUDIO_ACCEPT = 'audio/mpeg';

function MediaTools({
  card,
  index,
  side,
  onEnhance,
}: {
  card: Flashcard;
  index: number;
  side: 'question' | 'answer';
  onEnhance?: () => void;
}) {
  const { deckId, updateCard } = useCardEditor();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<'image' | 'audio' | null>(null);
  const [error, setError] = useState('');

  const imageField = side === 'question' ? 'questionImage' : 'answerImage';
  const audioField = side === 'question' ? 'questionAudio' : 'answerAudio';

  const upload = async (file: File, type: 'image' | 'audio') => {
    setUploading(type);
    setError('');
    try {
      let blob: Blob = file;
      if (type === 'image') {
        const compressedDataUrl = await compressImage(file, 5 * 1024 * 1024);
        blob = dataUrlToBlob(compressedDataUrl);
      }
      const formData = new FormData();
      formData.append('file', blob, file.name);
      formData.append('side', side);
      formData.append('type', type);

      const res = await fetch(`/api/decks/${deckId}/cards/${index}/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Upload failed.'); return; }
      updateCard(index, { [type === 'image' ? imageField : audioField]: data.url });
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(null);
    }
  };

  const removeMedia = async (type: 'image' | 'audio') => {
    try {
      await fetch(`/api/decks/${deckId}/cards/${index}/media`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ side, type }),
      });
    } catch {
      // Non-fatal — clear the field locally regardless
    }
    updateCard(index, { [type === 'image' ? imageField : audioField]: undefined });
  };

  return (
    <>
      <div className="card-media-tools">
        <button type="button" className="card-media-btn" title="Add an image to your Flashcard" onClick={() => imageInputRef.current?.click()} disabled={uploading !== null}>
          {uploading === 'image' ? <Loader2 size={14} className="cbr-spin" /> : <ImageIcon size={14} />}
        </button>
        <button type="button" className="card-media-btn" title="Add sound (MP3) to your Flashcard" onClick={() => audioInputRef.current?.click()} disabled={uploading !== null}>
          {uploading === 'audio' ? <Loader2 size={14} className="cbr-spin" /> : <Music size={14} />}
        </button>
        {onEnhance && (
          <button type="button" className="card-media-btn card-enhance-btn" title="Enhance this Flashcard with AI" onClick={onEnhance}>
            <Sparkles size={14} />
          </button>
        )}
        <input ref={imageInputRef} type="file" accept={IMAGE_ACCEPT} style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) upload(f, 'image'); e.target.value = ''; }} />
        <input ref={audioInputRef} type="file" accept={AUDIO_ACCEPT} style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) upload(f, 'audio'); e.target.value = ''; }} />
      </div>

      {error && <div className="card-media-error">{error}</div>}

      {card[imageField] && (
        <div className="card-image-preview">
          <img src={card[imageField]} alt="Card" />
          <button type="button" className="card-media-remove" onClick={() => removeMedia('image')} aria-label="Remove image"><X size={12} /></button>
        </div>
      )}
      {card[audioField] && (
        <div className="card-audio-preview">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <audio controls src={card[audioField]} />
          <button type="button" className="card-media-remove" onClick={() => removeMedia('audio')} aria-label="Remove audio"><X size={12} /></button>
        </div>
      )}
    </>
  );
}

export default function CardRow({
  card,
  index,
  isNew,
  onEnhance,
  registerRef,
}: {
  card: Flashcard;
  index: number;
  isNew: boolean;
  onEnhance: (index: number) => void;
  registerRef: (index: number, el: HTMLDivElement | null) => void;
}) {
  const { mode, updateCard, deleteCard, setActiveIndex } = useCardEditor();

  const advanced = mode === 'advanced';

  return (
    <div
      className={`card-row${advanced ? ' advanced' : ''}`}
      ref={el => registerRef(index, el)}
      onFocus={() => setActiveIndex(index)}
      tabIndex={0}
    >
      <div className="card-number">
        {index + 1}
        {isNew && <span className="new-badge">(new)</span>}
      </div>

      <div className="card-fields">
        <div className={`card-question-field${advanced ? ' advanced' : ''}`}>
          {advanced && (
            <input
              className="prompt-field"
              placeholder="Add Prompt:"
              value={card.questionPrompt ?? ''}
              onChange={e => updateCard(index, { questionPrompt: e.target.value })}
            />
          )}
          <div className="card-field-main">
            <span className="card-field-icon">Q</span>
            <textarea
              placeholder="Question"
              value={card.question}
              onChange={e => updateCard(index, { question: e.target.value })}
            />
          </div>
          <MediaTools card={card} index={index} side="question" onEnhance={() => onEnhance(index)} />
          {advanced && (
            <>
              <input
                className="clarifier-field"
                placeholder="(Add Clarifier)"
                value={card.questionClarifier ?? ''}
                onChange={e => updateCard(index, { questionClarifier: e.target.value })}
              />
              <input
                className="footnote-field"
                placeholder="Add Footnote"
                value={card.questionFootnote ?? ''}
                onChange={e => updateCard(index, { questionFootnote: e.target.value })}
              />
            </>
          )}
        </div>

        <div className={`card-answer-field${advanced ? ' advanced' : ''}`}>
          {advanced && (
            <input
              className="prompt-field"
              placeholder="Add Prompt:"
              value={card.answerPrompt ?? ''}
              onChange={e => updateCard(index, { answerPrompt: e.target.value })}
            />
          )}
          <div className="card-field-main">
            <span className="card-field-icon">A</span>
            <textarea
              placeholder="Answer"
              value={card.answer}
              onChange={e => updateCard(index, { answer: e.target.value })}
            />
          </div>
          <MediaTools card={card} index={index} side="answer" />
          {advanced && (
            <>
              <input
                className="clarifier-field"
                placeholder="(Add Clarifier)"
                value={card.answerClarifier ?? ''}
                onChange={e => updateCard(index, { answerClarifier: e.target.value })}
              />
              <input
                className="footnote-field"
                placeholder="Add Footnote"
                value={card.answerFootnote ?? ''}
                onChange={e => updateCard(index, { answerFootnote: e.target.value })}
              />
            </>
          )}
        </div>
      </div>

      <button type="button" className="card-delete-btn" onClick={() => deleteCard(index)} aria-label="Delete card"><X size={15} /></button>
    </div>
  );
}
