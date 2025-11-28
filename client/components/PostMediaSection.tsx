import { useState } from "react";
import { ChevronLeft, ChevronRight, Download, Play } from "lucide-react";
import { addWatermarkToImage, addWatermarkToVideo } from "@/lib/watermark";
import { toast } from "sonner";

interface MediaFile {
  name: string;
  url: string;
  type: string;
}

interface PostMediaSectionProps {
  mediaFiles: MediaFile[];
  postTitle: string;
  thumbnailUrl?: string;
}

export default function PostMediaSection({
  mediaFiles,
  postTitle,
  thumbnailUrl,
}: PostMediaSectionProps) {
  const filteredMediaFiles = mediaFiles.filter(
    (file) => !thumbnailUrl || file.url !== thumbnailUrl,
  );

  const photos = filteredMediaFiles.filter((f) => f.type.startsWith("image/"));
  const videos = filteredMediaFiles.filter((f) => f.type.startsWith("video/"));

  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);

  if (photos.length === 0 && videos.length === 0) {
    return null;
  }

  const handleDownload = async (mediaFile: MediaFile) => {
    try {
      if (mediaFile.type.startsWith("image/")) {
        await addWatermarkToImage(mediaFile.url, mediaFile.name);
      } else if (mediaFile.type.startsWith("video/")) {
        await addWatermarkToVideo(mediaFile.url, mediaFile.name);
      } else {
        // For non-image/video files, download normally
        const link = document.createElement("a");
        link.href = mediaFile.url;
        link.download = mediaFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      toast.success("File downloaded with watermark");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file");
    }
  };

  return (
    <div className="space-y-12">
      {/* Photos Section */}
      {photos.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-white">
            <svg
              className="w-6 h-6 text-[#0088CC]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            Photos Gallery ({photos.length})
          </h3>

          {/* Responsive Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {photos.map((photo, idx) => (
              <div
                key={`${photo.name}-${idx}`}
                className="group relative rounded-lg overflow-hidden border border-[#666666] hover:border-[#0088CC] transition-all duration-300 bg-[#1a1a1a]"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-square overflow-hidden bg-black">
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    crossOrigin="anonymous"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-black/80 px-3 py-1.5 rounded text-white text-xs font-medium">
                      {idx + 1} / {photos.length}
                    </div>
                  </div>
                </div>

                {/* Photo Info and Download Button */}
                <div className="p-3 sm:p-4 space-y-3 border-t border-[#666666]">
                  <p className="text-xs sm:text-sm font-semibold text-white truncate">
                    {photo.name}
                  </p>

                  <button
                    onClick={() => handleDownload(photo)}
                    className="w-full px-3 py-2 bg-[#0088CC] hover:bg-[#0077BB] text-white text-xs sm:text-sm font-medium rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos Section */}
      {videos.length > 0 && (
        <div className="border-t border-[#666666] pt-12">
          <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-white">
            <svg
              className="w-6 h-6 text-[#0088CC]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <polygon points="23 7 16 12 23 17 23 7"></polygon>
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
            </svg>
            Videos ({videos.length})
          </h3>

          {/* Video Thumbnails Grid */}
          {videos.length > 1 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
              {videos.map((video, idx) => (
                <button
                  key={`${video.name}-${idx}`}
                  onClick={() => setSelectedVideoIndex(idx)}
                  className={`relative group rounded-lg overflow-hidden border-2 transition-all aspect-square ${
                    selectedVideoIndex === idx
                      ? "border-[#0088CC] ring-2 ring-[#0088CC] ring-offset-2 ring-offset-[#000000]"
                      : "border-[#666666] hover:border-[#0088CC]/70"
                  }`}
                >
                  <div className="w-full h-full bg-black flex items-center justify-center relative overflow-hidden">
                    <video
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      crossOrigin="anonymous"
                      preload="metadata"
                      playsInline
                    >
                      <source src={video.url} type={video.type} />
                    </video>
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center pointer-events-none">
                      <Play className="w-6 h-6 text-white fill-white" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Video Player */}
          <div className="bg-[#1a1a1a] rounded-lg overflow-hidden border border-[#666666]">
            <div className="relative bg-black flex items-center justify-center min-h-[400px]">
              <video
                controls
                controlsList="nodownload"
                preload="metadata"
                className="w-full max-h-[600px] object-contain"
                crossOrigin="anonymous"
                playsInline
              >
                <source
                  src={videos[selectedVideoIndex].url}
                  type={videos[selectedVideoIndex].type}
                />
                Your browser does not support the video tag.
              </video>
            </div>

            {/* Video Info and Actions */}
            <div className="p-4 sm:p-6 space-y-3 border-t border-[#666666]">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-white truncate">
                    {videos[selectedVideoIndex].name}
                  </p>
                  {videos.length > 1 && (
                    <p className="text-xs text-[#979797] mt-1">
                      {selectedVideoIndex + 1} / {videos.length}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                {videos.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setSelectedVideoIndex((prev) =>
                          prev === 0 ? videos.length - 1 : prev - 1,
                        )
                      }
                      className="px-3 py-2 bg-[#1a1a1a] hover:bg-[#0088CC] hover:text-white text-[#979797] rounded-lg transition-all text-sm font-medium border border-[#666666] hover:border-[#0088CC]"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setSelectedVideoIndex((prev) =>
                          prev === videos.length - 1 ? 0 : prev + 1,
                        )
                      }
                      className="px-3 py-2 bg-[#1a1a1a] hover:bg-[#0088CC] hover:text-white text-[#979797] rounded-lg transition-all text-sm font-medium border border-[#666666] hover:border-[#0088CC]"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDownload(videos[selectedVideoIndex])}
                  className="flex-1 px-4 py-2 bg-[#0088CC] hover:bg-[#0077BB] text-white text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
