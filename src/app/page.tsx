import About from "@/components/About";
import Hero from "@/components/Hero";
import Footer from "@/components/layout/Footer";
import OurTools from "@/components/OurTools";
import Clients from "@/components/ui/InfiniteScroll";
import DashboardChart from "@/components/wrapper/DashboardChart";
import DashboardWrapper from "@/components/wrapper/DashboardWrapper";
import BentoGridSecondDemo from "@/components/wrapper/StatusBentoGrid";

export default function Home() {
  return (
    <main className="relative bg-white dark:bg-black-100 text-black dark:text-white flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-8xl w-full">
        <Hero/>
        <DashboardChart/>
        <OurTools/>
        <Clients/>
        <About/>
        <BentoGridSecondDemo/>
        <DashboardWrapper/>
        <Footer/>
      </div>
    </main>
  );
}
