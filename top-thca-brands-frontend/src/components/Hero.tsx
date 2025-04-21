import { Shield, Leaf } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background - pure black */}
      <div className="absolute inset-0 bg-black z-0">
        <div className="absolute inset-0 opacity-5 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
      </div>
      
      <div className="container mx-auto px-4 z-10 text-center">
        <div className="inline-flex items-center justify-center mb-6">
          <Shield className="h-12 w-12 text-white" strokeWidth={1.5} />
          <Leaf className="absolute h-8 w-8 text-[#F1C40F]" />
        </div>
        
        <h1 className="font-display font-bold text-5xl md:text-7xl lg:text-8xl mb-6 tracking-tighter uppercase">
          <span className="text-white">TOP</span>
          <span className="text-[#F1C40F]">THC</span>
          <span className="block text-white mt-2">BRANDS</span>
        </h1>
        
        <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 font-medium">
          THE AUTHORITY FOR SPOTLIGHTING ELITE THC BRANDS.
          WE DON'T PROMOTE EVERYONE. WE <span className="text-[#F1C40F]">CURATE</span>.
        </p>
        
        <div className="flex flex-col md:flex-row gap-6 justify-center mt-10">
          <a href="#brands" className="bg-transparent text-white border border-[#F1C40F] font-bold py-3 px-8 rounded-sm hover:bg-[#F1C40F]/10 transition-colors tracking-wide uppercase">
            Discover Curated Picks
          </a>
          <a href="#criteria" className="bg-transparent text-white border border-white/30 font-bold py-3 px-8 rounded-sm hover:bg-white/5 transition-colors tracking-wide uppercase">
            Our Criteria
          </a>
        </div>

        <div className="mt-20 flex justify-center">
          <span className="bg-[#F1C40F] text-black font-bold px-4 py-2 text-sm tracking-wider uppercase">
            Verified Drops Only
          </span>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-0 right-0 flex justify-center animate-bounce">
        <a href="#brands" className="text-white/50 hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default Hero;
