import { forwardRef, type Ref, type SVGProps } from 'react';

const SvgCheckmarkFilled = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    overflow="visible"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <circle cx="8" cy="8" r="8" fill="currentColor" />
    <path d="M6.5 10.5L4 8L3 9L6.5 12.5L13 6L12 5L6.5 10.5Z" fill="white" />
  </svg>
);

const ForwardRef = forwardRef(SvgCheckmarkFilled);
export default ForwardRef;
