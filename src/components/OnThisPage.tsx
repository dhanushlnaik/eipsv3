'use client';

import { cn } from '@/lib/utils';
import React, { useEffect, useState } from 'react';

interface LinkType {
  id: string;
  text: string;
}

const OnThisPage = ({
  htmlContent,
  className,
}: {
  htmlContent: string;
  className: string;
}) => {
  const [links, setLinks] = useState<LinkType[] | null>(null);

  useEffect(() => {
    const temp = document.createElement('div');
    temp.innerHTML = htmlContent;

    const headings = temp.querySelectorAll('h2');
    const generatedLinks: LinkType[] = [];

    headings.forEach((heading, index) => {
      const id = heading.id || `heading-${index}`;
      heading.id = id;

      generatedLinks.push({
        id: id,
        text: (heading as HTMLElement).innerText,
      });
    });

    setLinks(generatedLinks);
  }, [htmlContent]);

  return (
    <div className={cn('hidden md:block', className)}>
      <div className="sticky top-24">
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-2xl shadow-md">
          <h2 className="text-sm font-semibold text-[#30A0E0] uppercase mb-4 tracking-wide">
            On This Page
          </h2>
          <ul className="space-y-2">
            {links &&
              links.map((link) => (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className="block text-gray-600 dark:text-gray-300 text-xs hover:text-[#30A0E0] transition-colors truncate"
                  >
                    {link.text}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default OnThisPage;
