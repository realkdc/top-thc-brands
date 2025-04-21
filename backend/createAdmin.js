require('dotenv').config();
const bcrypt = require('bcryptjs');
const supabase = require('./src/utils/supabaseClient');

/**
 * Create an admin user in the Supabase database
 */
async function createAdminUser() {
  console.log('Force creating admin user...');
  
  try {
    // Default admin credentials
    const adminEmail = 'admin@topthcbrands.com';
    const adminPassword = 'Thc@dmin2024'; // In a production environment, use a secure password
    const adminName = 'Admin User';
    
    // Check if users table exists
    try {
      // Try to delete any existing user with the same email to avoid conflicts
      console.log(`Checking for existing user with email: ${adminEmail}`);
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('email', adminEmail);
      
      console.log(`Note: Delete operation result: ${deleteError ? deleteError.message : 'success'}`);
    } catch (err) {
      console.log('Note: Error during delete check, may be first run:', err.message);
    }
    
    console.log('Creating new admin user...');
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    // Insert the admin user
    const { data: user, error } = await supabase
      .from('users')
      .insert([
        {
          email: adminEmail,
          password: hashedPassword,
          name: adminName,
          role: 'admin'
        }
      ])
      .select();
    
    if (error) {
      throw new Error(`Error inserting user: ${error.message}`);
    }
    
    console.log('✅ Admin user created successfully:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('ID:', user[0].id);
    
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

// Run the function
createAdminUser()
  .then((success) => {
    if (success) {
      console.log('Admin creation process completed successfully');
    } else {
      console.error('Admin creation process failed');
    }
    process.exit(success ? 0 : 1);
  })
  .catch((err) => {
    console.error('Unhandled error:', err);
    process.exit(1);
  }); 