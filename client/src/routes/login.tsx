import { createFileRoute, Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import z from 'zod';

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const { redirect } = useSearch({ from: '/login' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate({ to: redirect || '/account', replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    navigate({ to: '/account', replace: true });
    return null;
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-medical-white p-8 rounded-lg shadow-lg max-w-md w-full"
      >
        <h2 className="text-2xl font-bold text-medical-text mb-6">Medical Professional Login</h2>
        
        {error && (
          <div className="bg-brand-coral/10 border border-brand-coral text-brand-coral px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-medical-text mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-medical-gray rounded-lg focus:ring-2 focus:ring-brand-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-medical-text mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-medical-gray rounded-lg focus:ring-2 focus:ring-brand-primary pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-medical-text-secondary"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-brand-primary hover:bg-brand-secondary disabled:bg-medical-gray text-white py-3 rounded-lg font-medium transition-colors"
          >
            {isLoading ? 'Authenticating...' : 'Connexion'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link to="/register" className="text-brand-primary hover:underline">
            Créer un Compte
          </Link>
        </div>

        {/* Medical disclaimer */}
        <div className="mt-8 p-4 bg-brand-primary/10 rounded-lg text-xs text-medical-text-secondary">
          <p>🔒 This portal is for licensed healthcare professionals only. Unauthorized access is prohibited.</p>
        </div>
      </motion.div>
    </div>
  );
}