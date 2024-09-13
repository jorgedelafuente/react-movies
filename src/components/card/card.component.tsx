import { ReactNode } from '@tanstack/react-router';

const Card = ({ children }: { children: ReactNode }) => {
    return (
        <div className="border-white-700 shadow-l shadow-white-200 h-96 w-full border-spacing-8 gap-2 rounded-2xl p-8 sm:w-full md:w-80">
            {children}
        </div>
    );
};

export default Card;
