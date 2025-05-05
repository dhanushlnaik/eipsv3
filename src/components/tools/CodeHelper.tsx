import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

type CodeBlockProps = {
  children: string;
  language: string;
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ children, language }) => {
  return (
    <div
      className="relative overflow-auto rounded-xl mx-auto
        max-w-full sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] xl:max-w-[1200px]"
    >
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        wrapLines
        lineProps={{
          style: {
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
          },
        }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
};
