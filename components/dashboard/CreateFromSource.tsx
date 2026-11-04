'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, FileText, X, Zap } from 'lucide-react';
import { useDashboard } from '@/lib/dashboard-context';
import { PLANS } from '@/lib/plans';
import { readFile, UploadedFile } from '@/components/InputSection';
import { MAX_PAYLOAD_BYTES } from '@/lib/imageCompression';
import GeneratingLoader from '@/components/GeneratingLoader';

export type CreateSourceMode = 'paste' | 'upload' | 'topic';

const MIN_PASTE_CHARS = 150;
const TOPIC_CHIPS = ['Photosynthesis', 'The French Revolution', 'Algebra basics'];

const COPY: Record<CreateSourceMode, { title: string; note: string }> = {
  paste: { title: 'Paste your notes', note: 'Paste a big batch of text and we’ll turn it into flashcards.' },
  upload: { title: 'Upload documents', note: 'Add PDFs, Word docs, text files or photos of your notes.' },
  topic: { title: 'Generate from a topic', note: 'Tell us what you’re studying and we’ll write the deck for you.' },
};

// Native dashboard version of the homepage generator: same API, dashboard styling,
// and the new deck is saved straight into the user's account (and Set, if any).
export default function CreateFromSource({ mode, classId }: { mode: CreateSourceMode; classId: string | null }) {
  const router = useRouter();
  const { handleDeckSaved, planData, setUpgradeOpen, refetchClasses } = useDashboard();
  const charLimit = PLANS[planData?.plan ?? 'free'].charLimit;

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [topic, setTopic] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [fileError, setFileError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsUpgrade, setNeedsUpgrade] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const trimmed = text.trim();
  const canSubmit =
    mode === 'paste' ? trimmed.length >= MIN_PASTE_CHARS :
    mode === 'upload' ? files.length > 0 :
    topic.trim().length >= 3;

  const handleFiles = async (list: FileList) => {
    setFileError('');
    let total = files.reduce((sum, f) => sum + f.content.length, 0);
    const added: UploadedFile[] = [];
    const errors: string[] = [];
    for (const file of Array.from(list)) {
      try {
        const uploaded = await readFile(file);
        if (total + uploaded.content.length > MAX_PAYLOAD_BYTES) {
          errors.push(`"${file.name}" was skipped — it would push the combined upload over the size limit.`);
          continue;
        }
        total += uploaded.content.length;
        added.push(uploaded);
      } catch (err) {
        errors.push(err instanceof Error ? err.message : `Failed to read "${file.name}".`);
      }
    }
    if (added.length) setFiles(prev => [...prev, ...added]);
    if (errors.length) setFileError(errors.join(' '));
  };

  const defaultTitle = () => {
    if (mode === 'topic') return topic.trim().charAt(0).toUpperCase() + topic.trim().slice(1);
    if (mode === 'upload' && files[0]) return files[0].name.replace(/\.[^.]+$/, '');
    return 'My Deck';
  };

  const handleCreate = async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    setError('');
    setNeedsUpgrade(false);
    try {
      const body =
        mode === 'topic' ? { content: '', topic: topic.trim(), generationMode: 'prompt' } :
        mode === 'paste' ? { content: text } :
        { content: files.length === 1 ? files[0].content : files.map(f => f.content) };

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setNeedsUpgrade(!!data.upgradeRequired || res.status === 403);
        return;
      }

      const saveRes = await fetch('/api/decks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim() || defaultTitle(),
          topic: mode === 'topic' ? topic.trim() : undefined,
          flashcards: data.flashcards,
          classId,
        }),
      });
      const saveData = await saveRes.json();
      if (!saveRes.ok) {
        setError(saveData.error || 'Your cards were created but could not be saved. Please try again.');
        return;
      }
      handleDeckSaved(saveData.deck);
      if (classId) await refetchClasses();
      router.push(`/dashboard/decks/${saveData.deck.id}/edit`);
    } catch {
      setError('Failed to connect. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <GeneratingLoader />;

  return (
    <div>
      <div className="modal-title" style={{ textAlign: 'center' }}>{COPY[mode].title}</div>
      <p className="modal-note" style={{ marginBottom: '1.25rem', textAlign: 'center' }}>{COPY[mode].note}</p>

      <label className="modal-field-label">Deck title (optional)</label>
      <input
        className="deck-name-input"
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Name your deck"
      />

      {mode === 'paste' && (
        <>
          <textarea
            className="deck-name-input modal-textarea import-textarea"
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Paste your study notes, lecture content, or any text here..."
            rows={10}
          />
          <div className="source-hint" style={{ color: text.length > charLimit ? '#c00' : undefined }}>
            {text.length.toLocaleString()} / {charLimit.toLocaleString()} characters
            {trimmed.length > 0 && trimmed.length < MIN_PASTE_CHARS && ` · add ${MIN_PASTE_CHARS - trimmed.length} more to continue`}
          </div>
        </>
      )}

      {mode === 'upload' && (
        <>
          <div
            className={`upload-zone${isDragOver ? ' drag-over' : ''}`}
            onClick={() => fileRef.current?.click()}
            onDrop={e => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
            }}
            onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
          >
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}><UploadCloud size={40} strokeWidth={1.75} /></div>
            <div style={{ fontWeight: 700, marginBottom: '0.35rem' }}>{files.length === 0 ? 'Click or drag files here' : 'Add more files'}</div>
            <div style={{ fontSize: '0.82rem', opacity: 0.7 }}>TXT • PDF • DOCX • Images — multiple files OK</div>
            <input
              ref={fileRef}
              type="file"
              accept=".txt,.pdf,.doc,.docx,image/*"
              multiple
              style={{ display: 'none' }}
              onChange={e => {
                if (e.target.files?.length) handleFiles(e.target.files);
                e.target.value = '';
              }}
            />
          </div>
          {fileError && <div className="modal-error" style={{ marginTop: '0.5rem' }}>{fileError}</div>}
          {files.length > 0 && (
            <div className="file-list">
              {files.map((f, i) => (
                <div key={i} className="file-item">
                  <span className="file-name"><FileText size={14} style={{ flexShrink: 0 }} /> {f.name}</span>
                  <button className="file-remove" onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))} title="Remove"><X size={13} /></button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {mode === 'topic' && (
        <>
          <div className="gen-chips">
            {TOPIC_CHIPS.map(chip => (
              <button key={chip} type="button" className="gen-chip" onClick={() => setTopic(chip)}>{chip}</button>
            ))}
          </div>
          <textarea
            className="deck-name-input modal-textarea"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="e.g. The causes of World War 1, Photosynthesis for A-level Biology, JavaScript promises..."
            rows={4}
          />
        </>
      )}

      {error && (
        <div className="modal-error" style={{ marginTop: '0.75rem' }}>
          {error}{' '}
          {needsUpgrade && <button className="make-link" onClick={() => setUpgradeOpen(true)}>See plans</button>}
        </div>
      )}

      <button className="modal-btn" style={{ marginTop: '1rem' }} disabled={!canSubmit} onClick={handleCreate}>
        <Zap size={16} style={{ verticalAlign: '-2px', marginRight: 6 }} />
        Create flashcards
      </button>
    </div>
  );
}
