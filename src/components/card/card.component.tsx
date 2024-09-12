import { ReactNode } from '@tanstack/react-router';
// import './Card.styles.css';

const Card = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-20 w-64 border-spacing-8 gap-2 rounded-2xl border-2 border-black">
      {children}
    </div>
  );
};

export default Card;
