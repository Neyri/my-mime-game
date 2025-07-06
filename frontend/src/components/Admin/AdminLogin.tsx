import React, { useState } from 'react';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    // TODO: Implement actual authentication
    if (password === 'admin123') { // Temporary hardcoded password
      onLogin();
    } else {
      alert('Invalid password'); // Using native alert since we removed Chakra UI
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Login</h1>
      <div className="max-w-md mx-auto">
        <input
          type="password"
          placeholder="Enter admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg mb-4"
        />
        <button onClick={handleLogin} className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
          Login
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
