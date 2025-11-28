/**
 * Utility function to add a diagonal watermark to images and video frames
 */

const WATERMARK_TEXT = "www.doxing.life";
const WATERMARK_COLOR = "rgba(255, 255, 255, 0.3)";
const WATERMARK_FONT_SIZE = 48;
const WATERMARK_FONT = "bold 48px Arial";

/**
 * Add watermark to an image
 */
export async function addWatermarkToImage(
  imageUrl: string,
  imageName: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Failed to get canvas context");
        }

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Apply watermark
        applyWatermarkToCanvas(ctx, canvas.width, canvas.height);

        // Download
        canvas.toBlob((blob) => {
          if (blob) {
            downloadBlob(blob, imageName);
            resolve();
          } else {
            reject(new Error("Failed to convert canvas to blob"));
          }
        }, "image/png");
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };

    img.src = imageUrl;
  });
}

/**
 * Add watermark to a video by capturing the first frame
 */
export async function addWatermarkToVideo(
  videoUrl: string,
  videoName: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous";
    video.src = videoUrl;
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      try {
        // Seek to the middle of the video to get a representative frame
        video.currentTime = Math.min(video.duration / 2, 5);
      } catch (error) {
        reject(error);
      }
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth || 800;
        canvas.height = video.videoHeight || 600;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          throw new Error("Failed to get canvas context");
        }

        // Draw video frame
        ctx.drawImage(video, 0, 0);

        // Apply watermark
        applyWatermarkToCanvas(ctx, canvas.width, canvas.height);

        // Download
        canvas.toBlob((blob) => {
          if (blob) {
            // Change extension to .png for the thumbnail
            const fileName = videoName.replace(/\.[^/.]+$/, ".png");
            downloadBlob(blob, fileName);
            resolve();
          } else {
            reject(new Error("Failed to convert canvas to blob"));
          }
        }, "image/png");
      } catch (error) {
        reject(error);
      }
    };

    video.onerror = () => {
      reject(new Error("Failed to load video"));
    };

    // Add to DOM temporarily
    video.style.display = "none";
    document.body.appendChild(video);

    // Cleanup after a delay
    setTimeout(() => {
      document.body.removeChild(video);
    }, 2000);
  });
}

/**
 * Apply watermark text diagonally across the canvas
 */
function applyWatermarkToCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
): void {
  const diagonal = Math.sqrt(width * width + height * height);
  const angle = Math.atan2(height, width);

  // Save context state
  ctx.save();

  // Set up watermark style
  ctx.fillStyle = WATERMARK_COLOR;
  ctx.font = WATERMARK_FONT;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.globalAlpha = 0.3;

  // Move to center and rotate
  ctx.translate(width / 2, height / 2);
  ctx.rotate(angle);

  // Draw watermark multiple times across the diagonal
  const textWidth = ctx.measureText(WATERMARK_TEXT).width;
  const spacing = textWidth + 100;
  const startOffset = -(diagonal / 2);

  for (let i = startOffset; i < diagonal / 2; i += spacing) {
    ctx.fillText(WATERMARK_TEXT, i, 0);
  }

  // Restore context state
  ctx.restore();
}

/**
 * Download a blob as a file
 */
function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
