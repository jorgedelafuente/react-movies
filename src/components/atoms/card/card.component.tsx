import './card.styles.css';

import { ReactNode } from 'react';

const Card = ({ children }: { children: ReactNode }) => {
   return <div className="custom-card w-full">{children}</div>;
};

export default Card;
