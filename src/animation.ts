import { Variants } from 'framer-motion';

// Fade in animation variants
export const fadeIn: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  }
};

// Slide and fade animation variants
export const slideAndFade: Variants = {
  hidden: (direction: 'left' | 'right' = 'right') => ({
    opacity: 0,
    x: direction === 'right' ? 20 : -20
  }),
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300
    }
  },
  exit: (direction: 'left' | 'right' = 'right') => ({
    opacity: 0,
    x: direction === 'right' ? -20 : 20,
    transition: {
      duration: 0.2,
      ease: 'easeIn'
    }
  })
};

// Card hover animation variants
export const cardHover: Variants = {
  initial: {
    scale: 1,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
  },
  hover: {
    scale: 1.005,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
    transition: {
      duration: 0.2,
      ease: 'easeInOut'
    }
  }
};

// Stagger children animation variants
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// Tooltip animation variants
export const tooltipAnimation: Variants = {
  hidden: {
    opacity: 0,
    y: 10,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 20,
      stiffness: 300
    }
  }
};

// Mobile tab switch animation variants
export const tabSwitchAnimation: Variants = {
  initial: (direction: number) => ({
    x: direction * 20,
    opacity: 0
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300
    }
  },
  exit: (direction: number) => ({
    x: direction * -20,
    opacity: 0,
    transition: {
      duration: 0.2
    }
  })
};

// Animation utility functions
export const getAnimationProps = (variant: keyof typeof animations, custom?: any) => ({
  variants: animations[variant],
  initial: 'hidden',
  animate: 'visible',
  exit: 'exit',
  custom
});

// Animation presets object
export const animations = {
  fadeIn,
  slideAndFade,
  cardHover,
  staggerContainer,
  tooltipAnimation,
  tabSwitchAnimation
};

// Transition presets
export const transitions = {
  spring: {
    type: 'spring',
    damping: 25,
    stiffness: 300
  },
  smooth: {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3
  },
  quick: {
    type: 'tween',
    ease: 'easeOut',
    duration: 0.2
  }
};

// Animation utility types
export type AnimationVariant = keyof typeof animations;
export type TransitionPreset = keyof typeof transitions;

// Helper function to combine animation variants
export const combineVariants = (...variants: Variants[]): Variants => {
  return variants.reduce((combined, variant) => ({
    ...combined,
    ...variant
  }), {});
};

// Helper function for responsive animations
export const createResponsiveVariants = (
  desktop: Variants,
  mobile: Variants,
  breakpoint: number = 768
): Variants => {
  return {
    ...desktop,
    transition: {
      ...desktop.transition,
      when: window.innerWidth > breakpoint ? 'beforeChildren' : 'afterChildren'
    }
  };
};