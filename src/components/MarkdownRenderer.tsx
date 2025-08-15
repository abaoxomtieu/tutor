import React from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <MarkdownPreview
      source={content}
      style={{ 
        padding: 16,
        backgroundColor: '#0d1117',
        color: '#c9d1d9'
      }}
      wrapperElement={{
        "data-color-mode": "dark"
      }}
    />
  );
};

export default MarkdownRenderer;
