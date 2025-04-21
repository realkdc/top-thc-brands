import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { getBrands } from "@/api/brandService";
import { useToast } from "@/components/ui/use-toast";

interface Brand {
  _id: string;
  name: string;
  image: string;
  category: string;
  rating: number;
  description: string;
  featured?: boolean;
  slug: string;
  website?: string;
}

const BrandSection = () => {
  const { toast } = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (error) {
        console.error("Error fetching brands:", error);
        toast({
          title: "Error",
          description: "Failed to load brands. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [toast]);

  const featuredBrands = brands.filter(brand => brand.featured);
  const regularBrands = brands.filter(brand => !brand.featured);
  
  if (loading) {
    return (
      <section id="brands" className="py-24 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="section-title">BRANDS INDEX</h2>
          <p className="text-white/70 mb-16 max-w-2xl">
            WE SPOTLIGHT ONLY THE MOST EXCEPTIONAL THC BRANDS IN THE MARKET. EACH BRAND EARNS THEIR PLACE THROUGH OUR RIGOROUS VETTING PROCESS.
          </p>
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-sm bg-gray-800 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-800 rounded-sm w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-800 rounded-sm"></div>
                  <div className="h-4 bg-gray-800 rounded-sm w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="brands" className="py-24 bg-black">
      <div className="container mx-auto px-6">
        <h2 className="section-title">BRANDS INDEX</h2>
        <p className="text-white/70 mb-16 max-w-2xl uppercase text-sm tracking-wide">
          We spotlight only the most exceptional THC brands in the market. Each brand earns their place through our rigorous vetting process.
        </p>
        
        {/* Featured Brands */}
        {featuredBrands.length > 0 && (
          <div className="mb-20">
            <h3 className="font-display text-2xl font-bold mb-8 flex items-center uppercase">
              <span className="text-[#F1C40F] mr-3">FEATURED</span> 
              <span className="bg-[#F1C40F] text-black px-2 py-1 text-xs font-bold">VERIFIED</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {featuredBrands.map(brand => (
                <FeaturedBrandCard key={brand._id} brand={brand} />
              ))}
            </div>
          </div>
        )}
        
        {/* Regular Brands */}
        {regularBrands.length > 0 && (
          <>
            <h3 className="font-display text-2xl font-bold mb-8 uppercase">CURATED SELECTION</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularBrands.map(brand => (
                <BrandCard key={brand._id} brand={brand} />
              ))}
            </div>
          </>
        )}
        
        {brands.length === 0 && !loading && (
          <div className="text-center text-white/70 py-8 uppercase tracking-wide">
            No brands available at the moment. Check back soon!
          </div>
        )}
      </div>
    </section>
  );
};

const FeaturedBrandCard = ({ brand }: { brand: Brand }) => {
  const imageUrl = brand.image && brand.image.startsWith('http') 
    ? brand.image 
    : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${brand.image || ''}`;

  return (
    <div className="group p-0 flex flex-col md:flex-row overflow-hidden border border-white/10 bg-black">
      <div className="w-full md:w-2/5 h-60 md:h-auto relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={brand.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            console.error('Featured image failed to load:', imageUrl);
            e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
        <div className="absolute top-4 left-4">
          <span className="bg-[#F1C40F] text-black px-2 py-1 text-xs font-bold uppercase">
            {brand.category}
          </span>
        </div>
      </div>
      
      <div className="w-full md:w-3/5 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-2xl font-bold text-white uppercase">{brand.name}</h3>
            <Rating rating={brand.rating} />
          </div>
          <p className="text-white/70 mb-4 text-sm">{brand.description}</p>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-xs text-white/50 uppercase">#1 in {brand.category}</span>
          <a 
            href={brand.website || "#"} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[#F1C40F] hover:underline text-xs flex items-center uppercase tracking-wider"
          >
            {brand.website ? "Visit Website" : "Learn More"}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

const BrandCard = ({ brand }: { brand: Brand }) => {
  const imageUrl = brand.image && brand.image.startsWith('http') 
    ? brand.image 
    : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${brand.image || ''}`;

  console.log('Brand data:', brand);
  console.log('Image URL:', imageUrl);

  return (
    <div className="overflow-hidden border border-white/10">
      <div className="h-44 relative overflow-hidden">
        <img 
          src={imageUrl}
          alt={brand.name}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            console.error('Image failed to load:', imageUrl);
            e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
          }}
        />
        <div className="absolute top-3 left-3">
          <span className="bg-[#F1C40F] text-black px-2 py-1 text-xs font-bold uppercase">
            {brand.category}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-lg font-bold text-white uppercase">{brand.name}</h3>
          <Rating rating={brand.rating} small />
        </div>
        <p className="text-xs text-white/70 mb-3 line-clamp-2">{brand.description}</p>
        <a 
          href={brand.website || "#"} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#F1C40F] text-xs flex items-center hover:underline uppercase tracking-wider"
        >
          {brand.website ? "View Details" : "Learn More"}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 ml-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
          </svg>
        </a>
      </div>
    </div>
  );
};

const Rating = ({ rating, small = false }: { rating: number; small?: boolean }) => {
  return (
    <div className="flex items-center">
      <Star className={cn("text-[#F1C40F] fill-[#F1C40F]", small ? "w-3 h-3" : "w-4 h-4")} />
      <span className={cn("text-[#F1C40F] font-medium ml-1", small ? "text-xs" : "text-sm")}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default BrandSection;
