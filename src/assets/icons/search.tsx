import { type SVGProps, type Ref, forwardRef } from 'react';

const SvgSearch = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" />
    <path
      d="M20 20L16 16"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ForwardRef = forwardRef(SvgSearch);
export default ForwardRef;
