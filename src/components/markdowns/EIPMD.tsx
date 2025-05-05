import NLink from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useState, useEffect } from 'react';
import { CodeBlock } from '../ui/code-block';
// import { Separator } from '@radix-ui/react-select';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table';

export const extractEipNumber = (eipOrNo: string, prefix: string): string => {
  const match = eipOrNo.match(
    new RegExp(`^${prefix}-(\\d+)(?:\\.md)?$|^(\\d+)$`)
  );
  if (match) {
    return match[1] || match[2];
  } else {
    throw new Error('Invalid EIP format');
  }
};

const isRelativeURL = (url: string) => {
  const absolutePattern = new RegExp('^(?:[a-z]+:)?//', 'i');
  return !absolutePattern.test(url);
};

const resolveURL = (markdownFileURL: string, url: string) => {
  if (isRelativeURL(url)) {
    const markdownFilePath = new URL(markdownFileURL);
    const basePath = markdownFilePath.href.substring(
      0,
      markdownFilePath.href.lastIndexOf('/')
    );
    return new URL(url, `${basePath}/`).href;
  }
  return url;
};

const getValidLink = async (num: string): Promise<string> => {
  const links = [
    {
      url: `https://raw.githubusercontent.com/ethereum/RIPs/master/RIPS/rip-${num}.md`,
      path: `/rips/rip-${num}`,
    },
    {
      url: `https://raw.githubusercontent.com/ethereum/ERCs/master/ERCS/erc-${num}.md`,
      path: `/ercs/erc-${num}`,
    },
    {
      url: `https://raw.githubusercontent.com/ethereum/EIPs/master/EIPS/eip-${num}.md`,
      path: `/eips/eip-${num}`,
    },
  ];

  for (const link of links) {
    try {
      const response = await fetch(link.url);
      if (response.ok) {
        return link.path;
      }
    } catch (error) {
      console.error(`Error checking link ${link.url}:`, error);
    }
  }
  return `/eips/eip-${num}`;
};

interface EIPLinkProps {
  eipNumber: string;
  children: React.ReactNode;
}

const EIPLink: React.FC<EIPLinkProps> = ({ eipNumber, children }) => {
  const [linkPath, setLinkPath] = useState<string | null>(null);

  useEffect(() => {
    const fetchLink = async () => {
      const path = await getValidLink(eipNumber);
      setLinkPath(path);
    };
    fetchLink();
  }, [eipNumber]);

  if (linkPath === null) {
    return (
      <span className="text-purple-400 underline underline-offset-4 decoration-purple-400 hover:text-purple-300 transition-colors">
        {children}
      </span>
    );
  }
  return (
    <NLink href={linkPath} passHref>
      <span className="text-purple-400 underline underline-offset-4 decoration-purple-400 hover:text-purple-300 transition-colors">
        {children}
      </span>
    </NLink>
  );
};

export const Markdown = ({
  md,
  markdownFileURL,
}: {
  md: string;
  markdownFileURL: string;
}) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => (
          <div className="mb-6 text-white/80 text-lg leading-relaxed tracking-wide">
            {children}
          </div>
        ),

        em: ({ children }) => (
          <em className="text-purple-400 italic">{children}</em>
        ),

        blockquote: ({ children }) => (
          <div className="border-l-4 border-purple-400 pl-4 italic text-white/70 my-6 bg-white/10 backdrop-blur-md p-4 rounded-2xl shadow-xl">
            {children}
          </div>
        ),

        code: ({ children, className }) => {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : 'plaintext';
          return (
            <div className="relative w-full max-w-4xl mx-auto my-8 overflow-x-auto rounded-2xl bg-gradient-to-br from-purple-800/20 via-purple-700/10 to-purple-800/20 backdrop-blur-md p-6 shadow-xl transition-all duration-300 hover:scale-105">
              <CodeBlock
                language={language}
                filename="eip.md"
                highlightLines={[9, 13, 14, 18]}
                code={String(children)}
              />
            </div>
          );
        },

        del: ({ children }) => (
          <del className="line-through text-purple-300">{children}</del>
        ),

        hr: () => <div className="my-8 border-t border-white/20" />,

        a: ({ href = '', children }) => {
          const eipPattern = /eip-(\d+)/;
          const match = href.match(eipPattern);
          if (match) {
            const eipNumber = match[1];
            return <EIPLink eipNumber={eipNumber}>{children}</EIPLink>;
          }
          return (
            <NLink
              href={resolveURL(markdownFileURL, href)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 underline hover:text-purple-300 transition-colors"
            >
              {children}
            </NLink>
          );
        },

        img: ({ src = '', alt = '' }) => (
          <div className="flex justify-center my-8">
            <Image
              src={typeof src === 'string' ? resolveURL(markdownFileURL, src) : ''}
              alt={alt}
              width={600}
              height={400}
              className="rounded-2xl shadow-lg backdrop-blur-md"
            />
          </div>
        ),

        ul: ({ children }) => (
          <ul className="list-disc pl-8 space-y-3 bg-white/5 backdrop-blur-lg rounded-2xl p-6 my-6 shadow-xl shadow-purple-500/10">
            {children}
          </ul>
        ),

        ol: ({ children }) => (
          <ol className="list-decimal pl-8 space-y-3 bg-white/5 backdrop-blur-lg rounded-2xl p-6 my-6 shadow-xl shadow-purple-500/10">
            {children}
          </ol>
        ),

        li: ({ children }) => (
          <li className="text-white/90 hover:text-purple-300 transition-all duration-300 hover:scale-105">
            {children}
          </li>
        ),

        h1: ({ children }) => (
          <h1 className="my-10 text-5xl font-extrabold text-white tracking-tight bg-white/5 p-6 rounded-2xl shadow-2xl shadow-purple-500/20 transition-all duration-300 hover:scale-105">
            {children}
          </h1>
        ),

        h2: ({ children }) => (
          <h2 className="my-8 text-4xl font-bold text-white tracking-tight bg-white/5 p-5 rounded-2xl shadow-xl shadow-purple-500/20 transition-all duration-300 hover:scale-105">
            {children}
          </h2>
        ),

        h3: ({ children }) => (
          <h3 className="my-6 text-3xl font-semibold text-white tracking-tight bg-white/5 p-4 rounded-2xl shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-105">
            {children}
          </h3>
        ),

        h4: ({ children }) => (
          <h4 className="my-4 text-2xl font-semibold text-white tracking-tight bg-white/5 p-3 rounded-xl shadow-md shadow-purple-500/20 transition-all duration-300 hover:scale-105">
            {children}
          </h4>
        ),

        h5: ({ children }) => (
          <h5 className="my-3 text-xl font-semibold text-white tracking-tight">
            {children}
          </h5>
        ),

        h6: ({ children }) => (
          <h6 className="my-2 text-lg font-medium text-white/80 tracking-tight">
            {children}
          </h6>
        ),

        pre: ({ children }) => (
          <div className="relative w-full max-w-4xl mx-auto my-8 overflow-x-auto rounded-2xl bg-gradient-to-br from-purple-800/20 via-purple-700/10 to-purple-800/20 backdrop-blur-md p-6 shadow-xl transition-all duration-300 hover:scale-105">
            <CodeBlock
              language="md"
              filename="eip.md"
              highlightLines={[9, 13, 14, 18]}
              code={String(children)}
            />
          </div>
        ),

        table: ({ children }) => (
          <div className="overflow-x-auto my-8 rounded-2xl bg-white/10 backdrop-blur-lg p-6 shadow-xl shadow-purple-500/20">
            <Table className="min-w-full divide-y divide-purple-300/30">
              {children}
            </Table>
          </div>
        ),

        thead: (props) => <TableHeader {...props} />,
        tbody: TableBody,
        tr: (props) => <TableRow>{props.children}</TableRow>,
        td: (props) => (
          <TableCell className="py-4 px-6 text-white/90">
            {props.children}
          </TableCell>
        ),
        th: (props) => (
          <TableHead className="py-4 px-6 text-purple-300 text-left">
            {props.children}
          </TableHead>
        ),
      }}
    >
      {md}
    </ReactMarkdown>
  );
};