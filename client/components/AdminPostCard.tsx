import { useState } from "react";
import { Post } from "@shared/api";
import {
  GlobeIcon,
  MapPinIcon,
  ServerIcon,
  TrashIcon,
  EditIcon,
  ImageIcon,
} from "./Icons";
import EditPostModal from "./EditPostModal";
import MediaManagerModal from "./MediaManagerModal";

interface AdminPostCardProps {
  post: Post;
  onDelete: (postId: string) => void;
  onUpdate: (post: Post) => void;
  animationDelay: number;
  getIdToken: () => Promise<string | null>;
}

export default function AdminPostCard({
  post,
  onDelete,
  onUpdate,
  animationDelay,
  getIdToken,
}: AdminPostCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);

  return (
    <>
      <div
        className="bg-card border border-border rounded-xl overflow-hidden hover:border-accent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fadeIn flex flex-col"
        style={{ animationDelay: `${animationDelay}s` }}
      >
        {/* Thumbnail */}
        {post.thumbnail && (
          <div className="w-full h-40 bg-muted overflow-hidden flex items-center justify-center">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = "none";
                const parent = img.parentElement;
                if (parent && !parent.querySelector("[data-error-shown]")) {
                  const errorDiv = document.createElement("div");
                  errorDiv.setAttribute("data-error-shown", "true");
                  errorDiv.className =
                    "text-center text-muted-foreground flex flex-col items-center justify-center gap-2";
                  errorDiv.innerHTML =
                    '<svg class="w-8 h-8 mx-auto text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"></polyline></svg><div class="text-xs">Image unavailable</div>';
                  parent.appendChild(errorDiv);
                }
              }}
              crossOrigin="anonymous"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-foreground text-base line-clamp-2 flex-1 hover:text-accent transition-colors">
              {post.title}
            </h3>
            {post.nsfw && (
              <span className="inline-flex items-center gap-1 bg-red-600 text-white px-2 py-1 rounded text-xs font-bold flex-shrink-0">
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                NSFW
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">
            {post.description}
          </p>

          {/* Post Info */}
          <div className="text-xs text-muted-foreground mb-4 space-y-1">
            <p>
              <span className="font-semibold">ID:</span> {post.id}
            </p>
            <p>
              <span className="font-semibold">Created:</span>{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Media Files:</span>{" "}
              {post.mediaFiles.length}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.country && (
              <span className="inline-flex items-center gap-1 bg-accent/20 text-accent px-2 py-1 rounded-full text-xs font-medium">
                <GlobeIcon className="w-3 h-3" />
                {post.country}
              </span>
            )}
            {post.city && (
              <span className="inline-flex items-center gap-1 bg-accent/20 text-accent px-2 py-1 rounded-full text-xs font-medium">
                <MapPinIcon className="w-3 h-3" />
                {post.city}
              </span>
            )}
            {post.server && (
              <span className="inline-flex items-center gap-1 bg-accent/20 text-accent px-2 py-1 rounded-full text-xs font-medium">
                <ServerIcon className="w-3 h-3" />
                {post.server}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowMediaModal(true)}
              className="flex-1 px-3 py-2 bg-blue-600 text-white font-medium text-xs rounded-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <ImageIcon className="w-4 h-4" />
              Media ({post.mediaFiles.length})
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="px-3 py-2 bg-amber-600 text-white font-medium text-xs rounded-lg hover:bg-amber-700 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <EditIcon className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => onDelete(post.id)}
              className="px-3 py-2 bg-red-600 text-white font-medium text-xs rounded-lg hover:bg-red-700 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <TrashIcon className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEditModal && (
        <EditPostModal
          post={post}
          onClose={() => setShowEditModal(false)}
          onUpdate={onUpdate}
          getIdToken={getIdToken}
        />
      )}

      {showMediaModal && (
        <MediaManagerModal
          post={post}
          onClose={() => setShowMediaModal(false)}
          onUpdate={onUpdate}
          getIdToken={getIdToken}
        />
      )}
    </>
  );
}
