import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from '@/api/axiosConfig';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FaRegPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface NewsletterFormProps {
  source?: string;
  className?: string;
  buttonText?: string;
  placeholderText?: string;
}

interface FormValues {
  email: string;
  name?: string;
}

const NewsletterForm = ({
  source = 'website',
  className = '',
  buttonText = 'Subscribe',
  placeholderText = 'Enter your email'
}: NewsletterFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormValues>();
  
  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true);
      
      const response = await axios.post('/subscribe', {
        ...data,
        source
      });
      
      setSuccess(true);
      
      toast({
        title: "Success!",
        description: response.data.message || "You've been subscribed to our newsletter.",
        variant: "default",
      });
      
      // Reset form after 2 seconds to show success state
      setTimeout(() => {
        reset();
        setSuccess(false);
      }, 2000);
      
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      
      toast({
        title: "Error",
        description: error.response?.data?.message || "There was an error subscribing you. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.form 
      initial={{ opacity: 0.9, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onSubmit)} 
      className={`flex flex-col sm:flex-row gap-3 ${className}`}
    >
      <div className="flex-1 relative">
        <Input
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          placeholder={placeholderText}
          type="email"
          className={`
            w-full bg-black border-white/20 focus:border-[#F1C40F] text-white 
            pl-4 pr-4 py-3 rounded-md transition-all duration-200 
            focus:ring-2 focus:ring-[#F1C40F]/30 focus:outline-none
            ${errors.email ? 'border-red-500' : ''}
            ${success ? 'border-green-500' : ''}
          `}
          disabled={isSubmitting || success}
        />
        {errors.email && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-xs text-red-500 absolute"
          >
            {errors.email.message}
          </motion.p>
        )}
      </div>
      
      <Button 
        type="submit" 
        className={`
          relative overflow-hidden group
          ${success ? 'bg-green-600 hover:bg-green-700' : 'bg-transparent hover:bg-[#F1C40F]/10'} 
          text-white border border-[#F1C40F] font-bold py-3 
          uppercase tracking-wider rounded-md min-w-32
          transition-all duration-200 ease-in-out
          flex items-center justify-center gap-2
        `}
        disabled={isSubmitting || success}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <span className="animate-spin h-4 w-4 border-2 border-white rounded-full border-t-transparent" />
            <span>SUBSCRIBING...</span>
          </div>
        ) : success ? (
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>SUBSCRIBED</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <FaRegPaperPlane className="text-sm opacity-70 group-hover:translate-x-1 transition-transform duration-200" />
            <span>{buttonText}</span>
          </div>
        )}
        <motion.div 
          className="absolute bottom-0 left-0 h-0.5 bg-[#F1C40F]"
          initial={{ width: 0 }}
          animate={{ width: isSubmitting ? '100%' : 0 }}
          transition={{ duration: 1 }}
        />
      </Button>
    </motion.form>
  );
};

export default NewsletterForm; 