import { AUTH_MODAL_MODE } from '@/types/auth.types';
import LoginForm from '@/components/auth/login-form/login-form.component';
import RegisterForm from '@/components/auth/register-form/register-form.component';
import ResetPasswordForm from '@/components/auth/reset-password-form/reset-password-form.component';
import LogoutForm from '@/components/auth/logout-form/logout-form.component';

const AuthModalContent = ({ mode }: { mode: AUTH_MODAL_MODE }) => {
   if (mode === AUTH_MODAL_MODE.SIGNUP) return <RegisterForm />;
   if (mode === AUTH_MODAL_MODE.RESET_PASSWORD) return <ResetPasswordForm />;
   if (mode === AUTH_MODAL_MODE.LOGOUT) return <LogoutForm />;
   return <LoginForm />;
};

export default AuthModalContent;
