const supabase = require('../utils/supabaseClient');
const crypto = require('crypto');

// Subscribe to newsletter
const subscribe = async (req, res) => {
  const { email, name, source } = req.body;
  
  // Validate email
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Valid email is required' });
  }
  
  try {
    // Generate confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    
    // Get IP address from request
    const ipAddress = req.headers['x-forwarded-for'] || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress || 
                     req.connection.socket?.remoteAddress;
    
    // Check if subscribers table has the confirmed column
    try {
      // First attempt to add the missing column - this is a safeguard
      await supabase.rpc('exec_sql', { 
        sql: `ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS confirmed BOOLEAN DEFAULT FALSE;
              ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS unsubscribed BOOLEAN DEFAULT FALSE;
              ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS confirmation_token TEXT;
              ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS ip_address TEXT;
              ALTER TABLE public.subscribers ADD COLUMN IF NOT EXISTS unsubscribed_at TIMESTAMP WITH TIME ZONE;`
      }).catch(e => console.log('RPC not available, column may already exist or need manual addition'));
    } catch (columnError) {
      console.log('Column check/add attempt error (non-fatal):', columnError);
    }
    
    // Check if the email already exists
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('subscribers')
      .select('id, email, source')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    
    if (checkError && !checkError.message.includes('does not exist')) {
      console.error('Error checking subscriber:', checkError);
      return res.status(500).json({ 
        success: false, 
        message: 'Error processing your request. Please try again.' 
      });
    }
    
    // If subscriber already exists
    if (existingSubscriber) {
      // In this simplified version, we'll just acknowledge they're already subscribed
      return res.status(200).json({
        success: true,
        message: 'You are already subscribed to our newsletter!',
        data: { email, alreadySubscribed: true }
      });
    }
    
    // Add new subscriber - keeping it simple without columns that might not exist
    const { data, error } = await supabase
      .from('subscribers')
      .insert([
        { 
          email: email.toLowerCase(),
          name: name || null,
          source: source || 'website'
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating subscriber:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error processing your request. Please try again.' 
      });
    }
    
    // Success response
    res.status(201).json({
      success: true,
      message: 'You have been subscribed to our newsletter!',
      data: { email }
    });
  } catch (error) {
    console.error('Error in subscribe controller:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing your request. Please try again.' 
    });
  }
};

// Unsubscribe from newsletter - simplified version
const unsubscribe = async (req, res) => {
  const { email } = req.query;
  
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }
  
  try {
    // Delete the subscriber instead of marking as unsubscribed (simpler)
    const { error } = await supabase
      .from('subscribers')
      .delete()
      .eq('email', email.toLowerCase());
    
    if (error) {
      console.error('Error unsubscribing:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error processing your request. Please try again.' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'You have been unsubscribed from our newsletter.'
    });
  } catch (error) {
    console.error('Error in unsubscribe controller:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error processing your request. Please try again.' 
    });
  }
};

module.exports = {
  subscribe,
  unsubscribe
}; 