'use client';
import { useState, useRef } from 'react';

interface InputSectionProps {
  onSubmit: (content: string | string[]) => void;
  isLoading: boolean;
  charLimit: number;
  fileLimit: number;
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

export default function InputSection({ onSubmit, isLoading, charLimit, fileLimit }: InputSectionProps) {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [fileError, setFileError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList) => {
    setFileError('');
    const remaining = fileLimit - files.length;
    if (remaining <= 0) {
      setFileError(`File limit reached (${fileLimit} files max). Upgrade to Plus for more.`);
      return;
    }
    const newFiles: UploadedFile[] = [];
    for (const file of Array.from(fileList).slice(0, remaining)) {
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
    setFileError('');
  };

  const handleSubmitFiles = () => {
    const contents = files.map(f => f.content);
    onSubmit(contents.length === 1 ? contents[0] : contents);
  };

  const overCharLimit = text.length > charLimit;

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
          <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>
            TXT • PDF • DOCX • Images — up to {fileLimit} file{fileLimit !== 1 ? 's' : ''}
          </div>
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
          style={overCharLimit ? { borderColor: '#c00' } : undefined}
        />
        {text.length > 0 && (
          <div style={{
            fontSize: '0.75rem',
            textAlign: 'right',
            marginTop: '0.25rem',
            color: overCharLimit ? '#c00' : undefined,
            opacity: overCharLimit ? 1 : 0.5,
          }}>
            {text.length.toLocaleString()} / {charLimit.toLocaleString()} characters
            {overCharLimit && <span style={{ marginLeft: '0.4rem' }}>— upgrade to Plus for more</span>}
          </div>
        )}
        <button
          className="btn"
          onClick={() => onSubmit(text)}
          disabled={!text.trim() || isLoading || overCharLimit}
        >
          ⚡ CREATE FLASHCARDS
        </button>
      </div>
    </div>
  );
}
