import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check, ChevronDown } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी', flag: '🇮🇳' },
  { code: 'or', label: 'Odia', native: 'ଓଡ଼ିଆ', flag: '🏔️' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', flag: '🌿' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🌺' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0];

  const handleChange = (code) => {
    i18n.changeLanguage(code);
    setOpen(false);
    // Font support for regional languages
    const body = document.body;
    if (['hi', 'or', 'bn', 'ta'].includes(code)) {
      body.classList.add('regional-lang');
    } else {
      body.classList.remove('regional-lang');
    }
  };

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="Change Language"
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: open ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)',
          border: `1px solid ${open ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)'}`,
          borderRadius: '100px',
          padding: '6px 12px',
          cursor: 'pointer',
          color: open ? '#10B981' : 'var(--text-secondary)',
          fontSize: '13px',
          fontWeight: 600,
          transition: 'all 0.2s ease',
          whiteSpace: 'nowrap',
        }}
        onMouseOver={(e) => {
          if (!open) e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
        }}
        onMouseOut={(e) => {
          if (!open) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
        }}
      >
        <Globe size={14} style={{ flexShrink: 0 }} />
        <span style={{ fontSize: '16px', lineHeight: 1 }}>{currentLang.flag}</span>
        <span style={{ maxWidth: 60, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {currentLang.native}
        </span>
        <ChevronDown
          size={12}
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
            flexShrink: 0,
          }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 99 }}
            onClick={() => setOpen(false)}
          />
          <div
            role="listbox"
            aria-label="Select Language"
            style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              right: 0,
              minWidth: 200,
              background: 'rgba(10, 16, 32, 0.97)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(16,185,129,0.25)',
              borderRadius: '16px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
              zIndex: 100,
              overflow: 'hidden',
              animation: 'langDropIn 0.18s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '12px 16px 8px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              <Globe size={13} color="#10B981" />
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Select Language
              </span>
            </div>

            {/* Language Options */}
            <div style={{ padding: '6px' }}>
              {LANGUAGES.map((lang) => {
                const isActive = i18n.language === lang.code;
                return (
                  <button
                    key={lang.code}
                    role="option"
                    aria-selected={isActive}
                    onClick={() => handleChange(lang.code)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: 'none',
                      background: isActive ? 'rgba(16,185,129,0.12)' : 'transparent',
                      cursor: 'pointer',
                      color: isActive ? '#10B981' : 'var(--text-secondary)',
                      transition: 'all 0.15s ease',
                      textAlign: 'left',
                    }}
                    onMouseOver={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    }}
                    onMouseOut={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    {/* Flag */}
                    <span style={{ fontSize: '20px', lineHeight: 1, flexShrink: 0 }}>{lang.flag}</span>

                    {/* Labels */}
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: isActive ? 700 : 500, color: isActive ? '#fff' : 'var(--text-secondary)', lineHeight: 1.3 }}>
                        {lang.native}
                      </p>
                      <p style={{ margin: 0, fontSize: '11px', color: isActive ? '#10B981' : 'var(--text-tertiary)', fontWeight: 500, marginTop: 1 }}>
                        {lang.label}
                      </p>
                    </div>

                    {/* Active Check */}
                    {isActive && (
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        <Check size={11} color="#10B981" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes langDropIn {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .regional-lang {
          font-family: 'Noto Sans', 'Noto Sans Devanagari', 'Noto Sans Bengali',
                       'Noto Sans Tamil', 'Noto Sans Oriya',
                       'Mukta', 'Hind', sans-serif !important;
        }
        .regional-lang button,
        .regional-lang p,
        .regional-lang span,
        .regional-lang h1,
        .regional-lang h2,
        .regional-lang h3,
        .regional-lang h4,
        .regional-lang div {
          font-family: inherit !important;
        }
      `}</style>
    </div>
  );
};

export default LanguageSwitcher;
