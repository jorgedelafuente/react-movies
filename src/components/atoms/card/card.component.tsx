import { ReactNode } from 'react';
import './card.styles.scss';

const Card = ({ children }: { children: ReactNode }) => {
   return <div className="custom-card">{children}</div>;
};

export default Card;
