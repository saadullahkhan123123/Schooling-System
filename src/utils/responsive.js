// Responsive utility functions and constants

export const breakpoints = {
  xs: 0,      // 320px+
  sm: 600,    // 600px+
  md: 900,    // 900px+
  lg: 1200,   // 1200px+
  xl: 1536    // 1536px+
};

// Responsive font sizes
export const fontSize = {
  h1: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },      // 24px, 32px, 40px
  h2: { xs: '1.25rem', sm: '1.75rem', md: '2rem' },    // 20px, 28px, 32px
  h3: { xs: '1.125rem', sm: '1.5rem', md: '1.75rem' }, // 18px, 24px, 28px
  h4: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },     // 16px, 20px, 24px
  h5: { xs: '0.875rem', sm: '1rem', md: '1.25rem' },   // 14px, 16px, 20px
  h6: { xs: '0.75rem', sm: '0.875rem', md: '1rem' },   // 12px, 14px, 16px
  body: { xs: '0.875rem', sm: '1rem', md: '1rem' },    // 14px, 16px, 16px
  caption: { xs: '0.75rem', sm: '0.875rem', md: '0.875rem' }, // 12px, 14px, 14px
};

// Responsive spacing
export const spacing = {
  xs: { xs: 1, sm: 1.5, md: 2 },      // 8px, 12px, 16px
  sm: { xs: 1.5, sm: 2, md: 3 },      // 12px, 16px, 24px
  md: { xs: 2, sm: 3, md: 4 },        // 16px, 24px, 32px
  lg: { xs: 3, sm: 4, md: 6 },        // 24px, 32px, 48px
  xl: { xs: 4, sm: 6, md: 8 },        // 32px, 48px, 64px
};

// Animation variants (perfect speed)
export const motionVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
      },
    },
  },
  item: {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  },
  slideUp: {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  },
};

// Responsive card padding
export const cardPadding = {
  xs: { xs: 1.5, sm: 2, md: 2.5 },  // 12px, 16px, 20px
  sm: { xs: 2, sm: 2.5, md: 3 },    // 16px, 20px, 24px
  md: { xs: 2.5, sm: 3, md: 4 },    // 20px, 24px, 32px
};

