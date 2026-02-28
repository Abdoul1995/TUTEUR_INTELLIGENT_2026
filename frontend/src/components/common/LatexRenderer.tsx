import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface LatexRendererProps {
    text: string;
}

export const LatexRenderer: React.FC<LatexRendererProps> = ({ text }) => {
    if (!text) return null;

    // First, try to detect if there's LaTeX that isn't wrapped in delimiters
    // We look for common LaTeX commands like \frac, \sqrt, \lim, \int, \sum, \alpha, \beta, etc.
    // If we find them NOT inside $, $$, \[, or \(, we might want to wrap the whole text or parts of it.
    // However, a better approach is to improve the regex to also capture these commands if they're not delimited.

    // Regex to capture:
    // 1. $$ ... $$ (Block)
    // 2. \[ ... \] (Block)
    // 3. $ ... $ (Inline)
    // 4. \( ... \) (Inline)
    // 5. Common LaTeX commands: \frac, \sqrt, \lim, \infty, etc. (when not already captured)
    const regex = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\$[\s\S]+?\$|\\\([\s\S]+?\\\)|\\frac\{[\s\S]*?\}\{[\s\S]*?\}|\\sqrt\{[\s\S]*?\}|\\lim_\{[\s\S]*?\}|\\infty|\\times|\\div|\\pm|\\neq|\\leq|\\geq|\\alpha|\\beta|\\gamma|\\delta|\\theta|\\pi|\\sigma|\\omega)/g;

    const parts = text.split(regex);

    return (
        <>
            {parts.map((part, i) => {
                if (!part) return null;

                // Block math: $$ ... $$ or \[ ... \]
                if ((part.startsWith('$$') && part.endsWith('$$')) ||
                    (part.startsWith('\\[') && part.endsWith('\\]'))) {
                    const math = part.startsWith('$$') ? part.slice(2, -2) : part.slice(2, -2);
                    try {
                        return <BlockMath key={i} math={math} />;
                    } catch (e) {
                        return <span key={i} className="text-red-500">{part}</span>;
                    }
                }

                // Inline math: $ ... $ or \( ... \)
                if ((part.startsWith('$') && part.endsWith('$')) ||
                    (part.startsWith('\\(') && part.endsWith('\\)'))) {
                    const math = part.startsWith('$') ? part.slice(1, -1) : part.slice(2, -2);
                    try {
                        return <InlineMath key={i} math={math} />;
                    } catch (e) {
                        return <span key={i} className="text-red-500">{part}</span>;
                    }
                }

                // Bare LaTeX commands caught by the regex
                if (part.startsWith('\\')) {
                    try {
                        return <InlineMath key={i} math={part} />;
                    } catch (e) {
                        return <span key={i}>{part}</span>;
                    }
                }

                // Plain text
                return <span key={i}>{part}</span>;
            })}
        </>
    );
};
