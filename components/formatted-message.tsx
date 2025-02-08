import React, { useEffect, useState, useMemo } from 'react';
import LightMarkDown from 'markdown-to-jsx';
import MermaidBlock from './mermaid-block';
// Copyable code block for XML (or other languages)
interface CopyableCodeBlockProps {
  className?: string;
  children: React.ReactNode;
}

const CopyableCodeBlock: React.FC<CopyableCodeBlockProps> = ({ className, children }) => {
  const language = className?.replace('lang-', '');
  const codeText = React.Children.toArray(children).join('');
  
  const handleCopy = () => {
    navigator.clipboard.writeText(codeText);
  };

  return (
    <div className="relative">
      {language === 'xml' && (
        <button
          onClick={handleCopy}
          className="absolute right-2 top-2 bg-gray-300 text-xs px-2 py-1 rounded"
        >
          Copy
        </button>
      )}
      <pre className="overflow-auto p-2 bg-gray-800 text-white rounded">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
};


// Custom CodeBlock that chooses between CopyableCodeBlock and MermaidBlock.
const CodeBlock: React.FC<any> = ({ className, children, ...props }) => {
  const language = className ? className.replace('lang-', '') : '';
  if (language === 'mermaid') {
    return <MermaidBlock>{children}</MermaidBlock>;
  }
  return <CopyableCodeBlock className={className}>{children}</CopyableCodeBlock>;
};

// Helper function to check if the markdown content has balanced triple-backticks.
const hasBalancedCodeFences = (content: string): boolean => {
  const matches = content.match(/```/g);
  return !matches || matches.length % 2 === 0;
};

export function PlainFormattedMessage({ content }: { content: string }) {
  // Use memoization to pre-process content only when it changes.
  const safeContent = useMemo(() => {
    // If content contains unbalanced ``` markers, avoid custom overrides.
    if (!hasBalancedCodeFences(content)) {
      return content;
    }
    return content;
  }, [content]);

  return (
    <div className="p-2 bg-gray-100 rounded whitespace-pre-wrap break-words">
      <LightMarkDown
        options={{
          // Only override code rendering if code fences are balanced.
          overrides: hasBalancedCodeFences(content) ? {
            code: {
              component: CodeBlock,
            },
          } : undefined,
        }}
      >
        {safeContent}
      </LightMarkDown>
    </div>
  );
}