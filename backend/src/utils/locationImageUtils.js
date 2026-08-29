export const normalizeLocationImages = (uploadedFiles = []) => {
  const files = Array.isArray(uploadedFiles)
    ? uploadedFiles
    : uploadedFiles
      ? [uploadedFiles]
      : [];

  const paths = files
    .filter(Boolean)
    .map((file) => file.path || file.url || file.secure_url || "")
    .filter(Boolean);

  const uniquePaths = [...new Set(paths)];
  const primaryImage = uniquePaths[0] || "";
  const galleryImages = uniquePaths.filter((path) => path !== primaryImage);

  return {
    image: primaryImage,
    images: galleryImages,
  };
};
