export function toJson( cropSizes, json) {
  return JSON.stringify({
    id: json.length,
    object_id: json.length,
    objectClass: 'car',
    origin: {
      x: cropSizes.cropX,
      y: cropSizes.cropY,
    },
    size: {
      width: cropSizes.width,
      height: cropSizes.height,
    },
  });
}
