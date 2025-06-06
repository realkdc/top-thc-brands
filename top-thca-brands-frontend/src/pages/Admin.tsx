import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isAuthenticated, isAdmin, logout } from '@/api/authService';
import BrandManagement from '@/components/admin/BrandManagement';
import ContactManagement from '@/components/admin/ContactManagement';
import UserManagement from '@/components/admin/UserManagement';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('brands');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and is admin
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
    
    // Only admins can access the users tab
    if (!isAdmin() && activeTab === 'users') {
      setActiveTab('brands');
    }
  }, [activeTab, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-gray-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Top THC Brands - Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3 mb-8 bg-slate-300">
            <TabsTrigger value="brands" className="text-gray-800 data-[state=active]:bg-white data-[state=active]:text-primary">Brands</TabsTrigger>
            <TabsTrigger value="contacts" className="text-gray-800 data-[state=active]:bg-white data-[state=active]:text-primary">Contact Submissions</TabsTrigger>
            {isAdmin() && <TabsTrigger value="users" className="text-gray-800 data-[state=active]:bg-white data-[state=active]:text-primary">Users</TabsTrigger>}
          </TabsList>
          
          <TabsContent value="brands" className="bg-white rounded-lg shadow-md p-6 text-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Brand Management</h2>
            <BrandManagement />
          </TabsContent>
          
          <TabsContent value="contacts" className="bg-white rounded-lg shadow-md p-6 text-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Contact Submissions</h2>
            <ContactManagement />
          </TabsContent>
          
          {isAdmin() && (
            <TabsContent value="users" className="bg-white rounded-lg shadow-md p-6 text-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-gray-800">User Management</h2>
              <UserManagement />
            </TabsContent>
          )}
        </Tabs>
      </main>
      
      <footer className="bg-gray-900 text-white py-4">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Top THC Brands - Admin Portal
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Admin; 