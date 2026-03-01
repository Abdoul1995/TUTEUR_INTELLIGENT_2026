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
        .replace(/[\b]/g, '\\b') // backspace -> \b
        .replace(/\r/g, '\\r');  // carriage return -> \r
    // Note: we don't fix \n here as it's often intended as a newline in the text
};

/**
 * Automatically wraps common LaTeX commands in $ $ if they are missing delimiters
 */
const wrapBareLatex = (s: string) => {
    // List of common LaTeX commands that should likely be in math mode
    const commonCommands = [
        'frac', 'sqrt', 'lim', 'sum', 'int', 'alpha', 'beta', 'gamma',
        'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda',
        'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigma', 'tau', 'upsilon',
        'phi', 'chi', 'psi', 'omega', 'pm', 'times', 'div', 'neq', 'le', 'ge',
        'approx', 'infty', 'rightarrow', 'leftarrow', 'log', 'sin', 'cos', 'tan',
        'nabla', 'partial', 'forall', 'exists', 'emptyset', 'in', 'notin', 'ni',
        'prod', 'coprod', 'cap', 'cup', 'subset', 'supset', 'subseteq', 'supseteq'
    ];

    // Matche \command suivi par zéro ou plusieurs {arg}
    const generalRegex = /\\([a-zA-Z]+)((?:\{[^{}]*\})*)/g;

    return s.replace(generalRegex, (match, cmd) => {
        if (commonCommands.includes(cmd)) {
            return `$${match}$`;
        }
        return match;
    });
};

export const LatexRenderer: React.FC<LatexRendererProps> = ({ text }) => {
    if (!text) return null;

    // Use a standard delimiter-based regex for stability.
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
                        return <span key={i} className="bg-red-100 text-red-700 px-1 rounded">{part}</span>;
                    }
                }

                // Inline math: $ ... $ or \( ... \)
                if ((part.startsWith('$') && part.endsWith('$')) ||
                    (part.startsWith('\\(') && part.endsWith('\\)'))) {
                    const math = part.startsWith('$') ? part.slice(1, -1) : part.slice(2, -2);
                    try {
                        return <InlineMath key={i} math={fixEscapedLatex(math)} />;
                    } catch (e) {
                        return <span key={i} className="bg-red-100 text-red-700 px-1 rounded">{part}</span>;
                    }
                }

                // Plain text - apply wrapBareLatex to catch missed commands
                const fixedPlainText = fixEscapedLatex(part);
                const wrappedText = wrapBareLatex(fixedPlainText);

                // If wrapBareLatex added $, we need to split again or recursively render
                // For simplicity here, if it contains $, we just return it as a string 
                // but the better way is to avoid adding $ and instead return a nested LatexRenderer
                // However, react-katex's InlineMath already handles the $ if we pass it correctly.

                if (wrappedText !== fixedPlainText) {
                    // Recurse once if we added delimiters
                    return <LatexRenderer key={i} text={wrappedText} />;
                }

                return <span key={i}>{fixedPlainText}</span>;
            })}
        </>
    );
};
