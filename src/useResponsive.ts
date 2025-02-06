import { useState, useEffect, useMemo } from 'react';

// Breakpoint definitions
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

type Breakpoint = keyof typeof breakpoints;

// Media query states interface
interface MediaQueryState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeScreen: boolean;
  activeBreakpoint: Breakpoint;
  width: number;
  height: number;
}

// Orientation type
type Orientation = 'portrait' | 'landscape';

export const useResponsive = () => {
  // Initialize state with default values
  const [mediaQuery, setMediaQuery] = useState<MediaQueryState>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeScreen: false,
    activeBreakpoint: 'xs',
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  const [orientation, setOrientation] = useState<Orientation>(
    typeof window !== 'undefined' && window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  );

  // Create media query strings
  const queries = useMemo(
    () => ({
      mobile: `(max-width: ${breakpoints.sm - 1}px)`,
      tablet: `(min-width: ${breakpoints.sm}px) and (max-width: ${breakpoints.lg - 1}px)`,
      desktop: `(min-width: ${breakpoints.lg}px) and (max-width: ${breakpoints.xl - 1}px)`,
      largeScreen: `(min-width: ${breakpoints.xl}px)`,
    }),
    []
  );

  // Determine active breakpoint
  const getActiveBreakpoint = (width: number): Breakpoint => {
    if (width >= breakpoints['2xl']) return '2xl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Update dimensions and media query state
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setMediaQuery({
        isMobile: width < breakpoints.sm,
        isTablet: width >= breakpoints.sm && width < breakpoints.lg,
        isDesktop: width >= breakpoints.lg && width < breakpoints.xl,
        isLargeScreen: width >= breakpoints.xl,
        activeBreakpoint: getActiveBreakpoint(width),
        width,
        height,
      });

      setOrientation(height > width ? 'portrait' : 'landscape');
    };

    // Initial update
    updateDimensions();

    // Add event listener
    window.addEventListener('resize', updateDimensions);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  // Utility functions
  const isBreakpoint = (breakpoint: Breakpoint): boolean => {
    return mediaQuery.width >= breakpoints[breakpoint];
  };

  const isBetweenBreakpoints = (min: Breakpoint, max: Breakpoint): boolean => {
    return mediaQuery.width >= breakpoints[min] && mediaQuery.width < breakpoints[max];
  };

  const getBreakpointValue = (
    values: Partial<Record<Breakpoint, any>>,
    defaultValue: any
  ): any => {
    const breakpointsOrder: Breakpoint[] = ['2xl', 'xl', 'lg', 'md', 'sm', 'xs'];
    const activeBreakpointIndex = breakpointsOrder.indexOf(mediaQuery.activeBreakpoint);

    for (let i = activeBreakpointIndex; i < breakpointsOrder.length; i++) {
      const breakpoint = breakpointsOrder[i];
      if (values[breakpoint] !== undefined) {
        return values[breakpoint];
      }
    }

    return defaultValue;
  };

  return {
    ...mediaQuery,
    orientation,
    isBreakpoint,
    isBetweenBreakpoints,
    getBreakpointValue,
    breakpoints,
  };
};

// Utility types
export type ResponsiveValue<T> = Partial<Record<Breakpoint, T>> & { default: T };

// Helper function to create responsive values
export const createResponsiveValue = <T>(
  defaultValue: T,
  breakpointValues: Partial<Record<Breakpoint, T>> = {}
): ResponsiveValue<T> => {
  return {
    default: defaultValue,
    ...breakpointValues,
  };
};

// Example usage:
// const fontSize = createResponsiveValue('16px', {
//   sm: '14px',
//   md: '16px',
//   lg: '18px',
// });