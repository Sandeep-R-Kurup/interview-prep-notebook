// Renders simple text from data files: blank lines become paragraphs,
// `backticks` become inline code, **double stars** become bold.
function inline(text) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (p.startsWith('`') && p.endsWith('`')) return <code key={i}>{p.slice(1, -1)}</code>;
    if (p.startsWith('**') && p.endsWith('**')) return <strong key={i}>{p.slice(2, -2)}</strong>;
    return p;
  });
}

export default function Rich({ text, className = '' }) {
  if (!text) return null;
  // Accepts a string (blank lines = new paragraph) or an array of paragraphs.
  const paras = Array.isArray(text) ? text : String(text).trim().split(/\n\s*\n/);
  return (
    <div className={className}>
      {paras.map((p, i) => (
        <p key={i}>{inline(p.replace(/\n/g, ' '))}</p>
      ))}
    </div>
  );
}

export function RichInline({ text }) {
  return <>{inline(String(text || ''))}</>;
}
