// src/pages/auth/Login.jsx
import { useState, useContext } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { toast } from 'react-toastify';
import { Helmet } from "react-helmet-async";
import LoginCard from '../../components/auth/LoginCard';
import LoginForm from '../../components/auth/LoginForm';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { theme } = useContext(ThemeContext);
  const { login } = useAuth();
  
  const handleLogin = async (username, password) => {
    setLoading(true);
    const success = await login(username, password);
    setLoading(false);

    if (success) {
      toast.success('Login successful!');
    } else {
      toast.error('Login failed. Please check your credentials.');
    }
  };


  return (
    <>
      <Helmet>
        {/* Title & Description */}
        <title>Login - MSK Institute</title>
        <meta
          name="description"
          content="Login securely to your MSK Institute account. Students, teachers, and admins can access courses, dashboards, progress tracking, and support."
        />
        <meta
          name="keywords"
          content="MSK Institute login, student login, teacher login, admin portal, MSK dashboard access"
        />
        <meta name="author" content="MSK Institute" />

        {/* Prevent indexing (recommended for login pages) */}
        <meta name="robots" content="noindex, nofollow" />

        {/* Canonical */}
        <link rel="canonical" href="https://msk.shikohabad.in/login" />

        {/* Open Graph */}
        <meta property="og:title" content="Login – MSK Institute Portal" />
        <meta
          property="og:description"
          content="Secure login for students, teachers, and administrators at MSK Institute."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://msk.shikohabad.in/login" />
        <meta property="og:image" content="https://msk.shikohabad.in/static/images/msk-login-banner.jpg" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Login – MSK Institute Portal" />
        <meta
          name="twitter:description"
          content="Access your MSK Institute account securely. For students, faculty, and administrators."
        />
        <meta name="twitter:image" content="https://msk.shikohabad.in/static/images/msk-login-banner.jpg" />

        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Login - MSK Institute",
            "url": "https://msk.shikohabad.in/login",
            "description": "Secure login page for MSK Institute students, teachers, and admins to access courses, dashboards, and progress.",
            "potentialAction": {
              "@type": "LoginAction",
              "target": "https://msk.shikohabad.in/login"
            },
            "publisher": {
              "@type": "EducationalOrganization",
              "name": "MSK Institute",
              "url": "https://msk.shikohabad.in"
            }
          })}
        </script>
      </Helmet>


      <div className={`min-h-screen flex items-center justify-center px-4 py-12 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'
        }`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, ${theme === 'dark' ? '#3B82F6' : '#60A5FA'} 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${theme === 'dark' ? '#8B5CF6' : '#A78BFA'} 0%, transparent 50%)`
          }}></div>
        </div>

        <div className="relative z-10">
          <LoginCard>
            <LoginForm onSubmit={handleLogin} loading={loading} />
          </LoginCard>
        </div>
      </div>
    </>
  );
};

export default Login;