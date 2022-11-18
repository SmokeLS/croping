export function toJson(image, cropSizes, json) {
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const width = Math.floor(cropSizes.w * scaleX);
  const height = Math.floor(cropSizes.h * scaleY);

  const cropX = Math.floor(cropSizes.x * scaleX);
  const cropY = Math.floor(cropSizes.y * scaleY);

  return JSON.stringify({
    id: json.length,
    object_id: json.length,
    objectClass: 'car',
    origin: {
      x: Math.round(cropX),
      y: Math.round(cropY),
    },
    size: {
      width: Math.round(width),
      height: Math.round(height),
    },
  });
}
