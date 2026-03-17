import { type SVGProps, type Ref, forwardRef } from 'react';

const CheckIcon = (
  {
    width = '24',
    height = '24',
    fill = '#11304F',
    ...props
  }: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    fill="none"
    ref={ref}
    {...props}
  >
    <path
      d="M19.5 9L10.3435 18.2068C10.206 18.3443 10.0196 18.4214 9.8252 18.4214C9.63079 18.4214 9.44435 18.3443 9.30689 18.2068L4.5181 13.418C4.23184 13.1317 4.21375 12.2863 4.5 12C4.78625 11.7137 5.71375 11.7137 6 12L9.8252 15.5L18 7.5C18.2863 7.21394 19.3039 7.30395 19.5 7.5C19.7862 7.78619 19.7861 8.71373 19.5 9Z"
      fill={fill}
    />
  </svg>
);

const ForwardRef = forwardRef(CheckIcon);
export default ForwardRef;
