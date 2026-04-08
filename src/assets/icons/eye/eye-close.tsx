import { type SVGProps, type Ref, forwardRef } from 'react';

const EyeCloseIcon = (
  {
    width = '24',
    height = '24',
    fill = 'currentColor',
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
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M17.8682 6.22304C18.1657 5.92569 18.6478 5.92561 18.9453 6.22304C19.2428 6.52052 19.2427 7.00263 18.9453 7.30019L17.8271 8.41738C18.7992 9.34348 19.5527 10.498 20 11.7963C18.8547 15.122 15.7055 17.5111 12 17.5111C11.0216 17.5111 10.0823 17.3439 9.20801 17.0375L7.50391 18.7426C7.20649 19.0398 6.72428 19.0396 6.42676 18.7426C6.12922 18.445 6.12922 17.962 6.42676 17.6644L7.73535 16.3549C7.6825 16.3239 7.62926 16.2932 7.57715 16.2611L16.4736 7.36464C16.525 7.39681 16.5753 7.43101 16.626 7.46425L17.8682 6.22304ZM12 6.08242C12.8843 6.08242 13.7368 6.2197 14.5381 6.47206L6.00195 15.0082C5.11283 14.1117 4.42057 13.0182 4 11.7973C5.14536 8.47172 8.29459 6.08244 12 6.08242Z"
      fill={fill}
    />
  </svg>
);

const ForwardRef = forwardRef(EyeCloseIcon);
export default ForwardRef;
