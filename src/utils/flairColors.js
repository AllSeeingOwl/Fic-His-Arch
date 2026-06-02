export const getFlairColors = (flair) => {
  const colorMap = {
    'On Earth': {
      text: 'text-[#5a7b6b]', // Muted earth green
      border: 'border-[#5a7b6b]',
      bg: 'bg-[#5a7b6b]/10',
      hoverBg: 'hover:bg-[#5a7b6b]/10',
      activeBg: 'bg-[#5a7b6b]/20',
      dot: 'bg-[#5a7b6b]',
    },
    'Not On Earth': {
      text: 'text-[#6e6a82]', // Muted void purple
      border: 'border-[#6e6a82]',
      bg: 'bg-[#6e6a82]/10',
      hoverBg: 'hover:bg-[#6e6a82]/10',
      activeBg: 'bg-[#6e6a82]/20',
      dot: 'bg-[#6e6a82]',
    },
    'Alternate Timeline': {
      text: 'text-[#a36b5c]', // Muted rust orange
      border: 'border-[#a36b5c]',
      bg: 'bg-[#a36b5c]/10',
      hoverBg: 'hover:bg-[#a36b5c]/10',
      activeBg: 'bg-[#a36b5c]/20',
      dot: 'bg-[#a36b5c]',
    },
    'Time Travel': {
      text: 'text-[#5a8b94]', // Muted temporal blue
      border: 'border-[#5a8b94]',
      bg: 'bg-[#5a8b94]/10',
      hoverBg: 'hover:bg-[#5a8b94]/10',
      activeBg: 'bg-[#5a8b94]/20',
      dot: 'bg-[#5a8b94]',
    },
    Satire: {
      text: 'text-[#948b5a]', // Muted brass yellow
      border: 'border-[#948b5a]',
      bg: 'bg-[#948b5a]/10',
      hoverBg: 'hover:bg-[#948b5a]/10',
      activeBg: 'bg-[#948b5a]/20',
      dot: 'bg-[#948b5a]',
    },
    'Canon Reference': {
      text: 'text-[#8b5a7a]', // Muted crimson
      border: 'border-[#8b5a7a]',
      bg: 'bg-[#8b5a7a]/10',
      hoverBg: 'hover:bg-[#8b5a7a]/10',
      activeBg: 'bg-[#8b5a7a]/20',
      dot: 'bg-[#8b5a7a]',
    },
  };

  return (
    colorMap[flair] || {
      text: 'text-archive-accent',
      border: 'border-archive-border',
      bg: 'bg-archive-bg',
      hoverBg: 'hover:bg-archive-surface',
      activeBg: 'bg-archive-surface',
      dot: 'bg-archive-accent',
    }
  );
};
