import React from 'react';
import { UserRole } from '../types';
import { Briefcase, User, Shield } from 'lucide-react';
import CTAButton from './ui/Button';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentRole, onRoleChange }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">
              Job Tracker
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-2">
              <CTAButton
                variant={currentRole === 'user' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onRoleChange('user')}
                className="flex items-center space-x-2"
              >
                <User className="h-4 w-4" />
                <span>User</span>
              </CTAButton>
              <CTAButton
                variant={currentRole === 'admin' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => onRoleChange('admin')}
                className="flex items-center space-x-2"
              >
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </CTAButton>
            </div>
            
            <div className="text-sm text-gray-500">
              {currentRole === 'user' ? 'User View' : 'Admin View'}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 