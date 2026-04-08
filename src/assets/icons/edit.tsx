import { forwardRef, type Ref, type SVGProps } from 'react';

const SvgEdit = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
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
      d="M16.474 5.40835L18.592 7.52535L16.474 5.40835ZM17.836 3.54335L12.109 9.27035C11.8101 9.56905 11.6076 9.9503 11.528 10.3654L11 13.0004L13.635 12.4714C14.05 12.3924 14.431 12.1894 14.73 11.8904L20.457 6.16335C20.6291 5.99127 20.7656 5.78696 20.8588 5.56213C20.952 5.33729 21 5.09641 21 4.85335C21 4.61029 20.952 4.36941 20.8588 4.14457C20.7656 3.91974 20.6291 3.71543 20.457 3.54335C20.2849 3.37127 20.0806 3.23477 19.8558 3.14157C19.6309 3.04837 19.3901 3.00035 19.147 3.00035C18.904 3.00035 18.6631 3.04837 18.4383 3.14157C18.2134 3.23477 18.0091 3.37127 17.837 3.54335H17.836Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 15V18C19 18.5304 18.7893 19.0391 18.4142 19.4142C18.0391 19.7893 17.5304 20 17 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V7C4 6.46957 4.21071 5.96086 4.58579 5.58579C4.96086 5.21071 5.46957 5 6 5H9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ForwardRef = forwardRef(SvgEdit);
export default ForwardRef;
