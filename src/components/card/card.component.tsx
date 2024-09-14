import { ReactNode } from 'react';
import './card.styles.css';

const Card = ({ children }: { children: ReactNode }) => {
    return <div className="custom-card">{children}</div>;
};

export default Card;
