import { type SVGProps, type Ref, forwardRef } from 'react';

const SvgErrorCircle = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>,
) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 2.66699C10.9455 2.66699 13.333 5.05448 13.333 8C13.333 10.9455 10.9455 13.333 8 13.333C5.05448 13.333 2.66699 10.9455 2.66699 8C2.66699 5.05448 5.05448 2.66699 8 2.66699ZM8 10.1338C7.70546 10.1338 7.4668 10.3725 7.4668 10.667C7.46697 10.9614 7.70557 11.2002 8 11.2002C8.29444 11.2002 8.53303 10.9614 8.5332 10.667C8.5332 10.3724 8.29455 10.1338 8 10.1338ZM8 5.36621C7.72401 5.36621 7.50025 5.59028 7.5 5.86621V9.06641C7.50011 9.34246 7.72392 9.56641 8 9.56641C8.27608 9.56641 8.49989 9.34246 8.5 9.06641V5.86621C8.49975 5.59028 8.27599 5.36621 8 5.36621Z"
      fill="currentColor"
    />
  </svg>
);

const ForwardRef = forwardRef(SvgErrorCircle);
export default ForwardRef;
