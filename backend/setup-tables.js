require('dotenv').config();
const supabase = require('./src/utils/supabaseClient');

const createTables = async () => {
  console.log('Creating tables directly in Supabase...');
  
  try {
    // Create users table
    console.log('Creating users table...');
    const { error: usersError } = await supabase.rpc('create_tables', {
      sql_commands: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'editor',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        
        CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
        CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      `
    });
    
    if (usersError) {
      console.log('Error creating users table, trying direct SQL...');
      // Try direct SQL query as fallback
      const { error: directError } = await supabase.from('users').insert({
        name: 'Admin User',
        email: 'admin@example.com',
        password: '$2a$10$qqnXnQ4Ppz0bqXQiMaHM7uH3NBq.ZXcHnsnJCFXMAAJJl.XiVjqTS', // hashed "admin123"
        role: 'admin'
      });
      
      if (directError) {
        console.error('Error with direct insert:', directError);
      } else {
        console.log('✅ Created admin user directly');
      }
    } else {
      console.log('✅ Users table created');
    }
    
    // Create brands table
    console.log('Creating brands table...');
    const { error: brandsError } = await supabase.rpc('create_tables', {
      sql_commands: `
        CREATE TABLE IF NOT EXISTS brands (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          description TEXT,
          logo TEXT,
          website_url TEXT,
          rank INTEGER,
          is_active BOOLEAN DEFAULT TRUE,
          thc_percentage TEXT,
          cbd_percentage TEXT,
          image TEXT,
          category TEXT,
          rating NUMERIC,
          featured BOOLEAN DEFAULT FALSE,
          product_types TEXT[],
          location TEXT,
          slug TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
    });
    
    if (brandsError) {
      console.log('Error creating brands table, trying direct table creation via SQL API...');
      // Try direct SQL query via SQL API
      const { error: sqlError } = await supabase.rpc('sql', {
        query: `
          CREATE TABLE IF NOT EXISTS brands (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            description TEXT,
            image TEXT,
            category TEXT,
            rating NUMERIC,
            featured BOOLEAN DEFAULT FALSE,
            website TEXT,
            product_types TEXT[],
            location TEXT,
            slug TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `
      });
      
      if (sqlError) {
        console.error('Failed to create brands table via SQL API:', sqlError);
        
        // Last resort: Try creating a simple brand to force table creation
        console.log('Attempting to create a test brand to force table creation...');
        const { error: insertError } = await supabase.from('brands').insert({
          name: 'Test Brand',
          description: 'Test description',
          category: 'Test',
          rating: 5
        });
        
        if (insertError) {
          console.error('Could not create test brand:', insertError);
        } else {
          console.log('✅ Created test brand successfully, table should now exist');
        }
      } else {
        console.log('✅ Brands table created via SQL API');
      }
    } else {
      console.log('✅ Brands table created');
    }
    
    // Create contacts table 
    console.log('Creating contacts table...');
    const { error: contactsError } = await supabase.rpc('create_tables', {
      sql_commands: `
        CREATE TABLE IF NOT EXISTS contacts (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          message TEXT NOT NULL,
          status TEXT DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
    });
    
    if (contactsError) {
      console.log('Error creating contacts table, trying direct table creation...');
      // Try direct insert to create table
      const { error: insertError } = await supabase.from('contacts').insert({
        name: 'Test Contact',
        email: 'test@example.com',
        message: 'Test message',
        status: 'pending'
      });
      
      if (insertError) {
        console.error('Could not create test contact:', insertError);
      } else {
        console.log('✅ Created test contact successfully, table should now exist');
      }
    } else {
      console.log('✅ Contacts table created');
    }
    
    // Create admin user if not exists
    console.log('Creating admin user...');
    const { data: adminData, error: adminCheckError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'admin@topthcbrands.com')
      .single();
      
    if (adminCheckError || !adminData) {
      const { error: adminError } = await supabase.from('users').insert({
        name: 'Admin User',
        email: 'admin@topthcbrands.com',
        password: '$2a$10$Njd.1gXAXDRF39XYgS3.me6CsWCGzh.QmMvPbz8UVx37qwqyDpKhy', // hashed password for "Thc@dmin2024"
        role: 'admin'
      });
      
      if (adminError) {
        console.error('Error creating admin user:', adminError);
      } else {
        console.log('✅ Admin user created successfully');
        console.log('Email: admin@topthcbrands.com');
        console.log('Password: Thc@dmin2024');
      }
    } else {
      console.log('✅ Admin user already exists');
    }
    
    console.log('Tables setup complete!');
  } catch (error) {
    console.error('Error in table creation:', error);
  }
};

createTables().catch(console.error); 