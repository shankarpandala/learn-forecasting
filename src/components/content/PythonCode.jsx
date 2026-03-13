import { useState } from 'react';

/* ── Minimal Python tokenizer ──────────────────────── */

const KEYWORDS = new Set([
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await',
  'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except',
  'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is',
  'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try',
  'while', 'with', 'yield',
]);

const BUILTINS = new Set([
  'abs', 'all', 'any', 'bin', 'bool', 'breakpoint', 'bytearray', 'bytes',
  'callable', 'chr', 'classmethod', 'compile', 'complex', 'copyright',
  'delattr', 'dict', 'dir', 'divmod', 'enumerate', 'eval', 'exec', 'filter',
  'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr', 'hash',
  'help', 'hex', 'id', 'input', 'int', 'isinstance', 'issubclass', 'iter',
  'len', 'list', 'locals', 'map', 'max', 'memoryview', 'min', 'next',
  'object', 'oct', 'open', 'ord', 'pow', 'print', 'property', 'range',
  'repr', 'reversed', 'round', 'set', 'setattr', 'slice', 'sorted',
  'staticmethod', 'str', 'sum', 'super', 'tuple', 'type', 'vars', 'zip',
]);

function tokenizePython(code) {
  const tokens = [];
  let i = 0;

  while (i < code.length) {
    // Comment
    if (code[i] === '#') {
      let j = i;
      while (j < code.length && code[j] !== '\n') j++;
      tokens.push({ type: 'comment', value: code.slice(i, j) });
      i = j;
      continue;
    }

    // Triple-quoted strings
    if (
      (code.slice(i, i + 3) === '"""' || code.slice(i, i + 3) === "'''")
    ) {
      const quote = code.slice(i, i + 3);
      let j = i + 3;
      while (j < code.length && code.slice(j, j + 3) !== quote) j++;
      j += 3;
      tokens.push({ type: 'string', value: code.slice(i, j) });
      i = j;
      continue;
    }

    // Single-quoted strings
    if (code[i] === '"' || code[i] === "'") {
      const quote = code[i];
      let j = i + 1;
      while (j < code.length && code[j] !== quote && code[j] !== '\n') {
        if (code[j] === '\\') j++;
        j++;
      }
      j++;
      tokens.push({ type: 'string', value: code.slice(i, j) });
      i = j;
      continue;
    }

    // Number
    if (/[0-9]/.test(code[i]) || (code[i] === '.' && /[0-9]/.test(code[i + 1] || ''))) {
      let j = i;
      while (j < code.length && /[\w.]/.test(code[j])) j++;
      tokens.push({ type: 'number', value: code.slice(i, j) });
      i = j;
      continue;
    }

    // Decorator
    if (code[i] === '@') {
      let j = i;
      while (j < code.length && /[\w.]/.test(code[j + 1] || '')) j++;
      tokens.push({ type: 'decorator', value: code.slice(i, j + 1) });
      i = j + 1;
      continue;
    }

    // Identifier / keyword / builtin
    if (/[a-zA-Z_]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[\w]/.test(code[j])) j++;
      const word = code.slice(i, j);
      if (KEYWORDS.has(word)) {
        tokens.push({ type: 'keyword', value: word });
      } else if (BUILTINS.has(word)) {
        tokens.push({ type: 'builtin', value: word });
      } else {
        tokens.push({ type: 'identifier', value: word });
      }
      i = j;
      continue;
    }

    // Operator
    if (/[+\-*/%=<>!&|^~]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[+\-*/%=<>!&|^~]/.test(code[j])) j++;
      tokens.push({ type: 'operator', value: code.slice(i, j) });
      i = j;
      continue;
    }

    // Everything else (punctuation, whitespace, newlines)
    tokens.push({ type: 'plain', value: code[i] });
    i++;
  }

  return tokens;
}

const TOKEN_COLORS = {
  keyword:    'text-pink-400',
  builtin:    'text-cyan-400',
  string:     'text-emerald-400',
  comment:    'text-zinc-500 italic',
  number:     'text-amber-400',
  decorator:  'text-sky-400',
  operator:   'text-violet-400',
  identifier: 'text-zinc-200',
  plain:      'text-zinc-300',
};

function HighlightedCode({ code }) {
  const tokens = tokenizePython(code);
  return (
    <code className="text-sm font-mono leading-relaxed">
      {tokens.map((tok, i) => (
        <span key={i} className={TOKEN_COLORS[tok.type] ?? 'text-zinc-300'}>
          {tok.value}
        </span>
      ))}
    </code>
  );
}

/* ── Copy button ──────────────────────────────────── */

function CopyButton({ code }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 transition-colors"
      aria-label="Copy code"
    >
      {copied ? (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

/* ── Colab button ─────────────────────────────────── */

function ColabButton({ colabUrl }) {
  if (!colabUrl) return null;
  return (
    <a
      href={colabUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium text-zinc-400 hover:text-orange-300 hover:bg-zinc-700 transition-colors"
    >
      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.54 9.46L2.19 7.1a6.93 6.93 0 000 9.79l2.35-2.35A3.59 3.59 0 014.54 9.46z" />
        <path d="M7.1 2.19L4.75 4.54a6.93 6.93 0 009.79 0L12.19 2.19a3.59 3.59 0 01-5.09 0z" opacity=".3" />
        <path d="M21.81 7.1l-2.35 2.35a3.59 3.59 0 010 5.09l2.35 2.35a6.93 6.93 0 000-9.79z" />
        <path d="M16.9 21.81l-2.35-2.35a3.59 3.59 0 01-5.09 0l-2.35 2.35a6.93 6.93 0 009.79 0z" opacity=".3" />
        <path d="M12 7.1a4.9 4.9 0 100 9.8 4.9 4.9 0 000-9.8zm0 7.28a2.38 2.38 0 110-4.76 2.38 2.38 0 010 4.76z" />
      </svg>
      Try in Colab
    </a>
  );
}

/* ── Traffic light dots ───────────────────────────── */

function TrafficLights() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-3 h-3 rounded-full bg-red-500/80" />
      <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
      <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
    </div>
  );
}

/* ── PythonCode ───────────────────────────────────── */

/**
 * PythonCode
 *
 * Props:
 *   code      – Python source string
 *   filename  – optional filename shown in toolbar (default: "example.py")
 *   colabUrl  – optional Google Colab share URL
 *   title     – optional short description above the block
 */
export default function PythonCode({ code = '', filename, colabUrl, title }) {
  const displayName = filename || 'example.py';

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-zinc-700 dark:border-zinc-700 shadow-lg">
      {/* Optional title */}
      {title && (
        <div className="px-4 pt-3 pb-0 text-xs font-medium text-zinc-400">
          {title}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-800 border-b border-zinc-700">
        <div className="flex items-center gap-3">
          <TrafficLights />
          <span className="text-xs text-zinc-400 font-mono">{displayName}</span>
        </div>
        <div className="flex items-center gap-1">
          <ColabButton colabUrl={colabUrl} />
          <CopyButton code={code} />
        </div>
      </div>

      {/* Code area */}
      <div className="overflow-x-auto bg-zinc-900">
        <pre className="p-4 leading-relaxed min-w-0">
          <HighlightedCode code={code} />
        </pre>
      </div>
    </div>
  );
}
