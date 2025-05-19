import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import OrbitingCircles from './OrbitingCircles';

const LoadingSpinner = () => (
  <div className="flex flex-col items-center">
    <div className="w-6 h-6 border-2 border-coral border-t-transparent rounded-full animate-spin"></div>
    <p className="text-[10px] text-coral mt-1">Processing files...</p>
  </div>
);

const WendiCircleWithOrbits = ({
  size = 'lg',
  onClick,
  isProcessing = false,
  fileCount = 0,
  isDragging = false,
  latestFilePreview = null,
  fileIndex = 0,
  totalFiles = 1,
  onMorphComplete = () => {},
}) => {
  const [wasProcessing, setWasProcessing] = useState(false);
  const [newFileAdded, setNewFileAdded] = useState(false);

  useEffect(() => {
    if (wasProcessing && !isProcessing && latestFilePreview) {
      setNewFileAdded(true);
      const timer = setTimeout(() => {
        setNewFileAdded(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
    setWasProcessing(isProcessing);
  }, [isProcessing, wasProcessing, latestFilePreview]);

  const sizes = {
    sm: {
      container: 'w-32 h-32',
      logo: 'text-3xl',
      subtext: 'text-[10px] mt-1',
    },
    md: {
      container: 'w-48 h-48',
      logo: 'text-4xl',
      subtext: 'text-xs mt-1',
    },
    lg: {
      container: 'w-64 h-64',
      logo: 'text-6xl',
      subtext: 'text-xs mt-2',
    },
  };

  const selectedSize = sizes[size] || sizes.md;
  const getContainerSizeInPixels = () => {
    switch (size) {
      case 'sm':
        return 128; // w-32 h-32 = 128px
      case 'md':
        return 192; // w-48 h-48 = 192px
      case 'lg':
        return 256; // w-64 h-64 = 256px
      default:
        return 256;
    }
  };

  return (
    <div className={`relative ${selectedSize.container}`}>
      <OrbitingCircles
        isProcessing={isProcessing}
        wasProcessing={wasProcessing}
        newFileAdded={newFileAdded}
        filePreview={latestFilePreview}
        fileIndex={fileIndex}
        totalFiles={totalFiles}
        onMorphComplete={onMorphComplete}
        containerSize={getContainerSizeInPixels()}
      />

      {isProcessing && (
        <motion.div
          className="absolute rounded-full"
          style={{
            zIndex: 1,
            width: '70%',
            height: '70%',
            top: '15%',
            left: '15%',
            border: '2px solid rgba(249, 115, 22, 0.2)',
            borderTopColor: 'rgba(249, 115, 22, 0.6)',
            borderRightColor: 'rgba(249, 115, 22, 0.4)',
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}

      <motion.div
        className={`absolute rounded-full bg-white flex flex-col items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${
          isProcessing ? 'bg-opacity-95' : 'bg-opacity-100'
        }`}
        onClick={onClick}
        style={{
          zIndex: 2,
          width: '70%',
          height: '70%',
          top: '15%',
          left: '15%',
        }}
        whileHover={{
          scale: 1.02,
          transition: { type: 'spring', stiffness: 400, damping: 17 },
        }}
      >
        <span className={`font-bold text-dark font-dmSerif  ${selectedSize.logo}`}>W</span>

        <span className={`text-gray-400 flex items-center ${selectedSize.subtext}`}>
          <span className="mr-1">⬆️</span>
          upload files
        </span>

        {fileCount > 0 && (
          <span className="text-xs text-coral mt-1">
            {fileCount} file{fileCount !== 1 ? 's' : ''} selected
          </span>
        )}

        {isProcessing && (
          <div className="mt-2">
            <LoadingSpinner />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default WendiCircleWithOrbits;
