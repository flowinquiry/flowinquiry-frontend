import React from "react";

const DefaultUserLogo = () => {
  return (
    <svg
      width="150"
      height="150"
      viewBox="0 0 150 150"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-300 dark:text-gray-600"
      fill="currentColor"
    >
      <circle cx="75" cy="75" r="75" className="fill-current" />

      <circle
        cx="75"
        cy="60"
        r="30"
        className="fill-current text-gray-400 dark:text-gray-500"
      />

      <path
        d="M30 115c0-20 20-30 45-30s45 10 45 30"
        className="fill-current text-gray-400 dark:text-gray-500"
      />
    </svg>
  );
};

export default DefaultUserLogo;
