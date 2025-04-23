'use client';
import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import PectraCountdown from './PectraCountdown';
import { Meteors } from './ui/meteors';
import Link from 'next/link';
import Image from 'next/image';
import { InfiniteMovingCards } from './ui/InfiniteVideoCards';
import { slideInFromLeft, slideInFromRight } from '@/lib/utils';
const PectraC = () => {
  return (
    <div className="pt-20 w-full">
      <motion.div
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }}
      >
        <h1 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl">
          Ethereum Network Upgrades
        </h1>
        <div className="cursive text-[20px] text-gray-200 mb-5 mt-[5px] text-center">
          Pectra
        </div>
        <PectraCountdown />
      </motion.div>

      <div className="flex flex-col lg:flex-row items-center justify-center gap-6 p-4 md:p-6 lg:p-10">
        {/* LEFT BOX */}
        <div className="relative w-full lg:w-1/2 max-w-xl">
          <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-red-500 bg-gradient-to-r from-blue-500 to-teal-500 blur-3xl" />
          <div className="relative flex flex-col items-start justify-end overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 px-6 py-8 shadow-xl">
            <div className="mb-4 flex h-5 w-5 items-center justify-center rounded-full border border-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-2 w-2 text-gray-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Ethereum’s Pectra Upgrade
            </h1>
            <p className="text-base font-normal text-slate-400 text-justify leading-relaxed mb-4">
              Ethereum developers are moving toward the next major network
              upgrade, Prague and Electra, collectively known as{' '}
              <Link
                href="https://eipsinsight.com/eips/eip-7600"
                target="_blank"
                className="text-blue-400 underline hover:text-blue-300 transition"
              >
                Pectra
              </Link>
              . This upgrade will involve significant changes to both the{' '}
              <Link
                href="https://www.youtube.com/watch?v=nJ57mkttCH0"
                target="_blank"
                className="text-blue-400 underline hover:text-blue-300 transition"
              >
                Execution and Consensus layers
              </Link>{' '}
              on the mainnet. Given the complexities of testing and the scope of
              changes, including 11{' '}
              <Link
                href="https://www.youtube.com/watch?v=AyidVR6X6J8"
                target="_blank"
                className="text-blue-400 underline hover:text-blue-300 transition"
              >
                Ethereum Improvement Proposals (EIPs)
              </Link>
              , the developers recently decided to reduce the scope of the
              Pectra upgrade. Some EIPs have now been shifted to the upcoming{' '}
              <Link
                href="https://eipsinsight.com/eips/eip-7600"
                target="_blank"
                className="text-blue-400 underline hover:text-blue-300 transition"
              >
                Fusaka
              </Link>{' '}
              (a combination of Fulu and Osaka) upgrade. Currently, the testing
              team is working on{' '}
              <Link
                href="https://notes.ethereum.org/@ethpandaops/pectra-devnet-5"
                target="_blank"
                className="text-blue-400 underline hover:text-blue-300 transition"
              >
                Devnet 5
              </Link>{' '}
              and has finalized the specifications for Devnet 4. Specs and other
              details can be followed below.{' '}
              <Link
                href="#carousel-section"
                className="text-blue-400 underline hover:text-blue-300 transition"
              >
                View more
              </Link>
              .
            </p>
            <Meteors number={20} />
          </div>
        </div>

        {/* RIGHT BOX */}
        <div className="relative w-full lg:w-1/2 max-w-xl">
          <div className="absolute inset-0 h-full w-full scale-[0.80] transform rounded-full bg-purple-500 bg-gradient-to-r from-indigo-500 to-pink-500 blur-3xl" />
          <div className="relative flex flex-col items-center overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 px-6 py-8 shadow-xl">
            <h1 className="text-xl font-bold text-white mb-4 ">
              Network Upgrades and EIPs Relationship Graph
            </h1>
            <div className="relative group overflow-hidden z-40 rounded-xl shadow-xl">
              <Image
                src="/assets/Pectra_Relations2.jpg"
                alt="Ethereum illustration"
                width={350}
                height={350}
                className="transform transition-transform duration-300 group-hover:scale-105 rounded-xl"
              />
            </div>
            <Meteors number={20} />
          </div>
        </div>
      </div>

      <section id="testimonials" className="py-20">
        <motion.div
          variants={slideInFromLeft(0.5)}
          className="text-[60px] text-white font-bold text-center"
        >
          Trending
          <span className="text-purpleee"> Articles</span>
        </motion.div>

        <motion.div
          variants={slideInFromRight(0.5)}
          className="cursive text-[20px] text-gray-200 mb-10 mt-[5px] text-center"
        >
          Explore the most impactful articles shaping Ethereum today.
        </motion.div>

        <div className="flex flex-col items-center max-lg:mt-10">
          <div
            // remove bg-white dark:bg-black dark:bg-grid-white/[0.05], h-[40rem] to 30rem , md:h-[30rem] are for the responsive design
            className="h-[50vh] md:h-[30rem] rounded-md flex flex-col antialiased  items-center justify-center relative overflow-hidden"
          >
            <InfiniteMovingCards
              items={videos}
              direction="right"
              speed="slow"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const videos = [
  {
    image: 'pectra5.jpg',
    title: "Highlights of Ethereum's All Core Devs Meeting (ACDE) #204",
    content:
      'Pectra Devnet 5 & 6 Updates, Mainnet Timeline, Geth Bug, System Contract Audits, Retrospective, Fusaka Planning, Hardware Requirements, EIP 7823, ACD Bot',
    link: 'https://etherworld.co/2025/01/30/highlights-of-ethereums-all-core-devs-meeting-acde-204/',
  },
  {
    image: 'pectra6.jpg',
    title: "Highlights of Ethereum's All Core Devs Meeting (ACDC) #149",
    content:
      'Devnet 5 Updates, Devnet 6 Preparation, Pectra Testnet Forks Blob Scaling & Hard Fork Coordination',
    link: 'https://etherworld.co/2025/01/23/highlights-of-ethereums-all-core-devs-meeting-acdc-149/',
  },
  {
    image: 'pectra7.jpg',
    title: "Highlights of Ethereum's All Core Devs Meeting (ACDE) #203",
    content:
      'Pectra Devnet 5 Launch, Pectra Spec Updates & Pectra Testing Timeline',
    link: 'https://etherworld.co/2025/01/17/highlights-of-ethereums-all-core-devs-meeting-acde-203/',
  },
  {
    image: 'pectra8.jpg',
    title: 'Glamsterdam: The Next Upgrade After Fusaka',
    content:
      'Glamsterdam - merges the star Gloas with Amsterdam for Ethereum’s next upgrade. Explore its origins, naming traditions, and why Devconnect cities might shape future upgrade names.',
    link: 'https://etherworld.co/2025/01/09/glamsterdam-the-next-upgrade-after-fusaka/',
  },
  {
    image: 'pectra10.jpg',
    title: "Highlights of Ethereum's All Core Devs Meeting #148",
    content:
      'Pectra Testing Updates, Merged PRs, Hardware Requirements for Validator & Post Pectra Ethereum',
    link: 'https://etherworld.co/2025/01/09/highlights-of-ethereums-all-core-devs-consenus-meeting-148/',
  },

  {
    image: 'pectra2.jpg',
    title: 'Ethereum Launches Mekong Testnet: A Guide',
    content:
      'Ethereum’s Mekong testnet offers developers and stakers a sandbox to explore the Pectra upgrade’s UX and staking changes, shaping the upcoming mainnet deployment.',
    link: 'https://etherworld.co/2024/11/08/mekong-testnet/',
  },
  {
    image: 'pectra3.jpg',
    title: 'Consensus-layer Call 144: EIPs, Pectra, and Blob Scaling',
    content:
      'Ethereum developers discussed key updates on Pectra, EIPs 7742 and 7782, and strategies for scaling blobs, focusing on network performance, PeerDAS, and upcoming changes for the Pectra hard fork.',
    link: 'https://etherworld.co/2024/10/17/consensus-layer-call-144/',
  },
  {
    image: 'pectra1.jpg',
    title: 'Ethereum Developers Push Proposal to increase Gossip Limit',
    content:
      'Gossip Limit in Blockchain Networks, Current Setup, Reasons for 10 MiB Limit, Challenges, Proposal Objectives, Implementation & Alternatives.',
    link: 'https://etherworld.co/2024/12/15/ethereum-developers-push-proposal-to-increase-gossip-limit/',
  },
];

export const projects = [
  {
    title: `EtherWorld Week #${Math.floor(Math.random() * 100)}`,
    description: `EtherWorld Week #${Math.floor(Math.random() * 100)}`,
    link: `https://etherworld.co/week-${Math.floor(Math.random() * 100)}`,
  },
  {
    title: `EtherWorld Week #${Math.floor(Math.random() * 100)}`,
    description: `EtherWorld Week #${Math.floor(Math.random() * 100)}`,
    link: `https://etherworld.co/week-${Math.floor(Math.random() * 100)}`,
  },
  {
    title: `EtherWorld Week #${Math.floor(Math.random() * 100)}`,
    description: `EtherWorld Week #${Math.floor(Math.random() * 100)}`,
    link: `https://etherworld.co/week-${Math.floor(Math.random() * 100)}`,
  },
  {
    title: `EtherWorld Week #${Math.floor(Math.random() * 100)}`,
    description: `EtherWorld Week #${Math.floor(Math.random() * 100)}`,
    link: `https://etherworld.co/week-${Math.floor(Math.random() * 100)}`,
  },
  {
    title: `EtherWorld Week #${Math.floor(Math.random() * 100)}`,
    description: `EtherWorld Week #${Math.floor(Math.random() * 100)}`,
    link: `https://etherworld.co/week-${Math.floor(Math.random() * 100)}`,
  },
  {
    title: `EtherWorld Week #${Math.floor(Math.random() * 100)}`,
    description: `EtherWorld Week #${Math.floor(Math.random() * 100)}`,
    link: `https://etherworld.co/week-${Math.floor(Math.random() * 100)}`,
  },
];

export const LampContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-950 w-full rounded-md z-0',
        className
      )}
    >
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0 ">
        <motion.div
          initial={{ opacity: 0.5, width: '15rem' }}
          whileInView={{ opacity: 1, width: '30rem' }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-cyan-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute  w-[100%] left-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute  w-40 h-[100%] left-0 bg-slate-950  bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0.5, width: '15rem' }}
          whileInView={{ opacity: 1, width: '30rem' }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-cyan-500 text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute  w-40 h-[100%] right-0 bg-slate-950  bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute  w-[100%] right-0 bg-slate-950 h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-slate-950 blur-2xl"></div>
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-cyan-500 opacity-50 blur-3xl"></div>
        <motion.div
          initial={{ width: '8rem' }}
          whileInView={{ width: '16rem' }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-cyan-400 blur-2xl"
        ></motion.div>
        <motion.div
          initial={{ width: '15rem' }}
          whileInView={{ width: '30rem' }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-cyan-400 "
        ></motion.div>

        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-slate-950 "></div>
      </div>

      <div className="relative z-50 flex -translate-y-80 flex-col items-center px-5">
        {children}
      </div>
    </div>
  );
};

export default PectraC;
