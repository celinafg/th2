import React, { useEffect, useState, useRef } from 'react';
import useFileUpload from './useFileUpload';
import FilePreview from './FilePreview';
import WendiCircleWithOrbits from './WendiCircleWithOrbits';
import Button from './Button';
import { AnimatePresence } from 'motion/react';

/**
 * Main File Uploader component with orbiting background circles
 * @param {Object} props - Component props
 * @param {Function} props.onFilesChange - Callback when files change
 * @param {number} props.loadingDuration - Duration for loading animation in ms
 */
const WendiFileUploaderWithOrbits = ({ onFilesChange, loadingDuration = 1500 }) => {
  const {
    files,
    previews,
    isProcessing,
    isDragging,
    fileInputRef,
    handleFileChange,
    triggerFileInput,
    clearFiles,
    removeFile,
    dragHandlers,
  } = useFileUpload({ loadingDuration });

  const [latestFilePreview, setLatestFilePreview] = useState(null);
  const [animatingPreviewId, setAnimatingPreviewId] = useState(null);

  const [animatedFileIds, setAnimatedFileIds] = useState(new Set());
  const animationTimeoutRef = useRef(null);

  const [morphingInProgress, setMorphingInProgress] = useState(false);

  const validPreviews = previews.filter((preview) => {
    if (!preview || !preview.name) return false;

    const count = previews.filter((p) => p.id === preview.id).length;
    return count === 1;
  });

  useEffect(() => {
    if (validPreviews.length > 0 && !isProcessing) {
      const newestPreview = validPreviews[validPreviews.length - 1];
      if (newestPreview && !animatedFileIds.has(newestPreview.id) && !morphingInProgress) {
        setLatestFilePreview(newestPreview);
        setMorphingInProgress(true);
      }
    }
  }, [validPreviews, animatedFileIds, isProcessing, morphingInProgress]);
  const handleMorphComplete = (preview) => {
    if (preview && preview.name) {
      setAnimatingPreviewId(preview.id);

      setAnimatedFileIds((prev) => {
        const newSet = new Set(prev);
        newSet.add(preview.id);
        return newSet;
      });

      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }

      animationTimeoutRef.current = setTimeout(() => {
        setAnimatingPreviewId(null);
        setLatestFilePreview(null);
        setMorphingInProgress(false);
      }, 800);
    } else {
      // If there's no valid preview, just reset the state immediately
      setMorphingInProgress(false);
      setLatestFilePreview(null);
    }
  };

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (onFilesChange && typeof onFilesChange === 'function') {
      onFilesChange(files);
    }
  }, [files, onFilesChange]);

  const getFileIndex = (preview) => {
    if (!preview || !preview.name) return 0;
    return validPreviews.findIndex((p) => p.id === preview.id);
  };

  return (
    <div
      className="min-h-screen bg-dark flex flex-col items-center justify-center p-4 font-montserrat"
      onDragEnter={dragHandlers.handleDragEnter}
      onDragOver={dragHandlers.handleDragOver}
      onDragLeave={dragHandlers.handleDragLeave}
      onDrop={dragHandlers.handleDrop}
    >
      <div
        className={`relative flex flex-col items-center transition-transform duration-300 ${isDragging ? 'scale-105' : ''}`}
      >
        <div className="relative mb-8 overflow-visible">
          <WendiCircleWithOrbits
            size="lg"
            onClick={triggerFileInput}
            isProcessing={isProcessing}
            fileCount={files.length}
            isDragging={isDragging}
            latestFilePreview={
              latestFilePreview && latestFilePreview.name ? latestFilePreview : null
            }
            fileIndex={getFileIndex(latestFilePreview)}
            totalFiles={validPreviews.length}
            onMorphComplete={handleMorphComplete}
          />

          <AnimatePresence>
            {validPreviews.map((preview, index) => (
              <FilePreview
                key={preview.id}
                preview={preview}
                index={index}
                total={validPreviews.length}
                onRemove={removeFile}
                containerSize={256}
                isAnimated={preview.id == animatingPreviewId}
              />
            ))}
          </AnimatePresence>
        </div>

        <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />

        {files.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFiles}
            className="mt-4 text-gray-400 hover:text-coral"
          >
            Clear all files
          </Button>
        )}
      </div>
    </div>
  );
};

export default WendiFileUploaderWithOrbits;
