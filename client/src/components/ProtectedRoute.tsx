import { Navigate, useRouter } from '@tanstack/react-router';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireMedicalLicense?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
}: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  if (!isAuthenticated) {
    throw Navigate({ to: '/login', search: { redirect: router.state.location.href } });
  }

  return <>{children}</>;
};