import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { submitContact } from '@/api/contactService';

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    brandName: '',
    website: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Submit form data to the API
      const response = await submitContact(formData);
      
      toast({
        title: "Submission received",
        description: response.message || "Thank you for your interest. We'll review your brand and get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        brandName: '',
        website: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-black relative">
      <div className="container mx-auto px-6">
        <h2 className="section-title">SUBMIT YOUR BRAND</h2>
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-1/2">
            <p className="text-white/70 mb-10 uppercase text-sm tracking-wide">
              Think your brand stands out from the rest? We're always looking for exceptional THC products that meet our rigorous standards.
            </p>
            
            <div className="border border-white/10 p-8 mb-8">
              <h3 className="font-display text-xl font-bold mb-6 text-white uppercase">
                WHAT HAPPENS NEXT
              </h3>
              <ul className="space-y-6">
                <li className="flex items-start">
                  <span className="border border-[#F1C40F] text-[#F1C40F] font-bold w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">01</span>
                  <span className="text-white/80 text-sm">Our team reviews your submission within 5-7 business days</span>
                </li>
                <li className="flex items-start">
                  <span className="border border-[#F1C40F] text-[#F1C40F] font-bold w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">02</span>
                  <span className="text-white/80 text-sm">If your brand meets initial criteria, we request product samples</span>
                </li>
                <li className="flex items-start">
                  <span className="border border-[#F1C40F] text-[#F1C40F] font-bold w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">03</span>
                  <span className="text-white/80 text-sm">Products undergo our thorough evaluation process</span>
                </li>
                <li className="flex items-start">
                  <span className="border border-[#F1C40F] text-[#F1C40F] font-bold w-8 h-8 flex items-center justify-center mr-4 flex-shrink-0">04</span>
                  <span className="text-white/80 text-sm">Selected brands are featured in our elite lineup</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <form onSubmit={handleSubmit} className="border border-white/10 p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-xs text-white/70 uppercase tracking-wider">Your Name</label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="bg-black border-white/20 focus:border-[#F1C40F] text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs text-white/70 uppercase tracking-wider">Email Address</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-black border-white/20 focus:border-[#F1C40F] text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="brandName" className="text-xs text-white/70 uppercase tracking-wider">Brand Name</label>
                  <Input
                    id="brandName"
                    name="brandName"
                    value={formData.brandName}
                    onChange={handleChange}
                    className="bg-black border-white/20 focus:border-[#F1C40F] text-white"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="website" className="text-xs text-white/70 uppercase tracking-wider">Website (Optional)</label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="bg-black border-white/20 focus:border-[#F1C40F] text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2 mb-10">
                <label htmlFor="message" className="text-xs text-white/70 uppercase tracking-wider">Tell us about your brand</label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="bg-black border-white/20 focus:border-[#F1C40F] text-white min-h-[150px]"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-transparent hover:bg-[#F1C40F]/10 text-white border border-[#F1C40F] font-bold py-6 uppercase tracking-wider rounded-none" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT YOUR BRAND'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
