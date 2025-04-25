import { useEffect } from 'react';
import LoginForm from '@/components/admin/LoginForm';
import { Helmet } from 'react-helmet';

export default function AdminLoginPage() {
  // Update document title
  useEffect(() => {
    document.title = 'Admin Login | SpicePop';
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Admin Login | SpicePop</title>
      </Helmet>
      
      <LoginForm />
    </>
  );
}
