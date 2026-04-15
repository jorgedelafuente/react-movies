import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { configureAxe } from 'vitest-axe';

import LoginForm from './login-form/login-form.component';
import RegisterForm from './register-form/register-form.component';
import ResetPasswordForm from './reset-password-form/reset-password-form.component';
import LogoutForm from './logout-form/logout-form.component';
import Button from '@/components/atoms/button/button.component';

const axe = configureAxe({
   rules: {
      // jsdom does not fully implement pseudo-element styles used by this rule
      'color-contrast': { enabled: false },
   },
});

describe('LoginForm — accessibility', () => {
   it('has no violations on initial render', async () => {
      const { container } = render(<LoginForm />);
      expect(await axe(container)).toHaveNoViolations();
   });
});

describe('RegisterForm — accessibility', () => {
   it('has no violations on initial render', async () => {
      const { container } = render(<RegisterForm />);
      expect(await axe(container)).toHaveNoViolations();
   });
});

describe('ResetPasswordForm — accessibility', () => {
   it('has no violations on initial render', async () => {
      const { container } = render(<ResetPasswordForm />);
      expect(await axe(container)).toHaveNoViolations();
   });
});

describe('LogoutForm — accessibility', () => {
   it('has no violations on initial render', async () => {
      const { container } = render(<LogoutForm />);
      expect(await axe(container)).toHaveNoViolations();
   });
});

describe('Button — accessibility', () => {
   it('primary variant has no violations', async () => {
      const { container } = render(<Button variant="primary">Sign in</Button>);
      expect(await axe(container)).toHaveNoViolations();
   });

   it('secondary variant has no violations', async () => {
      const { container } = render(<Button variant="secondary">Cancel</Button>);
      expect(await axe(container)).toHaveNoViolations();
   });
});
