import { forwardRef, type Ref, type SVGProps } from 'react';

const SvgFolderFile = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
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
      d="M15.25 5.75C15.25 6.30228 15.6977 6.75 16.25 6.75H19.9639C19.9868 6.8546 20 6.96174 20 7.07031V19.75C20 20.9926 18.9926 22 17.75 22H6.25C5.00736 22 4 20.9926 4 19.75V4.25C4 3.00736 5.00736 2 6.25 2H15.25V5.75ZM9 16.5176C8.72386 16.5176 8.5 16.7414 8.5 17.0176C8.5 17.2937 8.72386 17.5176 9 17.5176H15C15.2761 17.5176 15.5 17.2937 15.5 17.0176C15.5 16.7414 15.2761 16.5176 15 16.5176H9ZM9 12.4922C8.72386 12.4922 8.5 12.716 8.5 12.9922C8.5 13.2683 8.72386 13.4922 9 13.4922H12C12.2761 13.4922 12.5 13.2683 12.5 12.9922C12.5 12.716 12.2761 12.4922 12 12.4922H9Z"
      fill="currentColor"
    />
  </svg>
);

const ForwardRef = forwardRef(SvgFolderFile);
export default ForwardRef;
