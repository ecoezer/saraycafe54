export const normalizeSizeName = (sizeName: string): string => {
  return sizeName.replace('ø', '');
};

export const getSizePrice = (sizeName: string): '24cm' | '28cm' | '40cm' => {
  const normalized = normalizeSizeName(sizeName);
  if (normalized === '24cm' || normalized === '28cm' || normalized === '40cm') {
    return normalized as '24cm' | '28cm' | '40cm';
  }
  return '24cm';
};
