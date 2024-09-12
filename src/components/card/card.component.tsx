import { ReactNode } from '@tanstack/react-router';

const Card = ({ children }: { children: ReactNode }) => {
    return (
        <div className="border-white-700 shadow-l h-80 w-full border-spacing-8 gap-2 rounded-2xl border-2 bg-red-200 p-4 shadow-blue-200 sm:w-full md:w-80">
            {children}
        </div>
    );
};

export default Card;
