import { type SVGProps, type Ref, forwardRef } from 'react';

const SvgSettings = (
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
    <path
      d="M15.002 4C16.096 4 17.1036 4.59604 17.6309 5.55469L20.3809 10.5547C20.8758 11.4548 20.8758 12.5452 20.3809 13.4453L17.6309 18.4453C17.1036 19.404 16.096 20 15.002 20H9.75C8.65593 20 7.64835 19.404 7.12109 18.4453L4.37109 13.4453C3.87629 12.5453 3.87629 11.4547 4.37109 10.5547L7.12109 5.55469C7.64835 4.59604 8.65593 4 9.75 4H15.002ZM12.376 8.7998C10.6088 8.79996 9.17676 10.2328 9.17676 12C9.17676 13.7672 10.6088 15.2 12.376 15.2002C14.1433 15.2002 15.5762 13.7673 15.5762 12C15.5762 10.2327 14.1433 8.7998 12.376 8.7998Z"
      fill="currentColor"
    />
  </svg>
);

const ForwardRef = forwardRef(SvgSettings);
export default ForwardRef;
