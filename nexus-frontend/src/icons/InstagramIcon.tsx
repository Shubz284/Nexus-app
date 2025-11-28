export const InstagramIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
    >
      <defs>
        <linearGradient
          id="instagramGradient"
          x1="0%"
          y1="100%"
          x2="100%"
          y2="0%"
        >
          <stop offset="0%" style={{ stopColor: "#FFD521" }} />
          <stop offset="5%" style={{ stopColor: "#F7A32B" }} />
          <stop offset="50%" style={{ stopColor: "#E1306C" }} />
          <stop offset="100%" style={{ stopColor: "#C13584" }} />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        ry="5"
        stroke="url(#instagramGradient)"
        strokeWidth="2"
        fill="none"
      ></rect>
      <path
        d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
        stroke="url(#instagramGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      ></path>
      <circle cx="17.5" cy="6.5" r="1" fill="url(#instagramGradient)"></circle>
    </svg>
  );
};
