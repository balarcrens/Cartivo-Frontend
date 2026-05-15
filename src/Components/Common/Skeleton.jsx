import React from 'react';

const Skeleton = ({ className, circle = false }) => {
  return (
    <div
      className={`bg-gray-100 animate-pulse ${circle ? 'rounded-full' : 'rounded-sm'} ${className}`}
      style={{
        backgroundImage: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite linear'
      }}
    />
  );
};

export default Skeleton;

// Add shimmer animation to global styles or as a style tag
export const SkeletonStyles = () => (
  <style>{`
    @keyframes shimmer {
      0% {
        background-position: -200% 0;
      }
      100% {
        background-position: 200% 0;
      }
    }
  `}</style>
);
