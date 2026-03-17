import { useMemo, useSyncExternalStore } from 'react';

type Device = 'mobile' | 'tablet' | 'desktop';

interface UseDeviceOptions {
  mobileMax?: number;
  tabletMax?: number;
}

const DEFAULTS = {
  mobileMax: 480,
  tabletMax: 768,
};

export const useDevice = (options?: UseDeviceOptions) => {
  const { mobileMax, tabletMax } = {
    ...DEFAULTS,
    ...options,
  };

  const queries = useMemo(() => {
    return {
      mobile: `(max-width: ${mobileMax}px)`,
      tablet: `(min-width: ${mobileMax + 1}px) and (max-width: ${tabletMax}px)`,
    };
  }, [mobileMax, tabletMax]);

  const getSnapshot = () => {
    if (typeof window === 'undefined') return 'desktop';

    const width = window.innerWidth;

    if (width <= mobileMax) return 'mobile';
    if (width <= tabletMax) return 'tablet';
    return 'desktop';
  };

  const subscribe = (callback: () => void) => {
    if (typeof window === 'undefined') return () => {};

    const mobileQuery = window.matchMedia(queries.mobile);
    const tabletQuery = window.matchMedia(queries.tablet);

    mobileQuery.addEventListener('change', callback);
    tabletQuery.addEventListener('change', callback);

    return () => {
      mobileQuery.removeEventListener('change', callback);
      tabletQuery.removeEventListener('change', callback);
    };
  };

  const device = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => 'desktop',
  ) as Device;

  return {
    device,
    isMobile: device === 'mobile',
    isTablet: device === 'tablet',
    isDesktop: device === 'desktop',
  };
};
