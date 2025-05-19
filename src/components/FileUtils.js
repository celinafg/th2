export const calculateCirclePosition = (index, total, options = {}) => {
  const { containerSize = 256, itemSize = 16, inset = 2, startAngle = -Math.PI / 2 } = options;

  const containerRadius = containerSize / 2;
  const itemHalfSize = itemSize / 2;
  const radius = containerRadius - itemHalfSize - inset;

  const angle = index * ((2 * Math.PI) / total) + startAngle;

  const x = Math.round(radius * Math.cos(angle));
  const y = Math.round(radius * Math.sin(angle));

  return {
    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
    top: '50%',
    left: '50%',
    zIndex: 20,
  };
};
