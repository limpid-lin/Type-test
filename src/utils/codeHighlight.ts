export function highlightCode(code: string): string {
  let highlighted = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  const keywords = [
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
    'do', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'finally',
    'throw', 'class', 'extends', 'import', 'export', 'from', 'default', 'async',
    'await', 'new', 'this', 'super', 'typeof', 'instanceof', 'in', 'of'
  ]
  const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g')
  highlighted = highlighted.replace(keywordRegex, '<span class="code-keyword">$1</span>')

  const types = [
    'string', 'number', 'boolean', 'object', 'array', 'void', 'null', 'undefined',
    'any', 'unknown', 'never', 'interface', 'type', 'enum', 'implements', 'public',
    'private', 'protected', 'readonly', 'static'
  ]
  const typeRegex = new RegExp(`\\b(${types.join('|')})\\b`, 'g')
  highlighted = highlighted.replace(typeRegex, '<span class="code-type">$1</span>')

  highlighted = highlighted.replace(/(['"`])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="code-string">$1$2$1</span>')
  highlighted = highlighted.replace(/(\/\/.*$)/gm, '<span class="code-comment">$1</span>')
  highlighted = highlighted.replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="code-comment">$1</span>')
  highlighted = highlighted.replace(/\b(\d+\.?\d*)\b/g, '<span class="code-number">$1</span>')
  highlighted = highlighted.replace(/\n/g, '<br>')
  highlighted = highlighted.replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
  highlighted = highlighted.replace(/ /g, '&nbsp;')

  return highlighted
}

export function getCodeSyntaxCSS(): string {
  return `
    .code-keyword { color: #c678dd; }
    .code-type { color: #61afef; }
    .code-string { color: #98c379; }
    .code-comment { color: #5c6370; font-style: italic; }
    .code-number { color: #d19a66; }
  `
}
