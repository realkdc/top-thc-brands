import { useState } from 'react';
import { rateBrand } from '@/api/leaderboardService';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CriteriaTooltip from './CriteriaTooltip';
import { X } from 'lucide-react';

interface BrandRatings {
  potency: number;
  flavor: number;
  effects: number;
  value: number;
  overall: number;
}

interface Brand {
  _id: string;
  name: string;
  image: string;
  description?: string;
  ratings?: BrandRatings;
}

interface RatingModalProps {
  brand: Brand;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RatingModal = ({ brand, isOpen, onClose, onSuccess }: RatingModalProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ratings, setRatings] = useState<BrandRatings>({
    potency: 5,
    flavor: 5,
    effects: 5,
    value: 5,
    overall: 5,
  });

  const handleRatingChange = (type: keyof BrandRatings, value: number[]) => {
    setRatings((prev) => ({
      ...prev,
      [type]: value[0],
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await rateBrand(brand._id, ratings);
      toast({
        title: 'Rating Submitted',
        description: `Your rating for ${brand.name} has been recorded.`,
      });
      onSuccess();
    } catch (error) {
      console.error('Error submitting rating:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit your rating. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-thc-black/90 border-thc-grey/30 relative">
        <DialogClose className="absolute right-4 top-4 rounded-sm ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none">
          <X className="h-5 w-5 text-thc-white hover:text-thc-gold" />
          <span className="sr-only">Close</span>
        </DialogClose>
        
        <DialogHeader>
          <DialogTitle className="text-xl text-thc-gold">Rate {brand.name}</DialogTitle>
          <DialogDescription className="text-thc-white/80">
            Rate this brand on a scale from 1-10 for each category
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <RatingSlider
              label="Potency"
              type="potency"
              value={ratings.potency}
              onChange={(value) => handleRatingChange('potency', value)}
            />
            <RatingSlider
              label="Flavor"
              type="flavor"
              value={ratings.flavor}
              onChange={(value) => handleRatingChange('flavor', value)}
            />
            <RatingSlider
              label="Effects"
              type="effects"
              value={ratings.effects}
              onChange={(value) => handleRatingChange('effects', value)}
            />
            <RatingSlider
              label="Value"
              type="value"
              value={ratings.value}
              onChange={(value) => handleRatingChange('value', value)}
            />
            <RatingSlider
              label="Overall"
              type="overall"
              value={ratings.overall}
              onChange={(value) => handleRatingChange('overall', value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-thc-grey/40 text-thc-white hover:bg-thc-grey/20"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-thc-gold text-thc-black hover:bg-thc-gold/90"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Rating'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface RatingSliderProps {
  label: string;
  type: keyof BrandRatings;
  value: number;
  onChange: (value: number[]) => void;
}

const RatingSlider = ({ label, type, value, onChange }: RatingSliderProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h4 className="text-sm font-medium text-thc-white">{label}</h4>
          <CriteriaTooltip type={type} />
        </div>
        <div className="text-thc-gold font-medium">
          {value} <span className="text-xs text-thc-white/70">/ 10</span>
        </div>
      </div>
      <Slider
        defaultValue={[value]}
        min={1}
        max={10}
        step={1}
        onValueChange={onChange}
        className="[&>span]:bg-thc-gold"
      />
      <div className="flex justify-between text-xs text-thc-white/60">
        <span>Poor</span>
        <span>Excellent</span>
      </div>
    </div>
  );
};

export default RatingModal; 