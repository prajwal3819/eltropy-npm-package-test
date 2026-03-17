import { type SVGProps, type Ref, forwardRef } from 'react';

const SvgUser = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M10.2555 4.99535C10.2555 6.28144 9.24567 7.32401 7.99993 7.32401C6.7542 7.32401 5.74433 6.28144 5.74433 4.99535C5.74433 3.70927 6.7542 2.66669 7.99993 2.66669C9.24567 2.66669 10.2555 3.70927 10.2555 4.99535Z"
      fill="currentColor"
    />
    <path
      d="M10.5925 8.49499C11.738 8.49499 12.6666 9.45367 12.6666 10.6362V11.9202C12.6666 12.3857 12.3533 12.7889 11.9131 12.8899C9.33574 13.4812 6.6641 13.4812 4.08672 12.8899C3.64653 12.7889 3.33325 12.3857 3.33325 11.9202V10.6362C3.33326 9.45367 4.26185 8.49499 5.40733 8.49499H10.5925Z"
      fill="currentColor"
    />
  </svg>
);

const ForwardRef = forwardRef(SvgUser);
export default ForwardRef;
