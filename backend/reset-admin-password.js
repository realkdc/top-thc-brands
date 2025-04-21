require('dotenv').config();
const bcrypt = require('bcryptjs');
const supabase = require('./src/utils/supabaseClient');

const resetAdminPassword = async () => {
  try {
    const email = 'admin@topthcbrands.com';
    const password = 'Thc@dmin2024';
    
    console.log(`Resetting password for admin user: ${email}`);
    
    // Generate new hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    console.log('Generated new password hash');
    
    // Update the user record
    const { data, error } = await supabase
      .from('users')
      .update({ password: hashedPassword })
      .eq('email', email)
      .select();
    
    if (error) {
      console.error('Error updating admin password:', error);
    } else {
      console.log('✅ Admin password reset successfully!');
      console.log(`Email: ${email}`);
      console.log(`Password: ${password}`);
      console.log('New hash:', hashedPassword);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};

resetAdminPassword()
  .then(() => {
    console.log('Password reset operation completed.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
  }); 