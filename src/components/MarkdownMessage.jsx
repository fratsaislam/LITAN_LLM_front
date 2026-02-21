import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

const MarkdownMessage = ({ content }) => {
  return (
    <div className="markdown-message">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-white mt-4 mb-2 first:mt-0">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold text-white mt-4 mb-2 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-white mt-3 mb-1.5 first:mt-0">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm font-semibold text-white mt-2 mb-1 first:mt-0">
              {children}
            </h4>
          ),

          // Paragraphs
          p: ({ children }) => (
            <p className="text-sm leading-relaxed text-gray-200 mb-3 last:mb-0">
              {children}
            </p>
          ),

          // Strong / Bold
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),

          // Emphasis / Italic
          em: ({ children }) => (
            <em className="italic text-gray-300">{children}</em>
          ),

          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
            >
              {children}
            </a>
          ),

          // Unordered lists
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-5 mb-3 space-y-1.5 last:mb-0">
              {children}
            </ul>
          ),

          // Ordered lists
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-5 mb-3 space-y-1.5 last:mb-0">
              {children}
            </ol>
          ),

          // List items
          li: ({ children }) => (
            <li className="text-sm text-gray-200 leading-relaxed pl-1">
              {children}
            </li>
          ),

          // Code blocks
          code: ({ inline, className, children }) => {
            const isInline = inline || !className;
            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 rounded-md bg-gray-700/60 text-emerald-300 text-xs font-mono border border-gray-600/50">
                  {children}
                </code>
              );
            }
            // Block code
            const language = className?.replace("language-", "") || "";
            return (
              <div className="my-3 rounded-lg overflow-hidden border border-gray-700/50">
                {language && (
                  <div className="flex items-center justify-between px-4 py-1.5 bg-gray-800/80 border-b border-gray-700/50">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">
                      {language}
                    </span>
                  </div>
                )}
                <pre className="p-4 bg-gray-900/60 overflow-x-auto">
                  <code className="text-xs font-mono text-gray-300 leading-relaxed">
                    {children}
                  </code>
                </pre>
              </div>
            );
          },

          // Pre (wrapper for code blocks)
          pre: ({ children }) => <>{children}</>,

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-emerald-500/50 pl-4 my-3 text-gray-400 italic">
              {children}
            </blockquote>
          ),

          // Horizontal rule
          hr: () => <hr className="my-4 border-gray-700/50" />,

          // Tables
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-lg border border-gray-700/50">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-800/60">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b border-gray-700/30">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-gray-300">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownMessage;
