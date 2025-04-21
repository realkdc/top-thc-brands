import { Shield, Leaf, Check } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-black relative overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-5 mix-blend-overlay"></div>
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row gap-16 items-center">
          <div className="w-full md:w-1/2">
            <h2 className="section-title">THE AUTHORITY</h2>
            <p className="text-white/70 mb-10 uppercase text-sm tracking-wide">
              We're not just another page—we're the authority. Our mission is to spotlight only the most exceptional THC brands in the market through rigorous curation and expert evaluation.
            </p>
            
            <div className="space-y-6 mb-10">
              <FeatureItem>
                STRINGENT QUALITY STANDARDS THAT EXCEED INDUSTRY NORMS
              </FeatureItem>
              <FeatureItem>
                FOCUS ON POTENCY, CONSISTENCY, AND CONSUMER EXPERIENCE
              </FeatureItem>
              <FeatureItem>
                INDEPENDENT TESTING AND VERIFICATION OF ALL PRODUCTS
              </FeatureItem>
              <FeatureItem>
                RECOGNITION BASED ON MERIT, NOT MARKETING BUDGETS
              </FeatureItem>
            </div>
            
            <div className="inline-block">
              <span className="text-xs text-white/50 uppercase tracking-wider border-b border-[#F1C40F] pb-1">NO HYPE. JUST HEAT.</span>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="relative">
              <div className="relative border border-white/10 p-10">
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    <Shield className="w-16 h-16 text-white" strokeWidth={1.5} />
                    <Leaf className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-[#F1C40F]" />
                  </div>
                </div>
                
                <blockquote className="text-center">
                  <p className="text-2xl font-bold text-white mb-6 uppercase">
                    "WE DON'T RATE EVERYTHING. JUST WHAT MATTERS."
                  </p>
                  <p className="text-sm text-white/70 mb-8 uppercase tracking-wide">
                    CURATED EXCELLENCE ONLY.
                  </p>
                  
                  <footer>
                    <p className="text-xs text-[#F1C40F] font-bold uppercase tracking-widest">
                      TOP THC BRANDS
                    </p>
                  </footer>
                </blockquote>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureItem = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-start">
      <Check className="w-5 h-5 text-[#F1C40F] mr-3 mt-0.5" strokeWidth={1.5} />
      <span className="text-white/80 text-xs">{children}</span>
    </div>
  );
};

export default AboutSection;
