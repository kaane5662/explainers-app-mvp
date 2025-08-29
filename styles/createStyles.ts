export const glassCardStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  borderWidth: 1.5,
  borderColor: 'rgba(255, 255, 255, 0.9)',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.12,
  shadowRadius: 16,
  elevation: 8, // Android shadow
};

export const glassInputStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  borderWidth: 1.5,
  borderColor: 'rgba(255, 255, 255, 0.8)',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.06,
  shadowRadius: 8,
};

export const glassButtonStyle = (isSelected: boolean, borderRadius: number = 12) => ({
  backgroundColor: isSelected ? 'rgba(99, 135, 255, 0.2)' : 'rgba(255, 255, 255, 0.6)',
  borderWidth: 2,
  borderColor: isSelected ? 'rgba(99, 135, 255, 0.5)' : 'rgba(255, 255, 255, 0.8)',
  shadowColor: isSelected ? '#6387FF' : '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: isSelected ? 0.15 : 0.08,
  shadowRadius: isSelected ? 6 : 4,
  elevation: isSelected ? 4 : 2,
  borderRadius,
  overflow: 'hidden',
});

export const numberBadgeStyle = {
  width: 32,
  height: 32,
  borderRadius: 16,
  backgroundColor: 'rgba(99, 135, 255, 0.15)',
  borderWidth: 1.5,
  borderColor: 'rgba(99, 135, 255, 0.3)',
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  marginRight: 12,
  shadowColor: '#6387FF',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
};
