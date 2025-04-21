import { Mail, Tag, Bell } from 'lucide-react';
import NewsletterForm from './NewsletterForm';

const NewsletterSection = () => {
  return (
    <section className="py-20 bg-black border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="section-title mb-6">GET EXCLUSIVE THC DEALS</h2>
          <p className="text-white/80 mb-12 max-w-2xl mx-auto uppercase text-sm tracking-wide">
            Subscribe to our newsletter and receive exclusive deals, industry news, and early access to product reviews
            from the top THC brands.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="border border-white/10 p-8">
              <div className="inline-flex items-center justify-center w-12 h-12 text-[#F1C40F] mb-4">
                <Tag size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-white mb-3 uppercase">Exclusive Discounts</h3>
              <p className="text-sm text-white/70">
                Get access to subscriber-only coupon codes and special promotions from premium brands.
              </p>
            </div>
            
            <div className="border border-white/10 p-8">
              <div className="inline-flex items-center justify-center w-12 h-12 text-[#F1C40F] mb-4">
                <Bell size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-white mb-3 uppercase">New Product Alerts</h3>
              <p className="text-sm text-white/70">
                Be the first to know when top brands release new products or limited edition items.
              </p>
            </div>
            
            <div className="border border-white/10 p-8">
              <div className="inline-flex items-center justify-center w-12 h-12 text-[#F1C40F] mb-4">
                <Mail size={24} strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-white mb-3 uppercase">Expert Insights</h3>
              <p className="text-sm text-white/70">
                Get curated content on the latest trends, lab results, and expert opinions on premium THC products.
              </p>
            </div>
          </div>
          
          <div className="max-w-md mx-auto">
            <NewsletterForm
              source="newsletter_section"
              buttonText="JOIN NOW"
              placeholderText="Your email address"
              className="mb-4"
            />
            <p className="text-xs text-white/50 uppercase tracking-wider">
              By subscribing, you agree to receive marketing emails from TOP THC BRANDS.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection; 