const supabase = require('./supabaseClient');

/**
 * Sets up the database by creating necessary tables if they don't exist
 */
async function setupDatabase() {
  console.log('🔄 Setting up database tables...');

  try {
    // Create brands table if it doesn't exist
    await createBrandsTable();
    
    // Create contacts table if it doesn't exist
    await createContactsTable();
    
    // Create brand_leaderboard table if it doesn't exist
    await createBrandLeaderboardTable();
    
    // Create users table if it doesn't exist
    await createUsersTable();
    
    // Create subscribers table if it doesn't exist
    await createSubscribersTable();
    
    console.log('✅ Database setup completed successfully!');
    return true;
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    return false;
  }
}

async function createBrandsTable() {
  try {
    // Check if brands table exists
    const { error: checkError } = await supabase.from('brands').select('id').limit(1);
    
    if (checkError && checkError.code === '42P01') {
      console.log('Creating brands table...');
      const { error } = await supabase.rpc('create_brands_table');
      
      if (error) {
        throw new Error(`Failed to create brands table: ${error.message}`);
      }
      
      console.log('✅ Brands table created successfully!');
      
      // If we created the table, let's add the RPC function to insert initial data if needed
      const { error: rpcError } = await supabase.rpc('setup_brands_initial_data');
      if (rpcError) {
        console.warn('Warning: Could not set up initial brands data:', rpcError.message);
      }
    } else {
      console.log('✅ Brands table already exists');
    }
  } catch (error) {
    console.error('❌ Error with brands table:', error.message);
    
    // Fallback: create table directly if RPC fails
    try {
      console.log('Attempting direct table creation for brands...');
      const { error } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS public.brands (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          description TEXT,
          logo_url TEXT,
          website TEXT,
          instagram TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          status TEXT DEFAULT 'pending',
          email TEXT,
          phone TEXT,
          category TEXT,
          featured BOOLEAN DEFAULT false
        );
      `);
      
      if (error) {
        throw error;
      }
      console.log('✅ Brands table created using direct SQL');
    } catch (fallbackError) {
      console.error('❌ Fallback creation also failed:', fallbackError.message);
      throw fallbackError;
    }
  }
}

async function createContactsTable() {
  try {
    // Check if contacts table exists
    const { error: checkError } = await supabase.from('contacts').select('id').limit(1);
    
    if (checkError && checkError.code === '42P01') {
      console.log('Creating contacts table...');
      const { error } = await supabase.rpc('create_contacts_table');
      
      if (error) {
        throw new Error(`Failed to create contacts table: ${error.message}`);
      }
      
      console.log('✅ Contacts table created successfully!');
    } else {
      console.log('✅ Contacts table already exists');
    }
  } catch (error) {
    console.error('❌ Error with contacts table:', error.message);
    
    // Fallback: create table directly if RPC fails
    try {
      console.log('Attempting direct table creation for contacts...');
      const { error } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS public.contacts (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          message TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          phone TEXT,
          status TEXT DEFAULT 'new'
        );
      `);
      
      if (error) {
        throw error;
      }
      console.log('✅ Contacts table created using direct SQL');
    } catch (fallbackError) {
      console.error('❌ Fallback creation also failed:', fallbackError.message);
      throw fallbackError;
    }
  }
}

async function createBrandLeaderboardTable() {
  try {
    // Check if brand_leaderboard table exists
    const { error: checkError } = await supabase.from('brand_leaderboard').select('id').limit(1);
    
    if (checkError && checkError.code === '42P01') {
      console.log('Creating brand_leaderboard table...');
      const { error } = await supabase.rpc('create_brand_leaderboard_table');
      
      if (error) {
        throw new Error(`Failed to create brand_leaderboard table: ${error.message}`);
      }
      
      console.log('✅ Brand Leaderboard table created successfully!');
    } else {
      console.log('✅ Brand Leaderboard table already exists');
    }
  } catch (error) {
    console.error('❌ Error with brand_leaderboard table:', error.message);
    
    // Fallback: create table directly if RPC fails
    try {
      console.log('Attempting direct table creation for brand_leaderboard...');
      const { error } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS public.brand_leaderboard (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          brand_id UUID REFERENCES public.brands(id),
          votes INTEGER DEFAULT 0,
          last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
        );
      `);
      
      if (error) {
        throw error;
      }
      console.log('✅ Brand Leaderboard table created using direct SQL');
    } catch (fallbackError) {
      console.error('❌ Fallback creation also failed:', fallbackError.message);
      throw fallbackError;
    }
  }
}

async function createUsersTable() {
  try {
    // Check if users table exists
    const { error: checkError } = await supabase.from('users').select('id').limit(1);
    
    if (checkError && checkError.code === '42P01') {
      console.log('Creating users table...');
      const { error } = await supabase.rpc('create_users_table');
      
      if (error) {
        throw new Error(`Failed to create users table: ${error.message}`);
      }
      
      console.log('✅ Users table created successfully!');
    } else {
      console.log('✅ Users table already exists');
    }
  } catch (error) {
    console.error('❌ Error with users table:', error.message);
    
    // Fallback: create table directly if RPC fails
    try {
      console.log('Attempting direct table creation for users...');
      const { error } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS public.users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          name TEXT,
          role TEXT DEFAULT 'user',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          last_login TIMESTAMP WITH TIME ZONE
        );
      `);
      
      if (error) {
        throw error;
      }
      console.log('✅ Users table created using direct SQL');
    } catch (fallbackError) {
      console.error('❌ Fallback creation also failed:', fallbackError.message);
      throw fallbackError;
    }
  }
}

async function createSubscribersTable() {
  try {
    // Check if subscribers table exists
    const { error: checkError } = await supabase.from('subscribers').select('id').limit(1);
    
    if (checkError && checkError.code === '42P01') {
      console.log('Creating subscribers table...');
      const { error } = await supabase.rpc('create_subscribers_table');
      
      if (error) {
        throw new Error(`Failed to create subscribers table: ${error.message}`);
      }
      
      console.log('✅ Subscribers table created successfully!');
    } else {
      console.log('✅ Subscribers table already exists');
    }
  } catch (error) {
    console.error('❌ Error with subscribers table:', error.message);
    
    // Fallback: create table directly if RPC fails
    try {
      console.log('Attempting direct table creation for subscribers...');
      const { error } = await supabase.query(`
        CREATE TABLE IF NOT EXISTS public.subscribers (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          email TEXT UNIQUE NOT NULL,
          name TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          status TEXT DEFAULT 'active'
        );
      `);
      
      if (error) {
        throw error;
      }
      console.log('✅ Subscribers table created using direct SQL');
    } catch (fallbackError) {
      console.error('❌ Fallback creation also failed:', fallbackError.message);
      throw fallbackError;
    }
  }
}

module.exports = setupDatabase; 