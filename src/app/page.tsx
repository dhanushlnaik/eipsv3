import Hero from "@/components/Hero";
import { FloatingNav } from "@/components/layout/FloatingNav";
import Navbar from "@/components/layout/Navbar";
import OurTools from "@/components/OurTools";

import { navItems } from "@/data";

export default function Home() {
  return (
   <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto h-screen sm:px-10 px-5">
    
    <div className="max-w-7xl w-full">
    <FloatingNav navItems={navItems} />
      <Hero/>
      <OurTools/>
    </div>
   </main>
  );
}
