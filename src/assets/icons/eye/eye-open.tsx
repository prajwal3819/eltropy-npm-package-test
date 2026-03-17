import { type SVGProps, type Ref, forwardRef } from 'react';

const EyeOpenIcon = (
  {
    width = '24',
    height = '24',
    fill = 'currentColor',
    ...props
  }: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    fill="none"
    ref={ref}
    {...props}
  >
    <path
      d="M12 6C15.7053 6.00003 18.8546 8.3884 20 11.7139C18.8548 15.0396 15.7054 17.4286 12 17.4287C8.29474 17.4287 5.14543 15.0403 4 11.7148C5.14525 8.38907 8.2945 6 12 6ZM12 9.125C10.5701 9.125 9.41122 10.2839 9.41113 11.7139C9.41113 13.1439 10.57 14.3037 12 14.3037C13.4299 14.3036 14.5889 13.1438 14.5889 11.7139C14.5888 10.284 13.4299 9.12508 12 9.125Z"
      fill={fill}
    />
  </svg>
);

const ForwardRef = forwardRef(EyeOpenIcon);
export default ForwardRef;
