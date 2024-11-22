import React from "react";

const DefaultTeamLogo = () => {
  return (
    <svg
      width="150"
      height="150"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="text-black dark:text-white"
      fill="currentColor"
    >
      <circle cx="100" cy="50" r="30" className="fill-current" />
      <circle cx="50" cy="130" r="30" className="fill-current" />
      <circle cx="150" cy="130" r="30" className="fill-current" />

      <path
        d="M50 130 Q100 180 150 130 Q100 80 50 130"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
      />
    </svg>
  );
};

export default DefaultTeamLogo;
