import { useState, useRef, useEffect } from 'react';

/**
 * Custom hook for file uploads with preview generation
 * @param {Object} options - Hook options
 * @param {number} options.loadingDuration - Artificial loading time in ms (0 to disable)
 */
const useFileUpload = ({ loadingDuration = 1500 } = {}) => {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const [processingCompleted, setProcessingCompleted] = useState([]);

  useEffect(() => {
    if (files.length === 0) {
      setPreviews([]);
      setProcessingCompleted([]);
      return;
    }

    setIsProcessing(true);
    const newPreviews = [];
    let processed = 0;
    let timeoutId = null;

    files.forEach((file, index) => {
      const fileId = `file-${Date.now()}-${index}-${file.name.replace(/\s+/g, '-')}`;

      if (file.type.match('image.*')) {
        const reader = new FileReader();

        reader.onload = (e) => {
          newPreviews.push({
            id: fileId,
            type: 'image',
            name: file.name,
            size: file.size,
            url: e.target.result,
            file,
          });

          processed++;
          if (processed === files.length) {
            if (loadingDuration > 0) {
              timeoutId = setTimeout(() => {
                setPreviews(newPreviews);
                setIsProcessing(false);
              }, loadingDuration);
            } else {
              setPreviews(newPreviews);
              setIsProcessing(false);

              setProcessingCompleted((prev) => [
                ...prev,
                ...newPreviews.map((p) => ({
                  id: p.id,
                  isAnimated: false,
                  preview: p,
                })),
              ]);
            }
          }
        };

        reader.readAsDataURL(file);
      } else {
        const extension = file.name.split('.').pop()?.toLowerCase() || '';

        newPreviews.push({
          id: fileId,
          type: 'file',
          name: file.name,
          size: file.size,
          extension,
          file,
        });

        processed++;
        if (processed === files.length) {
          if (loadingDuration > 0) {
            timeoutId = setTimeout(() => {
              setPreviews(newPreviews);
              setIsProcessing(false);
            }, loadingDuration);
          } else {
            // No artificial delay
            setPreviews(newPreviews);
            setIsProcessing(false);
          }
        }
      }
    });

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [files, loadingDuration]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const clearFiles = () => {
    setFiles([]);
  };

  const removeFile = (idToRemove) => {
    const previewToRemove = previews.find((p) => p.id === idToRemove);
    if (previewToRemove) {
      setFiles(files.filter((file) => file !== previewToRemove.file));
    }
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      handleFileChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const markFileAnimated = (fileId) => {
    setProcessingCompleted((prev) =>
      prev.map((file) => (file.id === fileId ? { ...file, isAnimated: true } : file))
    );
  };

  return {
    files,
    previews,
    isProcessing,
    isDragging,
    fileInputRef,
    processingCompleted,

    // Methods
    handleFileChange,
    triggerFileInput,
    clearFiles,
    removeFile,
    markFileAnimated,

    // Drag and drop handlers
    dragHandlers: {
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
    },
  };
};

export default useFileUpload;
