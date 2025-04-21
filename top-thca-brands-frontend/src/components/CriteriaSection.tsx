import { CheckCircle, Trophy, Shield, Tag } from "lucide-react";

const criteriaData = [
  {
    id: 1,
    title: "PRODUCT QUALITY",
    description: "Premium appearance, aroma, flavor profile, and overall experience that exceeds category standards.",
    icon: Trophy
  },
  {
    id: 2,
    title: "POTENCY & CONSISTENCY",
    description: "Products deliver consistent effects with verified potency backed by third-party lab results.",
    icon: CheckCircle
  },
  {
    id: 3,
    title: "BRAND INTEGRITY",
    description: "Transparent business practices, authentic marketing, and consistent brand presence.",
    icon: Shield
  },
  {
    id: 4,
    title: "INNOVATION",
    description: "Forward-thinking approaches that advance product quality, experience, or delivery methods.",
    icon: Tag
  }
];

const CriteriaSection = () => {
  return (
    <section id="criteria" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <h2 className="section-title">OUR CRITERIA</h2>
        <p className="text-white/70 mb-16 max-w-2xl uppercase text-sm tracking-wide">
          We hold brands to the highest standards. Our curation process is rigorous and uncompromising.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {criteriaData.map((item) => (
            <CriteriaCard key={item.id} {...item} />
          ))}
        </div>
        
        <div className="mt-20 border border-white/10 p-10">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="font-display text-2xl font-bold mb-3 text-white uppercase">
                THINK YOUR BRAND MEETS OUR STANDARDS?
              </h3>
              <p className="text-white/70 text-sm">
                WE'RE ALWAYS LOOKING FOR EXCEPTIONAL BRANDS THAT STAND OUT FROM THE CROWD.
              </p>
            </div>
            
            <a href="#contact" className="bg-transparent text-white border border-[#F1C40F] font-bold py-3 px-8 rounded-sm hover:bg-[#F1C40F]/10 transition-colors tracking-wide uppercase">
              Submit Your Brand
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const CriteriaCard = ({ 
  title, 
  description, 
  icon: Icon 
}: { 
  title: string; 
  description: string; 
  icon: React.FC<React.SVGProps<SVGSVGElement>> 
}) => {
  return (
    <div className="border border-white/10 p-6 hover:border-[#F1C40F]/30 transition-colors">
      <div className="flex items-start">
        <div className="p-3">
          <Icon className="w-6 h-6 text-[#F1C40F]" strokeWidth={1.5} />
        </div>
        
        <div className="ml-5">
          <h3 className="font-display text-xl font-bold mb-3 text-white">
            {title}
          </h3>
          <p className="text-white/70 text-sm">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CriteriaSection;
