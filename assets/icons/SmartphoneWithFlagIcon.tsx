type IconProps = { className?: string; strokeWidth?: number }

// Heroicons v2 outline — device-phone-mobile + flag (scaled into screen area)
export function SmartphoneWithFlagIcon({ className, strokeWidth = 1.5 }: IconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      {/* Phone body — Heroicons device-phone-mobile */}
      <path
        strokeWidth={strokeWidth}
        d="M10.5 1.5H8.25C7.00736 1.5 6 2.50736 6 3.75V20.25C6 21.4926 7.00736 22.5 8.25 22.5H15.75C16.9926 22.5 18 21.4926 18 20.25V3.75C18 2.50736 16.9926 1.5 15.75 1.5H13.5M10.5 1.5V3H13.5V1.5M10.5 1.5H13.5M10.5 20.25H13.5"
      />
      {/*
        Flag — Heroicons flag, scaled to 40% and translated so it sits
        centred inside the phone screen (screen area approx x:6–18, y:3–20).
        strokeWidth is divided by scale factor (0.4) to keep visual weight consistent.
      */}
      <g transform="translate(7.2, 6.2) scale(0.4)">
        <path
          strokeWidth={strokeWidth / 0.4}
          d="M3 3V4.5M3 21V15M3 15L5.77009 14.3075C7.85435 13.7864 10.0562 14.0281 11.9778 14.9889L12.0856 15.0428C13.9687 15.9844 16.1224 16.2359 18.1718 15.7537L21.2861 15.0209C21.097 13.2899 21 11.5313 21 9.75C21 7.98343 21.0954 6.23914 21.2814 4.52202L18.1718 5.25369C16.1224 5.73591 13.9687 5.48435 12.0856 4.54278L11.9778 4.48892C10.0562 3.52812 7.85435 3.28641 5.77009 3.80748L3 4.5M3 15V4.5"
        />
      </g>
    </svg>
  )
}
