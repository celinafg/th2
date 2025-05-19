import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CIRCLE_COLORS } from './constants';

const createCircleConfig = (index) => {
  const size = 130 + Math.random() * 80;

  const orbitFactor = 0.01 + Math.random() * 0.1;

  const centerOffsetX = Math.random() * 30 - 15; // -15px to +15px
  const centerOffsetY = Math.random() * 30 - 15; // -15px to +15px

  const orbitPatterns = [
    // Elliptical orbit (horizontal)
    {
      x: [
        `${centerOffsetX - size * orbitFactor}px`,
        `${centerOffsetX + size * orbitFactor}px`,
        `${centerOffsetX - size * orbitFactor}px`,
      ],
      y: [
        `${centerOffsetY - size * (orbitFactor * 0.6)}px`,
        `${centerOffsetY - size * (orbitFactor * 0.6)}px`,
        `${centerOffsetY - size * (orbitFactor * 0.6)}px`,
      ],
    },
    // Elliptical orbit (vertical)
    {
      x: [
        `${centerOffsetX + size * (orbitFactor * 0.6)}px`,
        `${centerOffsetX + size * (orbitFactor * 0.6)}px`,
        `${centerOffsetX + size * (orbitFactor * 0.6)}px`,
      ],
      y: [
        `${centerOffsetY - size * orbitFactor}px`,
        `${centerOffsetY + size * orbitFactor}px`,
        `${centerOffsetY - size * orbitFactor}px`,
      ],
    },
    // Circular/oval orbit
    {
      x: [
        `${centerOffsetX - size * orbitFactor}px`,
        `${centerOffsetX}px`,
        `${centerOffsetX + size * orbitFactor}px`,
        `${centerOffsetX}px`,
        `${centerOffsetX - size * orbitFactor}px`,
      ],
      y: [
        `${centerOffsetY}px`,
        `${centerOffsetY - size * orbitFactor}px`,
        `${centerOffsetY}px`,
        `${centerOffsetY + size * orbitFactor}px`,
        `${centerOffsetY}px`,
      ],
    },
    // Figure-8 pattern
    {
      x: [
        `${centerOffsetX - size * orbitFactor}px`,
        `${centerOffsetX}px`,
        `${centerOffsetX + size * orbitFactor}px`,
        `${centerOffsetX}px`,
        `${centerOffsetX - size * orbitFactor}px`,
      ],
      y: [
        `${centerOffsetY - size * orbitFactor}px`,
        `${centerOffsetY + size * orbitFactor}px`,
        `${centerOffsetY - size * orbitFactor}px`,
        `${centerOffsetY - size * orbitFactor}px`,
        `${centerOffsetY - size * orbitFactor}px`,
      ],
    },
  ];

  const processingPatterns = [
    {
      x: [
        `${centerOffsetX - size * (orbitFactor * 1.2)}px`,
        `${centerOffsetX}px`,
        `${centerOffsetX + size * (orbitFactor * 1.2)}px`,
        `${centerOffsetX}px`,
        `${centerOffsetX - size * (orbitFactor * 1.2)}px`,
      ],
      y: [
        `${centerOffsetY}px`,
        `${centerOffsetY - size * (orbitFactor * 1.2)}px`,
        `${centerOffsetY}px`,
        `${centerOffsetY + size * (orbitFactor * 1.2)}px`,
        `${centerOffsetY}px`,
      ],
    },
    {
      x: [
        `${centerOffsetX + size * (orbitFactor * 1.2)}px`,
        `${centerOffsetX}px`,
        `${centerOffsetX - size * (orbitFactor * 1.2)}px`,
        `${centerOffsetX}px`,
        `${centerOffsetX + size * (orbitFactor * 1.2)}px`,
      ],
      y: [
        `${centerOffsetY}px`,
        `${centerOffsetY + size * (orbitFactor * 1.2)}px`,
        `${centerOffsetY}px`,
        `${centerOffsetY - size * (orbitFactor * 1.2)}px`,
        `${centerOffsetY}px`,
      ],
    },
  ];

  const duration = 6 + Math.random() * 7;
  const processingDuration = duration * 0.7; // Slightly faster when processing

  const startOffset = Math.floor(Math.random() * 100);

  const patternIndex = Math.floor(Math.random() * orbitPatterns.length);
  const processingPatternIndex = index % processingPatterns.length;

  return {
    size,
    color: CIRCLE_COLORS[index],
    orbit: orbitPatterns[patternIndex],
    processingOrbit: processingPatterns[processingPatternIndex],
    duration,
    processingDuration,
    startOffset,
    blur: 1 + Math.floor(Math.random() * 2),
  };
};

const getPositionOnCircumference = (containerSize, fileIndex, totalFiles) => {
  // Position calculations for the circular arrangement
  const radius = containerSize * 0.8; // Slightly larger than the main circle
  const angle = (Math.PI * 2 * fileIndex) / Math.max(totalFiles, 1) - Math.PI / 2;

  // Calculate position based on index and total number of files
  const y = Math.sin(angle) * radius;
  const x = Math.cos(angle) * radius;

  return { x, y };
};

const OrbitingCircles = ({
  isProcessing = false,
  wasProcessing = false,
  onMorphComplete = () => {},
  newFileAdded = false,
  filePreview = null,
  fileIndex = 0,
  totalFiles = 1,
  containerSize = 256,
}) => {
  const [circles, setCircles] = useState(() =>
    CIRCLE_COLORS.map((_, index) => createCircleConfig(index))
  );
  const [morphingCircle, setMorphingCircle] = useState(null);
  const [isAnimatingMorph, setIsAnimatingMorph] = useState(false);

  useEffect(() => {
    if (
      wasProcessing &&
      !isProcessing &&
      newFileAdded &&
      filePreview &&
      !morphingCircle &&
      !isAnimatingMorph
    ) {
      const circleIndex = 2;

      setMorphingCircle(circleIndex);
      setIsAnimatingMorph(true);

      const timer = setTimeout(() => {
        onMorphComplete(filePreview);

        setTimeout(() => {
          setMorphingCircle(null);
          setIsAnimatingMorph(false);
        }, 200);
      }, 550);

      return () => clearTimeout(timer);
    }
  }, [
    wasProcessing,
    isProcessing,
    newFileAdded,
    filePreview,
    morphingCircle,
    isAnimatingMorph,
    onMorphComplete,
  ]);

  const finalPosition = filePreview
    ? getPositionOnCircumference(containerSize, fileIndex, totalFiles)
    : { x: 0, y: 0 };

  return (
    <div className="absolute inset-0" style={{ zIndex: 0, overflow: 'visible' }}>
      {circles.map((circle, index) => (
        <AnimatePresence key={index}>
          {morphingCircle !== index && (
            <motion.div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${circle.size}px`,
                height: `${circle.size}px`,
                borderRadius: '50%',
                backgroundColor: circle.color,
                filter: `blur(${circle.blur}px)`,
                opacity: isProcessing ? 0.75 : 0.6,
                marginTop: `-${circle.size / 2}px`,
                marginLeft: `-${circle.size / 2}px`,
                mixBlendMode: 'normal',
              }}
              initial={{
                x: circle.orbit.x[0],
                y: circle.orbit.y[0],
              }}
              animate={{
                x: isProcessing ? circle.processingOrbit.x : circle.orbit.x,
                y: isProcessing ? circle.processingOrbit.y : circle.orbit.y,
              }}
              transition={{
                x: {
                  duration: isProcessing ? circle.processingDuration : circle.duration,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatType: 'loop',
                  delay: circle.startOffset / 100,
                },
                y: {
                  duration: isProcessing ? circle.processingDuration : circle.duration,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  repeatType: 'loop',
                  delay: circle.startOffset / 100,
                },
              }}
              exit={{
                opacity: 0,
                transition: { duration: 0.2 },
              }}
            />
          )}
        </AnimatePresence>
      ))}
    </div>
  );
};

export default OrbitingCircles;
