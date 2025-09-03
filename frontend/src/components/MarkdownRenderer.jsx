// src/components/MarkdownRenderer.jsx
import React, { useContext } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ThemeContext } from "../context/ThemeContext";

const MarkdownRenderer = ({ content }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div
      className={`prose max-w-none ${
        theme === "dark" ? "prose-invert" : "prose-gray text-gray-900"
      }`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // --- Headings ---
          h1: (props) => (
            <h1 {...props} className="text-3xl md:text-4xl font-bold mt-10 mb-6" />
          ),
          h2: (props) => (
            <h2 {...props} className="text-2xl font-semibold mt-8 mb-4" />
          ),
          h3: (props) => (
            <h3 {...props} className="text-xl font-semibold mt-6 mb-3" />
          ),

          // --- Paragraph ---
          p: (props) => <p {...props} className="leading-7 my-4" />,

          // --- Links ---
          a: ({ href, children, ...rest }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 decoration-blue-500 hover:decoration-2"
              {...rest}
            >
              {children}
            </a>
          ),

          // --- Blockquote ---
          blockquote: ({ children, ...rest }) => (
            <blockquote
              {...rest}
              className="my-6 border-l-4 pl-5 pr-4 py-3 rounded-r-lg bg-blue-50 dark:bg-gray-800/60 border-blue-500 italic"
            >
              {children}
            </blockquote>
          ),

          // --- Lists ---
          ul: ({ children, ...rest }) => (
            <ul {...rest} className="list-disc pl-6 space-y-2 my-4">
              {children}
            </ul>
          ),
          ol: ({ children, ...rest }) => (
            <ol {...rest} className="list-decimal pl-6 space-y-2 my-4">
              {children}
            </ol>
          ),
          li: ({ children, ...rest }) => (
            <li {...rest} className="leading-7 [&>input]:mr-2">
              {children}
            </li>
          ),

          // --- Tables ---
          table: ({ children }) => (
            <div className="my-6 overflow-x-auto not-prose">
              <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
                {children}
              </table>
            </div>
          ),
          thead: (props) => (
            <thead {...props} className="bg-gray-100 dark:bg-gray-900/40" />
          ),
          tr: (props) => (
            <tr
              {...props}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 hover:dark:bg-gray-800/60"
            />
          ),
          th: ({ children, ...rest }) => (
            <th
              {...rest}
              className="text-left font-semibold px-4 py-2 border-b border-gray-200 dark:border-gray-700"
            >
              {children}
            </th>
          ),
          td: ({ children, ...rest }) => (
            <td
              {...rest}
              className="align-top px-4 py-2 border-b border-gray-200 dark:border-gray-700"
            >
              {children}
            </td>
          ),

          // --- Horizontal rule ---
          hr: () => (
            <hr className="my-10 border-t border-gray-200 dark:border-gray-700" />
          ),

          // --- Images ---
          img: (props) => (
            <img
              {...props}
              className="rounded-lg shadow-sm my-4 mx-auto"
              loading="lazy"
              alt={props.alt || ""}
            />
          ),

          // --- Code ---
          code({ inline, className, children, ...props }) {
            const language = (className || "").match(/language-(\w+)/)?.[1];
            const codeContent = String(children).replace(/\n$/, "");
            const match = /language-(\w+)/.exec(className || "");

            if (inline || (!language && !codeContent.includes("\n"))) {
              return (
                <code
                  {...props}
                  className="px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-mono text-[0.85em]"
                >
                  {codeContent}
                </code>
              );
            }

            return match ? (
              <div className="not-prose my-5">
                <SyntaxHighlighter
                  {...props}
                  PreTag="div"
                  language={match[1]}
                  style={oneDark}
                  customStyle={{
                    borderRadius: "0.5rem",
                    padding: "1rem",
                    fontSize: "0.9em",
                  }}
                >
                  {codeContent}
                </SyntaxHighlighter>
              </div>
            ) : (
              <pre className="overflow-x-auto p-5 leading-relaxed text-sm text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <code className="block font-mono" {...props}>
                  {codeContent}
                </code>
              </pre>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
