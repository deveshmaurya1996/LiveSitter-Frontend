import React, { useState } from 'react';
import { UserRole } from './types';
import Navbar from './components/Navbar';
import UserJobList from './components/UserJobList';
import AdminJobList from './components/AdminJobList';

const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('user');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar with Role Toggle */}
      <Navbar 
        currentRole={currentRole} 
        onRoleChange={setCurrentRole} 
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentRole === 'user' ? (
          <UserJobList />
        ) : (
          <AdminJobList />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Built with React, TypeScript, and Node.js</p>
            <p className="mt-1">Professional Job Application Tracking System</p>
            <p className="mt-1">Current View: {currentRole === 'user' ? 'User' : 'Admin'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App; 