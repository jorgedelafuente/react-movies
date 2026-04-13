const LoginIcon = ({
   tabIndex,
   onClick,
}: {
   tabIndex?: number;
   onClick?: () => void;
}) => {
   return (
      <button className="cursor-pointer" tabIndex={tabIndex} onClick={onClick}>
         <LoginSvgIcon />
      </button>
   );
};

export default LoginIcon;

const LoginSvgIcon = () => (
   <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mr-2 h-6 w-6"
   >
      <circle cx="12" cy="8" r="3" className="fill-sky-400/20 stroke-sky-500" />
      <path d="M6 20a6 6 0 0 1 12 0" className="stroke-sky-500" />
   </svg>
);
