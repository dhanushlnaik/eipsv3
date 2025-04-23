import Image from 'next/image';
import Link from 'next/link';
import React, { type FunctionComponent } from 'react';
import {
  AiOutlineGithub,
  AiOutlineLinkedin,
  AiOutlineMail,
  AiOutlineTwitter,
  AiOutlineYoutube,
  AiOutlineAccountBook,
  AiOutlineDiscord,
} from 'react-icons/ai';

import { cn } from '@/lib/utils';

export const social = [
  {
    link: 'https://x.com/TeamAvarch',
    icon: <AiOutlineTwitter className="h-7 w-7 hover:-translate-y-1" />,
    name: 'Twitter',
  },
  {
    link: 'https://github.com/AvarchLLC/EIPsInsight',
    icon: <AiOutlineGithub className="h-7 w-7 hover:-translate-y-1" />,
    name: 'Github',
  },
  {
    link: 'https://www.youtube.com/channel/UCnceAY-vAQsO8TgGAj5SGFA',
    icon: <AiOutlineYoutube className="h-7 w-7 hover:-translate-y-1" />,
    name: 'Facebook',
  },
  {
    link: 'https://www.linkedin.com/company/avarch-llc/',
    icon: <AiOutlineLinkedin className="h-7 w-7 hover:-translate-y-1" />,
    name: 'LinkedIn',
  },
  {
    link: 'mailto:contact@etherworld.co',
    icon: <AiOutlineMail className="h-7 w-7 hover:-translate-y-1" />,
    name: 'E-mail',
  },
  {
    link: 'https://etherworld.co/tag/eipsinsight/',
    icon: <AiOutlineAccountBook className="h-7 w-7 hover:-translate-y-1" />,
    name: 'Articles',
  },
  {
    link: 'https://discord.com/invite/tUXgfV822C',
    icon: <AiOutlineDiscord className="h-7 w-7 hover:-translate-y-1" />,
    name: 'Discord',
  },
];

export const links = [
  { name: 'All', link: '/all' },
  { name: 'Status', link: '/status' },
  { name: 'Resources', link: '/resources' },
  {
    name: 'Found a bug? Report here!',
    link: 'https://github.com/AvarchLLC/EIPsInsight/issues',
  },
];

export const footLinks = [
  { name: 'Privacy', link: '/privacy-policy' },
  { name: 'Terms and Conditions', link: '/terms' },
  { name: 'Refund & Cancellation', link: '/refund' },
  { name: 'Contact us', link: '/contact-us' },
  { name: 'Shipping', link: '/shipping' },
];

const Footer: FunctionComponent<{ className?: string }> = ({ className }) => {
  return (
    <footer className={cn(className, 'relative')}>
      <div className="line-break "></div>
      <div className="absolute inset-0 z-0">
        <Image
          src="/grid_bg.png"
          alt="Footer Background"
          fill
          className="opacity-50"
        />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col items-center md:items-start">
            <div className="relative size-28">
              <Image src="/EIPsInsights.gif" alt="flc_logo" fill />
            </div>
            <p className="events-heading mb-3 mt-3 flex items-center font-sub-heading text-lg md:text-xl">
              EIPs Insight
            </p>
            <div className="mb-4">
              <p className="events-heading text-center md:text-left">
                Build With 💙 by Avarch
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-end md:items-end ">
            <ul className="mb-6 flex flex-wrap justify-center gap-4 md:gap-6">
              {links.map((link, index) => (
                <li key={index}>
                  <Link href={link.link} className="events-heading">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="mb-6 flex justify-center gap-4 md:gap-6">
              {social.map((link, index) => (
                <li key={index}>
                  <Link href={link.link}>{link.icon}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-gray-700" />
        <div className="flex flex-col items-center gap-4 pt-4">
          <ul className="flex flex-wrap justify-center gap-4 text-sm md:gap-6">
            {footLinks.map((link, index) => (
              <li key={index}>
                <Link
                  href={link.link}
                  className="events-heading transition hover:text-gray-200/75"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
