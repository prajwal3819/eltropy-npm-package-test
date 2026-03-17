import { type SVGProps, type Ref, forwardRef } from 'react';

const SvgClose = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    ref={ref}
    {...props}
  >
    <path
      d="M8.40372 3.10251C8.54007 2.96616 8.76151 2.96616 8.89786 3.10251C9.03393 3.23875 9.03381 3.45935 8.89786 3.59567L6.49356 5.99997L8.89786 8.40426C9.03394 8.54053 9.03387 8.76111 8.89786 8.89743C8.76151 9.03378 8.54007 9.03378 8.40372 8.89743L5.99942 6.49313L3.5961 8.89743C3.45976 9.03378 3.23831 9.03378 3.10196 8.89743C2.96605 8.76113 2.96598 8.54051 3.10196 8.40426L5.50626 5.99997L3.10196 3.59567C2.96611 3.45937 2.96599 3.23874 3.10196 3.10251C3.23831 2.96616 3.45976 2.96616 3.5961 3.10251L5.99942 5.50583L8.40372 3.10251Z"
      fill="currentColor"
    />
  </svg>
);

const ForwardRef = forwardRef(SvgClose);
export default ForwardRef;
