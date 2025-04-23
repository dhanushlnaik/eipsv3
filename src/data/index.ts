export const navItems = [
  { name: 'Pectra', link: '/pectra' },
  { name: 'All-EIPs', link: '/alleips' },
  { name: 'Tools', link: '/tools' },
  { name: 'Insight', link: '/insight' },
  { name: 'More', link: '/more' },
];

export const gridItems = [
  {
    id: 1,
    title: 'Analytics',
    description: '',
    className: 'lg:col-span-3 md:col-span-6 md:row-span-4 lg:min-h-[60vh]',
    imgClassName: 'w-full h-full',
    titleClassName: 'justify-end',
    img: '/DashboardCard1.png',
    spareImg: '',
  },
  {
    id: 2,
    title: 'Editors Leaderboard',
    description: '',
    className: 'lg:col-span-2 md:col-span-3 md:row-span-2',
    imgClassName: '',
    titleClassName: 'justify-start',
    img: '/DashboardCard2.png',
    spareImg: '',
  },
  {
    id: 3,
    title: 'My tech stack',
    description: 'I constantly try to improve',
    className: 'lg:col-span-2 md:col-span-3 md:row-span-2',
    imgClassName: '',
    titleClassName: 'justify-center',
    img: '/DashboardCard3.png',
    spareImg: '',
  },
  {
    id: 4,
    title: 'Tech enthusiast with a passion for development.',
    description: '',
    className: 'lg:col-span-2 md:col-span-3 md:row-span-1',
    imgClassName: '',
    titleClassName: 'justify-start',
    img: '/DashboardCard4.png',
    spareImg: '/b4.svg',
  },

  {
    id: 5,
    title: 'Currently building a JS Animation library',
    description: 'The Inside Scoop',
    className: 'md:col-span-3 md:row-span-2',
    imgClassName: 'absolute right-0 bottom-0 md:w-96 w-60',
    titleClassName: 'justify-center md:justify-start lg:justify-center',
    img: '/DashboardCard5.png',
    spareImg: '/grid.svg',
  },
  {
    id: 6,
    title: 'Do you want to start a project together?',
    description: '',
    className: 'lg:col-span-2 md:col-span-3 md:row-span-1',
    imgClassName: '',
    titleClassName: 'justify-center md:max-w-full max-w-60 text-center',
    img: '/DashboardCard6.png',
    spareImg: '',
  },
];

export const projects = [
  {
    id: 1,
    title: '3D Solar System Planets to Explore',
    des: 'Explore the wonders of our solar system with this captivating 3D simulation of the planets using Three.js.',
    img: '/p1.svg',
    iconLists: ['/re.svg', '/tail.svg', '/ts.svg', '/three.svg', '/fm.svg'],
    link: '/ui.earth.com',
  },
  {
    id: 2,
    title: 'Yoom - Video Conferencing App',
    des: 'Simplify your video conferencing experience with Yoom. Seamlessly connect with colleagues and friends.',
    img: '/p2.svg',
    iconLists: ['/next.svg', '/tail.svg', '/ts.svg', '/stream.svg', '/c.svg'],
    link: '/ui.yoom.com',
  },
  {
    id: 3,
    title: 'AI Image SaaS - Canva Application',
    des: 'A REAL Software-as-a-Service app with AI features and a payments and credits system using the latest tech stack.',
    img: '/p3.svg',
    iconLists: ['/re.svg', '/tail.svg', '/ts.svg', '/three.svg', '/c.svg'],
    link: '/ui.aiimg.com',
  },
  {
    id: 4,
    title: 'Animated Apple Iphone 3D Website',
    des: 'Recreated the Apple iPhone 15 Pro website, combining GSAP animations and Three.js 3D effects..',
    img: '/p4.svg',
    iconLists: ['/next.svg', '/tail.svg', '/ts.svg', '/three.svg', '/gsap.svg'],
    link: '/ui.apple.com',
  },
];

export const testimonials = [
  {
    quote:
      'This proposal introduces a streamlined mechanism to reduce gas fees significantly for frequent transactions. It ensures better efficiency in smart contract interactions.',
    name: 'EIP-1559',
    title: 'Fee Market Change for Ethereum',
  },
  {
    quote:
      'Aimed at improving the scalability of Ethereum, this proposal outlines the addition of shard chains to increase transaction throughput without compromising decentralization.',
    name: 'EIP-4844',
    title: 'Proto-Danksharding',
  },
  {
    quote:
      'This standard specifies a way to enable multiple non-fungible tokens (NFTs) to exist within a single contract and simplifies how they are handled on-chain.',
    name: 'EIP-1155',
    title: 'Multi-Token Standard',
  },
  {
    quote:
      "This proposal introduces a way to recover lost Ethereum by allowing users to register 'guardians' who can approve fund recovery in case of a lost private key.",
    name: 'EIP-2426',
    title: 'Social Recovery Wallets',
  },
  {
    quote:
      'This change proposes the transition from proof-of-work to proof-of-stake consensus mechanism, significantly reducing energy consumption while improving network security.',
    name: 'EIP-3675',
    title: 'Ethereum Merge Upgrade',
  },
];

export const companies = [
  {
    id: 1,
    name: 'cloudinary',
    img: '/cloud.svg',
    nameImg: '/cloudName.svg',
  },
  {
    id: 2,
    name: 'appwrite',
    img: '/app.svg',
    nameImg: '/appName.svg',
  },
  {
    id: 3,
    name: 'HOSTINGER',
    img: '/host.svg',
    nameImg: '/hostName.svg',
  },
  {
    id: 4,
    name: 'stream',
    img: '/s.svg',
    nameImg: '/streamName.svg',
  },
  {
    id: 5,
    name: 'docker.',
    img: '/dock.svg',
    nameImg: '/dockerName.svg',
  },
];

export const workExperience = [
  {
    id: 1,
    title: 'Analytics',
    desc: "Get a bird's-eye view of Ethereum Improvement Proposal activity with our detailed analytics dashboards. Explore trends, progress, and changes like never before.",
    className: 'md:col-span-2',
    thumbnail: '/DashboardCard1.png',
  },
  {
    id: 2,
    title: 'Editors Leaderboard',
    desc: 'Recognizing the unsung heroes of Ethereum: Track and celebrate EIP Editors based on their contributions and impact in the ecosystem.',
    className: 'md:col-span-2', // change to md:col-span-2
    thumbnail: '/DashboardCard2.png',
  },
  {
    id: 3,
    title: 'Boards',
    desc: 'Stay organized with the Boards Tool—your central hub for tracking and prioritizing EIPs. Sort proposals by activity, streamline editor reviews, and focus on PRs that need immediate attention.',
    className: 'md:col-span-2', // change to md:col-span-2
    thumbnail: '/DashboardCard3.png',
  },
  {
    id: 4,
    title: 'Search by Author',
    desc: 'Dive deep into the proposals that matter to you. Filter and search by authors to explore individual contributions and their evolving ideas.',
    className: 'md:col-span-2',
    thumbnail: '/DashboardCard4.png',
  },
  {
    id: 5,
    title: 'All EIPs',
    desc: 'Access the full archive of Ethereum Improvement Proposals in one place. Simplified, structured, and easy to explore.',
    className: 'md:col-span-2',
    thumbnail: '/DashboardCard5.png',
  },
  {
    id: 6,
    title: 'Did You Know',
    desc: "Uncover interesting facts and insights about Ethereum's proposal ecosystem, from historical milestones to key moments shaping its future.",
    className: 'md:col-span-2',
    thumbnail: '/DashboardCard6.png',
  },
  {
    id: 7,
    title: 'More Resources',
    desc: 'Expand your knowledge with curated resources, guides, and documentation for understanding Ethereum Improvement Proposals.',
    className: 'md:col-span-2',
    thumbnail: '/DashboardCard7.png',
  },
  {
    id: 8,
    title: 'Feedback',
    desc: 'Your voice matters! Share your thoughts, suggestions, and feedback to help us make EIPsInsight better for everyone.',
    className: 'md:col-span-2',
    thumbnail: '/DashboardCard8.png',
  },
];

export const socialMedia = [
  {
    id: 1,
    img: '/git.svg',
  },
  {
    id: 2,
    img: '/twit.svg',
  },
  {
    id: 3,
    img: '/link.svg',
  },
];
