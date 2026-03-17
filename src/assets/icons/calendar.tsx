import { type SVGProps, type Ref, forwardRef } from 'react';

const SvgCalendar = (
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
      d="M14 12.667C13.9998 13.4031 13.4031 13.9998 12.667 14H3.33301C2.59689 13.9998 2.00018 13.4031 2 12.667V7H14V12.667ZM11 1.33301C11.3682 1.33301 11.667 1.63181 11.667 2V3H12.667C13.4031 3.00018 13.9998 3.59689 14 4.33301V6H2V4.33301C2.00018 3.59689 2.59689 3.00018 3.33301 3H4.33301V2C4.33301 1.63181 4.63181 1.33301 5 1.33301C5.36819 1.33301 5.66699 1.63181 5.66699 2V3H10.333V2C10.333 1.63181 10.6318 1.33301 11 1.33301Z"
      fill="currentColor"
    />
  </svg>
);

const ForwardRef = forwardRef(SvgCalendar);
export default ForwardRef;
