import { rateBrand } from '@/api/leaderboardService';

interface PendingRating {
  brandId: string;
  ratings: {
    potency: number;
    flavor: number;
    effects: number;
    value: number;
    overall: number;
  };
  timestamp: string;
}

/**
 * Attempts to submit all pending ratings stored in localStorage
 * @returns Promise that resolves with the number of successfully submitted ratings
 */
export const submitPendingRatings = async (): Promise<number> => {
  const pendingRatings: PendingRating[] = JSON.parse(
    localStorage.getItem('pendingRatings') || '[]'
  );

  if (pendingRatings.length === 0) return 0;

  console.log(`Found ${pendingRatings.length} pending ratings to submit`);
  
  // Track successful submissions
  let successCount = 0;
  const newPendingRatings: PendingRating[] = [];

  // Process each pending rating
  for (const rating of pendingRatings) {
    try {
      await rateBrand(rating.brandId, rating.ratings);
      successCount++;
      console.log(`Successfully submitted pending rating for brand ${rating.brandId}`);
    } catch (error) {
      console.error(`Failed to submit pending rating for brand ${rating.brandId}:`, error);
      // Keep ratings that failed to submit, but only if they're less than 7 days old
      const ratingDate = new Date(rating.timestamp);
      const now = new Date();
      const daysDiff = (now.getTime() - ratingDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysDiff < 7) {
        newPendingRatings.push(rating);
      }
    }
  }

  // Update localStorage with any remaining pending ratings
  localStorage.setItem('pendingRatings', JSON.stringify(newPendingRatings));

  return successCount;
};

/**
 * Gets the count of pending ratings
 * @returns The number of pending ratings
 */
export const getPendingRatingsCount = (): number => {
  const pendingRatings: PendingRating[] = JSON.parse(
    localStorage.getItem('pendingRatings') || '[]'
  );
  return pendingRatings.length;
}; 