import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { LogIn, LogOut, UserCircle } from 'lucide-react';

interface User {
  id: string;
  email?: string;
  user_metadata?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    const checkAuth = async () => {
      try {
        const session = await supabase.auth.getSession();
        if (session?.data?.session?.user) {
          setUser(session.data.session.user as unknown as User);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      if (session?.user) {
        setUser(session.user as unknown as User);
      } else {
        setUser(null);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const LoginForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password);
        alert('Verifica tu email para confirmar la cuenta');
      } else {
        await signIn(email, password);
        onSuccess?.();
      }
    } catch (error: any) {
      setError(error.message || 'Error de autenticación');
    } finally {
      setLoading(false);
    }
  };

  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to bottom right, rgb(15, 23, 42), rgb(15, 23, 42), rgb(49, 46, 129))',
    padding: '1.5rem'
  };

  const cardStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(51, 65, 85, 0.5) 0%, rgba(30, 41, 59, 0.5) 100%)',
    border: '2px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '1.5rem',
    padding: '3rem',
    maxWidth: '400px',
    width: '100%'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    background: 'rgba(30, 41, 59, 0.7)',
    border: '1px solid rgba(148, 163, 184, 0.3)',
    borderRadius: '0.5rem',
    color: 'white',
    fontSize: '1rem',
    marginBottom: '1rem',
    fontFamily: 'inherit'
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.75rem',
    background: 'rgb(59, 130, 246)',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s ease',
    marginBottom: '1rem'
  };

  const toggleButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    background: 'transparent',
    color: 'rgb(147, 197, 253)',
    border: '1px solid rgba(147, 197, 253, 0.3)',
    marginBottom: 0
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ color: 'white', fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
          🤖 Sofia Dashboard
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            disabled={loading}
          />

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'rgb(252, 87, 87)',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              marginBottom: '1rem',
              fontSize: '0.875rem'
            }}>
              {error}
            </div>
          )}

          <button type="submit" style={buttonStyle} disabled={loading}>
            <LogIn style={{ display: 'inline', marginRight: '0.5rem' }} width={16} height={16} />
            {loading ? 'Cargando...' : isSignUp ? 'Registarse' : 'Iniciar Sesión'}
          </button>
        </form>

        <button
          onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
          style={toggleButtonStyle}
          disabled={loading}
        >
          {isSignUp ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Registrate'}
        </button>
      </div>
    </div>
  );
};

export const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();

  if (!user) return null;

  const profileStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.75rem 1.5rem',
    background: 'rgba(30, 41, 59, 0.7)',
    borderRadius: '0.5rem',
    border: '1px solid rgba(148, 163, 184, 0.2)'
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div style={profileStyle}>
      <UserCircle width={24} height={24} style={{ color: 'rgb(147, 197, 253)' }} />
      <span style={{ color: 'white', fontSize: '0.875rem' }}>
        {user.email}
      </span>
      <button
        onClick={handleSignOut}
        style={{
          background: 'rgb(239, 68, 68)',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginLeft: 'auto'
        }}
      >
        <LogOut width={16} height={16} />
        Salir
      </button>
    </div>
  );
};
