import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';
import { useStudy } from '../context/StudyContext';

const LANG = { js: 'javascript', jsx: 'jsx', ts: 'typescript', tsx: 'tsx', bash: 'bash', json: 'json', css: 'css', html: 'markup', sql: 'sql', yaml: 'yaml', text: 'text' };

export default function CodeBlock({ code, lang = 'js', title }) {
  const { theme } = useStudy();
  const [copied, setCopied] = useState(false);
  const source = code.replace(/^\n+|\s+$/g, '');

  async function copy() {
    try {
      await navigator.clipboard.writeText(source);
    } catch {
      // Fallback for browsers that block the clipboard API
      const ta = document.createElement('textarea');
      ta.value = source;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="my-4 rounded-lg border border-rule dark:border-rule-dark overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 text-xs text-ink-soft dark:text-ink-darksoft bg-paper dark:bg-paper-dark border-b border-rule dark:border-rule-dark">
        <span>{title || (LANG[lang] || lang)}</span>
        <button onClick={copy} className="px-2 py-0.5 rounded hover:bg-rule dark:hover:bg-rule-dark font-medium">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <Highlight code={source} language={LANG[lang] || lang} theme={theme === 'dark' ? themes.nightOwl : themes.github}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} overflow-x-auto p-4 text-[0.84rem] leading-relaxed font-mono`} style={{ ...style, margin: 0 }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, k) => <span key={k} {...getTokenProps({ token })} />)}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
