export function normalizeProductBody(body: Record<string, any> = {}) {
  const normalizedBody = { ...body };

  if (typeof normalizedBody.price === 'string' && normalizedBody.price !== '') {
    normalizedBody.price = Number(normalizedBody.price);
  }

  if (
    typeof normalizedBody.discountPrice === 'string' &&
    normalizedBody.discountPrice !== ''
  ) {
    normalizedBody.discountPrice = Number(normalizedBody.discountPrice);
  }

  if (typeof normalizedBody.isFeatured === 'string') {
    normalizedBody.isFeatured = normalizedBody.isFeatured === 'true';
  }

  if (typeof normalizedBody.isActive === 'string') {
    normalizedBody.isActive = normalizedBody.isActive === 'true';
  }

  // Variants
  if (typeof normalizedBody.variants === 'string') {
    try {
      normalizedBody.variants = JSON.parse(normalizedBody.variants);
    } catch {
      normalizedBody.variants = [];
    }
  }

  // Color Images
  if (typeof normalizedBody.images === 'string') {
    try {
      normalizedBody.images = JSON.parse(normalizedBody.images);
    } catch {
      normalizedBody.images = [];
    }
  }

  return normalizedBody;
}

export function groupUploadedFiles(
  files: Express.Multer.File[] = [],
): Record<string, Express.Multer.File[]> {
  return files.reduce((acc, file) => {
    if (!acc[file.fieldname]) {
      acc[file.fieldname] = [];
    }

    acc[file.fieldname].push(file);

    return acc;
  }, {} as Record<string, Express.Multer.File[]>);
}