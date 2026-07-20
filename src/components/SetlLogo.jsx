// Setl star logo (big 4-point star + sparkles), taken from the Figma design.
export default function SetlLogo({ className = '' }) {
  return (
    <svg
      width="60"
      height="85"
      viewBox="0 0 60 85"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient
          id="setl-star-gradient"
          x1="60.83"
          y1="70.76"
          x2="6.41"
          y2="17.64"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FCB4FD" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
      </defs>

      {/* big star */}
      <path
        d="M29.9449 0C24.9979 29.8018 20.9981 35.4884 0 42.5022C20.9981 49.5131 25.004 55.1982 29.9449 85C34.8857 55.2027 38.8916 49.5161 59.8852 42.5022C38.8916 35.4884 34.8857 29.8018 29.9449 0Z"
        fill="url(#setl-star-gradient)"
      />
      {/* sparkles */}
      <g transform="translate(4 17)">
        <path
          d="M4.74344 13.4677C5.52687 8.74544 6.16035 7.83891 9.48688 6.73388C6.15882 5.62292 5.52381 4.7223 4.74344 0C3.96001 4.7223 3.32653 5.62885 0 6.73388C3.32653 7.84483 3.96154 8.74544 4.74344 13.4677Z"
          fill="url(#setl-star-gradient)"
        />
      </g>
      <g transform="translate(47 55)">
        <path
          d="M4.74344 0C3.96001 4.7223 3.32653 5.62884 0 6.73387C3.32806 7.84483 3.96307 8.74545 4.74344 13.4678C5.52687 8.74545 6.16035 7.8389 9.48688 6.73387C6.15729 5.62291 5.52687 4.7223 4.74344 0Z"
          fill="url(#setl-star-gradient)"
        />
      </g>
      <g transform="translate(3 55)">
        <path
          d="M7.52065 0C6.2797 7.4834 5.2744 8.90987 0 10.6652C5.2744 12.4249 6.27358 13.8529 7.52065 21.3304C8.76159 13.847 9.76689 12.4205 15.0413 10.6652C9.76689 8.90987 8.76159 7.4834 7.52065 0Z"
          fill="url(#setl-star-gradient)"
        />
      </g>
      <g transform="translate(43 8)">
        <path
          d="M6.80148 19.301C7.92308 12.5331 8.83351 11.2429 13.603 9.65051C8.83351 8.05814 7.92308 6.76795 6.80148 0C5.67989 6.76795 4.76945 8.05814 0 9.65051C4.77098 11.2429 5.67989 12.5345 6.80148 19.301Z"
          fill="url(#setl-star-gradient)"
        />
      </g>
    </svg>
  )
}
