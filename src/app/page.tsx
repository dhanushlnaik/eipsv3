import About from '@/components/About';
import Hero from '@/components/Hero';
import Footer from '@/components/layout/Footer';
import OurTools from '@/components/OurTools';
import Clients from '@/components/ui/InfiniteScroll';
import DashboardChart from '@/components/wrapper/DashboardChart';
import DashboardWrapper from '@/components/wrapper/DashboardWrapper';
import BentoGridSecondDemo from '@/components/wrapper/StatusBentoGrid';

// utils/sidebarItems.ts



export default function Home() {
  return (
    <main className="relative bg-white dark:bg-black-100 text-black dark:text-white flex justify-center items-center flex-col overflow-hidden mx-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 2xl:px-24">
      <div className="w-full max-w-screen-2xl">
        <Hero />
        <DashboardChart />
        <OurTools />
        <Clients />
        <About />
        <BentoGridSecondDemo />
        <DashboardWrapper />
        <Footer />
      </div>
    </main>
  );
}
