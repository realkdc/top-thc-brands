require('dotenv').config();
const bcrypt = require('bcryptjs');
const supabase = require('./src/utils/supabaseClient');

const createAdmin = async () => {
  try {
    // Admin credentials
    const adminEmail = 'admin@topthcbrands.com';
    const adminPassword = 'Thc@dmin2024';
    const adminName = 'Admin User';
    
    console.log(`Creating admin user with email: ${adminEmail}`);
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    // Insert the admin user
    console.log('Inserting admin user into the users table...');
    const { data, error } = await supabase.from('users').insert({
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: 'admin'
    }).select();
    
    if (error) {
      console.error('Error creating admin user:', error);
    } else {
      console.log('✅ Admin user created successfully!');
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

createAdmin().then(() => {
  console.log('Done!');
}); 