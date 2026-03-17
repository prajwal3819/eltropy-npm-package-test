import { type SVGProps, type Ref, forwardRef } from 'react';

const SvgCheckmarkCircle = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>,
) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <circle cx="12" cy="12" r="8" fill="currentColor" />
    <path
      d="M10.5 14.5L8 12L8.7 11.3L10.5 13.1L15.3 8.3L16 9L10.5 14.5Z"
      fill="white"
    />
  </svg>
);

const ForwardRef = forwardRef(SvgCheckmarkCircle);
export default ForwardRef;
