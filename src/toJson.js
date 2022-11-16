export function toJson(image, crop, json) {
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  const width = Math.floor(crop.width * scaleX);
  const height =  Math.floor(crop.height * scaleY);
  
  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  return JSON.stringify({
    id: json.length,
    object_id: json.length,
    objectClass: "car",
    origin: {
      x: cropX,
      y: cropY,
    },
    size: {
      width: width,
      height: height,
    },
  });
}
