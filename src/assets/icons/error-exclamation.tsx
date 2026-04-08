import { forwardRef, type Ref, type SVGProps } from 'react';

const SvgErrorExclamation = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
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
      d="M8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8C0 3.58172 3.58172 0 8 0ZM8 11.2002C7.55819 11.2002 7.2002 11.5582 7.2002 12C7.2002 12.4418 7.55819 12.7998 8 12.7998C8.44183 12.7998 8.7998 12.4418 8.7998 12C8.7998 11.5582 8.44183 11.2002 8 11.2002ZM8 4.2998C7.72392 4.2998 7.50011 4.52375 7.5 4.7998V9.59961C7.5 9.87575 7.72386 10.0996 8 10.0996C8.27614 10.0996 8.5 9.87575 8.5 9.59961V4.7998C8.49989 4.52375 8.27608 4.2998 8 4.2998Z"
      fill="currentColor"
    />
  </svg>
);

const ForwardRef = forwardRef(SvgErrorExclamation);
export default ForwardRef;
