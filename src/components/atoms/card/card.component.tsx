import './card.styles.css';

import { ReactNode } from 'react';

const Card = ({ children }: { children: ReactNode }) => {
   return <div className="custom-card">{children}</div>;
};

export default Card;
