import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface LatexRendererProps {
    text: string;
}

/**
 * Fixes common LaTeX commands that might have been interpreted as JS escape sequences
 * (e.g., \theta becoming \t + heta, \frac becoming \f + rac)
 */
const fixEscapedLatex = (s: string) => {
    return s
        .replace(/\t/g, '\\t')   // tab -> \t
        .replace(/\f/g, '\\f')   // form feed -> \f
        .replace(/\v/g, '\\v')   // vertical tab -> \v
        .replace(/\b/g, '\\b')   // backspace -> \b
        .replace(/\r/g, '\\r');  // carriage return -> \r
    // Note: we don't fix \n here as it's often intended as a newline in the text
};

export const LatexRenderer: React.FC<LatexRendererProps> = ({ text }) => {
    if (!text) return null;

    // Use a standard delimiter-based regex for stability.
    // The AI is now instructed to always use these delimiters.
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
                    try {
                        return <BlockMath key={i} math={fixEscapedLatex(math)} />;
                    } catch (e) {
                        return <span key={i} className="text-red-500">{part}</span>;
                    }
                }

                // Inline math: $ ... $ or \( ... \)
                if ((part.startsWith('$') && part.endsWith('$')) ||
                    (part.startsWith('\\(') && part.endsWith('\\)'))) {
                    const math = part.startsWith('$') ? part.slice(1, -1) : part.slice(2, -2);
                    try {
                        return <InlineMath key={i} math={fixEscapedLatex(math)} />;
                    } catch (e) {
                        return <span key={i} className="text-red-500">{part}</span>;
                    }
                }

                // Plain text - also apply fixEscapedLatex but carefully
                // In plain text, we only want to fix them if they look like they were meant to be LaTeX
                // but for simplicity and safety, let's just render the text. 
                // If it's not in a math block, it's safer to leave as is or only fix very obvious ones.
                const fixedPlainText = fixEscapedLatex(part);
                return <span key={i}>{fixedPlainText}</span>;
            })}
        </>
    );
};
