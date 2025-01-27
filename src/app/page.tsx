import Hero from "@/components/Hero";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import OurTools from "@/components/OurTools";
import Clients from "@/components/ui/InfiniteScroll";
import MagicButton from "@/components/ui/MagicButton";


export default function Home() {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
       <Navbar/>
      <div className="max-w-7xl w-full">
  
      <Hero/>
      <OurTools/>
      <Clients/>
      <Footer/>
    </div>
   </main>
  );
}
