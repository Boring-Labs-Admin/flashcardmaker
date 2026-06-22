'use client';
import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { UploadCloud, FileText, X, Zap, Sparkles } from 'lucide-react';
import UpgradeModal from '@/components/UpgradeModal';
import FlashboardModal from '@/components/FlashboardModal';

interface InputSectionProps {
  onSubmit: (content: string | string[]) => void;
  isLoading: boolean;
  charLimit?: number;
  isPlusUser?: boolean;
  isLoggedIn?: boolean;
  onPromptSubmit?: (prompt: string) => void;
}

export interface InputSectionHandle {
  trimToLimit: () => void;
}

interface UploadedFile {
  name: string;
  content: string;
}

type Tab = 'paste' | 'upload' | 'topic';

const TOPIC_CHIPS = ['Photosynthesis', 'The French Revolution', 'Algebra basics'];

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
function InputSection({ onSubmit, isLoading, charLimit, isPlusUser, isLoggedIn, onPromptSubmit }, ref) {
  const [activeTab, setActiveTab] = useState<Tab>('paste');
  const [text, setText] = useState('');
  const [prompt, setPrompt] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [fileError, setFileError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
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
    <>
      <div className="gen-card">
        <div className="gen-card-bar">
          <div className="gen-card-dots">
            <span style={{ background: '#ff5f57' }} />
            <span style={{ background: '#febc2e' }} />
            <span style={{ background: '#28c840' }} />
          </div>
          <span className="gen-card-tag"><Zap size={13} /> Flashcard generator</span>
        </div>

        <div className="gen-tabs">
          <button className={`gen-tab${activeTab === 'paste' ? ' active' : ''}`} onClick={() => setActiveTab('paste')}>
            Paste text
          </button>
          <button className={`gen-tab${activeTab === 'upload' ? ' active' : ''}`} onClick={() => setActiveTab('upload')}>
            Upload docs
          </button>
          <button className={`gen-tab${activeTab === 'topic' ? ' active' : ''}`} onClick={() => setActiveTab('topic')}>
            Use AI prompt <span className="gen-tab-badge">PLUS</span>
          </button>
        </div>

        {/* Paste text */}
        {activeTab === 'paste' && (
          <div className="gen-panel">
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
            {text.trim().length > 0 && text.trim().length < 150 && (
              <p style={{ fontSize: '0.78rem', color: '#b45309', margin: '0.4rem 0 0', lineHeight: 1.4 }}>
                Add more content — paste at least a paragraph of your study notes for best results ({150 - text.trim().length} characters to go).
              </p>
            )}
            <button className="btn" style={{ marginTop: 'auto' }} onClick={() => onSubmit(text)} disabled={!text.trim() || text.trim().length < 150 || isLoading}>
              <Zap size={18} /> Generate deck
            </button>
          </div>
        )}

        {/* Upload */}
        {activeTab === 'upload' && (
          <div className="gen-panel">
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
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}><UploadCloud size={48} strokeWidth={1.75} /></div>
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
                    <span className="file-name"><FileText size={14} style={{ flexShrink: 0 }} /> {f.name}</span>
                    <button className="file-remove" onClick={(e) => { e.stopPropagation(); removeFile(i); }} title="Remove"><X size={13} /></button>
                  </div>
                ))}
              </div>
            )}
            {files.length > 0 && (
              <button className="btn" style={{ marginTop: 'auto' }} onClick={handleSubmitFiles} disabled={isLoading}>
                <Zap size={18} /> Generate deck
              </button>
            )}
          </div>
        )}

        {/* Topic — Plus only */}
        {activeTab === 'topic' && (
          <div className="gen-panel">
            {isPlusUser ? (
              <>
                <div className="gen-chips">
                  {TOPIC_CHIPS.map(chip => (
                    <button key={chip} type="button" className="gen-chip" onClick={() => setPrompt(chip)}>{chip}</button>
                  ))}
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. The causes of World War 1, Photosynthesis for A-level Biology, JavaScript promises..."
                  disabled={isLoading}
                />
                <button
                  className="btn"
                  style={{ marginTop: 'auto' }}
                  onClick={() => onPromptSubmit?.(prompt)}
                  disabled={!prompt.trim() || isLoading}
                >
                  <Zap size={18} /> Generate deck
                </button>
              </>
            ) : (
              <>
                <div className="gen-chips">
                  {TOPIC_CHIPS.map(chip => (
                    <button key={chip} type="button" className="gen-chip" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>{chip}</button>
                  ))}
                </div>
                <textarea
                  disabled
                  placeholder="e.g. The causes of World War 1, Photosynthesis for A-level Biology, JavaScript promises..."
                  style={{ cursor: 'not-allowed', background: '#F5F7FB', opacity: 0.6 }}
                />
                <div style={{
                  marginTop: '1rem',
                  background: 'var(--sky)',
                  border: `1.5px solid var(--line)`,
                  borderRadius: 10,
                  padding: '1rem 1.25rem',
                  textAlign: 'center',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.4rem', color: '#004AAD' }}><Sparkles size={24} strokeWidth={1.75} /></div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#004AAD', marginBottom: '0.3rem' }}>
                    {isLoggedIn ? 'Upgrade to Plus to unlock' : 'Plus feature'}
                  </div>
                  <div style={{ fontSize: '0.78rem', opacity: 0.65, marginBottom: '0.9rem', lineHeight: 1.5 }}>
                    {isLoggedIn
                      ? 'Generate a full deck from any topic with no source material needed.'
                      : 'Create a free account, then upgrade to Plus to generate flashcards from any topic.'}
                  </div>
                  {isLoggedIn ? (
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      style={{
                        display: 'inline-block',
                        background: '#004AAD',
                        color: 'white',
                        borderRadius: 7,
                        padding: '0.5rem 1.25rem',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      Upgrade to Plus →
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowSignUpModal(true)}
                      style={{
                        display: 'inline-block',
                        background: '#004AAD',
                        color: 'white',
                        borderRadius: 7,
                        padding: '0.5rem 1.25rem',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                    >
                      Sign up free →
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
      <FlashboardModal isOpen={showSignUpModal} onClose={() => setShowSignUpModal(false)} />
    </>
  );
});

InputSection.displayName = 'InputSection';
export default InputSection;
