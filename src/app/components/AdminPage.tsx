import { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

export default function AdminPage() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setChecking(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/session', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.session?.access_token) {
          setAccessToken(data.session.access_token);
        } else {
          localStorage.removeItem('adminToken');
        }
      } else {
        localStorage.removeItem('adminToken');
      }
    } catch (e) {
      console.error('Session check failed', e);
    }
    setChecking(false);
  };

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('adminToken', token);
    setAccessToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setAccessToken(null);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FAF5EB] via-[#FCFAF2] to-[#EADBC8] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#C5A880]/30 border-t-[#C5A880] rounded-full animate-spin" />
      </div>
    );
  }

  if (!accessToken) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminDashboard accessToken={accessToken} onLogout={handleLogout} />;
}