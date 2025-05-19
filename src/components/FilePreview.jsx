import { motion } from 'motion/react';

const FilePreview = ({
  preview,
  index,
  total,
  onRemove,
  containerSize = 256,
  isAnimated = false,
}) => {
  const radius = containerSize * 0.8;
  const angle = (Math.PI * 2 * index) / Math.max(total, 1) - Math.PI / 2;
  const top = Math.sin(angle) * radius;
  const left = Math.cos(angle) * radius;

  const finalPosition = {
    x: left,
    y: top,
  };

  return (
    <motion.div
      className="absolute"
      style={{
        top: '50%',
        left: '50%',
        marginTop: '-40px',
        marginLeft: '-40px',
        zIndex: 10,
        pointerEvents: isAnimated ? 'none' : 'auto',
      }}
      animate={finalPosition}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      initial={isAnimated}
    >
      <motion.div
        className="relative rounded-xl shadow-lg overflow-hidden bg-gray-800 w-20 h-20"
        whileHover={{ scale: 1.05 }}
        animate={
          isAnimated
            ? {
                boxShadow: [
                  '0 0 15px 5px rgba(255,255,255,0.2)',
                  '0 0 5px 2px rgba(255,255,255,0.1)',
                ],
                scale: [1, 1.05, 1],
              }
            : {}
        }
        transition={{
          boxShadow: { duration: 0.5 },
          scale: { duration: 0.6 },
        }}
      >
        <img src={preview.url} alt={preview.name} />
        {!isAnimated && (
          <button
            className="absolute top-1 right-1 bg-gray-900 bg-opacity-70 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-500 transition-colors"
            onClick={() => onRemove(preview.id)}
          >
            ✕
          </button>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gray-900 bg-opacity-70 p-1 text-white text-[8px] truncate">
          {preview.name}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FilePreview;
