
import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';

interface LatexRendererProps {
    text: string;
}

export const LatexRenderer: React.FC<LatexRendererProps> = ({ text }) => {
    if (!text) return null;

    // Supported delimiters:
    // $ ... $ (Inline)
    // \( ... \) (Inline)
    // \[ ... \] (Block)
    // $$ ... $$ (Block)

    // Regex to capture all delimiters. 
    // We use capturing groups () to keep the delimiters in the split result.
    const regex = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\$[\s\S]+?\$|\\\([\s\S]+?\\\))/g;

    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, i) => {
                if (!part) return null;

                // Block math: $$ ... $$ or \[ ... \]
                if ((part.startsWith('$$') && part.endsWith('$$')) ||
                    (part.startsWith('\\[') && part.endsWith('\\]'))) {
                    const math = part.startsWith('$$') ? part.slice(2, -2) : part.slice(2, -2);
                    return <BlockMath key={i} math={math} />;
                }

                // Inline math: $ ... $ or \( ... \)
                if ((part.startsWith('$') && part.endsWith('$')) ||
                    (part.startsWith('\\(') && part.endsWith('\\)'))) {
                    const math = part.startsWith('$') ? part.slice(1, -1) : part.slice(2, -2);
                    return <InlineMath key={i} math={math} />;
                }

                // Plain text - handle potential double backslashes from JSON
                let plainText = part;
                // If it looks like escaped LaTeX but didn't match (e.g. broken delimiters), we just show it
                return <span key={i}>{plainText}</span>;
            })}
        </>
    );
};
