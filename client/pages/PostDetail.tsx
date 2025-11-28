import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Share2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostDescriptionSection from "@/components/PostDescriptionSection";
import PostMediaSection from "@/components/PostMediaSection";
import NSFWWarningModal from "@/components/NSFWWarningModal";
import { NSFWIcon } from "@/components/Icons";
import { Post } from "@shared/api";
import { toast } from "sonner";

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPosts] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [thumbnailError, setThumbnailError] = useState(false);
  const [showNSFWWarning, setShowNSFWWarning] = useState(false);
  const [nsfwApproved, setNsfwApproved] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const response = await fetch("/api/posts");
        const data = await response.json();
        const posts = Array.isArray(data.posts) ? data.posts : [];
        const foundPost = posts.find((p: Post) => p.id === postId);

        if (foundPost) {
          setPosts(foundPost);
          if (foundPost.nsfw) {
            setShowNSFWWarning(true);
          }
        } else {
          setError("Post not found");
        }
      } catch (err) {
        console.error("Error loading post:", err);
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [postId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex flex-col animate-fadeIn">
        <Header />
        <main className="flex-1 w-full flex items-center justify-center px-4">
          <div className="text-center">
            <div className="inline-block animate-spin mb-4">
              <div className="w-14 h-14 border-4 border-[#666666] border-t-[#0088CC] rounded-full"></div>
            </div>
            <p className="text-[#979797] text-lg">Loading post...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex flex-col animate-fadeIn">
        <Header />
        <main className="flex-1 w-full flex items-center justify-center px-4">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-3xl font-bold mb-4 text-white">
              {error || "Post not found"}
            </h2>
            <p className="text-[#979797] mb-6 max-w-sm">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-[#0088CC] text-white font-semibold rounded-lg hover:bg-[#0077BB] transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              ← Back to Home
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (showNSFWWarning && !nsfwApproved && post.nsfw) {
    return (
      <div className="min-h-screen bg-[#000000] text-white flex flex-col animate-fadeIn">
        <Header />
        <main className="flex-1 w-full flex items-center justify-center p-4">
          <NSFWWarningModal
            onProceed={() => setNsfwApproved(true)}
            onGoBack={() => navigate("/")}
          />
        </main>
        <Footer />
      </div>
    );
  }

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy URL:", err);
      if (navigator.share) {
        navigator.share({
          title: post.title,
          text: post.description.substring(0, 100),
          url: url,
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col animate-fadeIn">
      <Header />
      <main className="flex-1 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
          {/* Back Button */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 mb-8 text-[#979797] hover:text-[#0088CC] transition-all duration-200 font-semibold animate-fadeIn hover:translate-x-[-4px]"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span>Back to Home</span>
          </button>

          {/* Main Content Container - Max Width */}
          <div className="max-w-5xl mx-auto">
            {/* NSFW Warning Banner */}
            {post.nsfw && (
              <div className="mb-8 bg-[#1a1a1a] border border-red-600/40 rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 animate-fadeIn">
                <NSFWIcon className="w-7 h-7 text-red-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white mb-1">
                    NSFW Content Warning
                  </p>
                  <p className="text-sm text-[#979797]">
                    This post contains explicit content. Ensure you're viewing
                    in an appropriate and private setting.
                  </p>
                </div>
              </div>
            )}

            {/* Thumbnail Section */}
            <section
              className="mb-10 sm:mb-12 animate-fadeIn"
              style={{ animationDelay: "0.1s" }}
            >
              {post.thumbnail && !thumbnailError && (
                <div className="rounded-xl overflow-hidden border border-[#666666] shadow-2xl max-w-3xl mx-auto">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-auto object-cover"
                    onError={() => setThumbnailError(true)}
                    crossOrigin="anonymous"
                  />
                </div>
              )}

              {thumbnailError && (
                <div className="w-full h-96 bg-[#1a1a1a] flex items-center justify-center rounded-xl border border-[#666666]">
                  <div className="text-center">
                    <div className="text-8xl mb-3">🖼️</div>
                    <p className="text-[#979797]">Thumbnail unavailable</p>
                  </div>
                </div>
              )}
            </section>

            {/* Title & Info Section */}
            <section
              className="mb-10 sm:mb-12 animate-fadeIn"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="mb-4">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {post.nsfw && (
                    <span className="inline-flex items-center px-3 py-1 bg-[#0088CC] text-white text-xs font-bold rounded-full">
                      NSFW
                    </span>
                  )}
                  <span className="inline-flex items-center px-3 py-1 bg-[#666666] text-white text-xs font-semibold rounded-full border border-[#979797]">
                    📰 Post
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 text-white leading-tight">
                  {post.title}
                </h1>
              </div>

              {/* Post Metadata */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-xs sm:text-sm text-[#979797] space-y-2 sm:space-y-0">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📅</span>
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="hidden sm:block w-1 h-1 bg-[#666666] rounded-full"></div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🕒</span>
                  <span>
                    {new Date(post.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </section>

            {/* Description Section */}
            <section
              className="mb-10 sm:mb-12 animate-fadeIn"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="bg-[#1a1a1a] border border-[#666666] rounded-xl p-6 sm:p-8">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>📋</span>
                  Overview
                </h2>
                <PostDescriptionSection
                  description={post.description}
                  tags={{
                    country: post.country,
                    city: post.city,
                    server: post.server,
                  }}
                />
              </div>
            </section>

            {/* Media Section */}
            {post.mediaFiles && post.mediaFiles.length > 0 && (
              <section
                className="mb-10 sm:mb-12 animate-fadeIn"
                style={{ animationDelay: "0.4s" }}
              >
                <h2 className="text-lg sm:text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <span>📁</span>
                  Media Gallery
                </h2>
                <PostMediaSection
                  mediaFiles={post.mediaFiles}
                  postTitle={post.title}
                  thumbnailUrl={post.thumbnail}
                />
              </section>
            )}

            {/* Share Section */}
            <section
              className="border-t border-[#666666] pt-8 sm:pt-10 animate-fadeIn"
              style={{ animationDelay: "0.5s" }}
            >
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[#0088CC] text-white font-bold rounded-lg hover:bg-[#0077BB] transition-all shadow-lg hover:shadow-lg hover:shadow-[#0088CC]/40 active:scale-95 text-sm sm:text-base"
              >
                <Share2 className="w-5 h-5" />
                <span>Share This Post</span>
              </button>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
