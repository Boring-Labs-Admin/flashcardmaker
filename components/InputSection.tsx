'use client';
import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import Link from 'next/link';

interface InputSectionProps {
  onSubmit: (content: string | string[]) => void;
  isLoading: boolean;
  charLimit?: number;
  isPlusUser?: boolean;
  onPromptSubmit?: (prompt: string) => void;
}

export interface InputSectionHandle {
  trimToLimit: () => void;
}

interface UploadedFile {
  name: string;
  content: string;
}

function readFile(file: File): Promise<UploadedFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve({ name: file.name, content: e.target?.result as string });
    reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'txt') {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  });
}

const InputSection = forwardRef<InputSectionHandle, InputSectionProps>(
function InputSection({ onSubmit, isLoading, charLimit, isPlusUser, onPromptSubmit }, ref) {
  const [text, setText] = useState('');
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [fileError, setFileError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    trimToLimit: () => {
      if (charLimit) setText(t => t.slice(0, charLimit));
    },
  }));

  const handleFiles = async (fileList: FileList) => {
    setFileError('');
    const newFiles: UploadedFile[] = [];
    for (const file of Array.from(fileList)) {
      try {
        const uploaded = await readFile(file);
        newFiles.push(uploaded);
      } catch {
        setFileError(`Failed to read "${file.name}". Please try again.`);
      }
    }
    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitFiles = () => {
    const contents = files.map(f => f.content);
    onSubmit(contents.length === 1 ? contents[0] : contents);
  };

  return (
    <div className="input-grid">
      {/* Upload */}
      <div className="card">
        <div className="card-label">METHOD 01</div>
        <h3 className="card-title">Upload Files</h3>
        <div
          className={`upload-zone${isDragOver ? ' drag-over' : ''}`}
          onClick={() => fileRef.current?.click()}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragOver(false);
            if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
          }}
          onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
          onDragLeave={() => setIsDragOver(false)}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: 1 }}>📤</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {files.length === 0 ? 'Click or drag files here' : 'Add more files'}
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>TXT • PDF • DOCX • Images — multiple files OK</div>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.pdf,.doc,.docx,image/*"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files?.length) handleFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </div>
        {fileError && <div style={{ color: '#c00', fontSize: '0.85rem', marginTop: '0.5rem' }}>{fileError}</div>}
        {files.length > 0 && (
          <div className="file-list">
            {files.map((f, i) => (
              <div key={i} className="file-item">
                <span className="file-name">📄 {f.name}</span>
                <button className="file-remove" onClick={(e) => { e.stopPropagation(); removeFile(i); }} title="Remove">✕</button>
              </div>
            ))}
          </div>
        )}
        {files.length > 0 && (
          <button className="btn" onClick={handleSubmitFiles} disabled={isLoading}>
            ⚡ CREATE FLASHCARDS
          </button>
        )}
      </div>

      {/* Text */}
      <div className="card">
        <div className="card-label">METHOD 02</div>
        <h3 className="card-title">Paste Your Text</h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste your study notes, lecture content, or any text here..."
          disabled={isLoading}
        />
        {text.length > 0 && (
          <div style={{
            fontSize: '0.75rem',
            textAlign: 'right',
            marginTop: '0.25rem',
            color: charLimit && text.length > charLimit ? '#c00' : charLimit && text.length > charLimit * 0.8 ? '#e07b00' : undefined,
            opacity: charLimit && text.length > charLimit ? 1 : 0.5,
          }}>
            {text.length.toLocaleString()}{charLimit ? ` / ${charLimit.toLocaleString()}` : ''} characters
          </div>
        )}
        <button className="btn" onClick={() => onSubmit(text)} disabled={!text.trim() || isLoading}>
          ⚡ CREATE FLASHCARDS
        </button>
      </div>
      {/* Prompt — Plus only */}
      <div className="card" style={{ position: 'relative', opacity: isPlusUser ? 1 : 0.75 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="card-label">METHOD 03</div>
          {!isPlusUser && (
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: '#004AAD',
              background: '#EEF4FF',
              border: '1.5px solid #C7D9F5',
              borderRadius: 5,
              padding: '0.15rem 0.5rem',
            }}>✦ PLUS</span>
          )}
        </div>
        <h3 className="card-title">Generate from Prompt</h3>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g. The causes of World War 1, Photosynthesis for A-level Biology, JavaScript promises..."
          disabled={!isPlusUser || isLoading}
          style={!isPlusUser ? { cursor: 'not-allowed', background: '#F5F7FB' } : undefined}
        />
        {isPlusUser ? (
          <button
            className="btn"
            onClick={() => onPromptSubmit?.(prompt)}
            disabled={!prompt.trim() || isLoading}
          >
            ⚡ CREATE FLASHCARDS
          </button>
        ) : (
          <Link
            href="/dashboard"
            style={{
              display: 'block',
              textAlign: 'center',
              fontSize: '0.8rem',
              color: '#004AAD',
              opacity: 0.6,
              marginTop: '0.5rem',
              textDecoration: 'none',
              fontWeight: 600,
            }}
          >
            Upgrade to Plus to unlock →
          </Link>
        )}
      </div>
    </div>
  );
});

InputSection.displayName = 'InputSection';
export default InputSection;
