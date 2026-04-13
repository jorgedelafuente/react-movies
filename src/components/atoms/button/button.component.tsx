import type { ReactNode } from 'react';

const VARIANTS = {
   primary:
      'border-2 border-solid border-copy bg-gradient-to-b from-transparent to-transparent py-1 text-copy transition-all hover:border-sky-500 hover:from-copy/5 hover:to-copy/20 hover:text-sky-500 disabled:opacity-50',
   secondary:
      'border border-solid border-copy/20 bg-gradient-to-b from-transparent to-transparent py-1 text-copy/60 transition-all hover:border-sky-500/40 hover:from-copy/0 hover:to-copy/10 hover:text-sky-500/80 disabled:opacity-50',
} as const;

type ButtonVariant = keyof typeof VARIANTS;

type ButtonProps = {
   children: ReactNode;
   variant: ButtonVariant;
   type?: 'submit' | 'button' | 'reset';
   disabled?: boolean;
   onClick?: () => void;
   className?: string;
};

const Button = ({
   children,
   variant,
   type = 'button',
   disabled,
   onClick,
   className = 'w-full',
}: ButtonProps) => {
   return (
      <button
         type={type}
         disabled={disabled}
         onClick={onClick}
         className={`${VARIANTS[variant]} ${className}`.trim()}
      >
         {children}
      </button>
   );
};

export default Button;
