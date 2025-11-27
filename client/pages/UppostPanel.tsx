import { useState } from "react";
import { LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { UploadIcon, ImageIcon } from "@/components/Icons";
import { useAuthContext } from "@/contexts/AuthContext";
import { toast } from "sonner";

export default function UppostPanel() {
  const navigate = useNavigate();
  const { isAuthenticated, email, user, loginWithGoogle, logout } =
    useAuthContext();
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [server, setServer] = useState("");
  const [nsfw, setNsfw] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<
    Array<{ file: File; preview: string; type: string }>
  >([]);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");

  const handleLogin = async () => {
    setLoginError("");
    setIsLoggingIn(true);

    try {
      await loginWithGoogle();
      toast.success("Successfully signed in with Google!");
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Login failed. Please try again.";
      setLoginError(errorMessage);
      toast.error(errorMessage);
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully signed out");
      resetForm();
    } catch (error) {
      toast.error("Error signing out. Please try again.");
      console.error("Logout error:", error);
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setMediaPreviews((prev) => [
            ...prev,
            {
              file,
              preview: reader.result as string,
              type: file.type,
            },
          ]);
        };
        reader.readAsDataURL(file);
      });
      setMediaFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeMediaFile = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCountry("");
    setCity("");
    setServer("");
    setNsfw(false);
    setThumbnail(null);
    setThumbnailPreview("");
    setMediaFiles([]);
    setMediaPreviews([]);
    setUploadMessage("");
    setUploadError("");
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError("");
    setUploadMessage("");

    if (!title || !description || mediaFiles.length === 0 || !thumbnail) {
      setUploadError(
        "Please fill in all required fields including thumbnail and at least one media file",
      );
      return;
    }

    // Validate file sizes (500MB = 500 * 1024 * 1024 bytes)
    const MAX_FILE_SIZE = 500 * 1024 * 1024;
    const oversizedFiles: string[] = [];

    if (thumbnail && thumbnail.size > MAX_FILE_SIZE) {
      oversizedFiles.push(
        `Thumbnail (${(thumbnail.size / 1024 / 1024).toFixed(2)}MB)`,
      );
    }

    for (const file of mediaFiles) {
      if (file.size > MAX_FILE_SIZE) {
        oversizedFiles.push(
          `${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`,
        );
      }
    }

    if (oversizedFiles.length > 0) {
      setUploadError(
        `The following files exceed 500MB: ${oversizedFiles.join(", ")}`,
      );
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("country", country);
    formData.append("city", city);
    formData.append("server", server);
    formData.append("nsfw", String(nsfw));
    formData.append("thumbnail", thumbnail);

    mediaFiles.forEach((file) => {
      formData.append("media", file);
    });

    setUploading(true);

    try {
      const idToken = await user?.getIdToken();
      if (!idToken) {
        throw new Error("Authentication token not available");
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        let errorMsg = "Upload failed";
        try {
          const errorData = await response.json();
          if (errorData.error) {
            errorMsg = errorData.error;
          }
          if (errorData.details) {
            errorMsg += ` (${errorData.details})`;
          }
        } catch (parseError) {
          console.error("Failed to parse error response", parseError);
          errorMsg = `Upload failed with status ${response.status}`;
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      setUploadMessage(
        `Post uploaded successfully! ${data.mediaCount ? `(${data.mediaCount} media file(s))` : ""}`,
      );
      toast.success("Post uploaded successfully!");
      resetForm();
    } catch (error) {
      const errorMsg =
        error instanceof Error
          ? error.message
          : "Error uploading post. Please try again.";
      setUploadError(errorMsg);
      toast.error(errorMsg);
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col animate-fadeIn">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-muted/20 to-background">
          <div
            className="w-full max-w-md animate-fadeIn"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="bg-card border border-border rounded-xl p-10 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="mb-4 w-12 h-12 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center shadow-lg">
                <UploadIcon className="w-6 h-6 text-accent-foreground" />
              </div>
              <h1 className="text-4xl font-black mb-2 text-foreground">
                Upload Portal
              </h1>
              <p className="text-muted-foreground mb-8 text-sm">
                Secure admin authentication required to create and manage posts
              </p>

              <div className="space-y-5">
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900 font-medium mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    <strong>
                      Only authorized Gmail accounts can access this admin panel
                    </strong>
                  </p>
                  <p className="text-xs text-blue-800">
                    Contact the administrator if you believe your email should
                    be authorized.
                  </p>
                </div>

                {loginError && (
                  <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm font-medium animate-fadeIn flex items-center gap-2">
                    <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                    {loginError}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="w-full px-4 py-3 bg-accent text-accent-foreground font-bold rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  {isLoggingIn ? "Signing in..." : "Sign in with Google"}
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col animate-fadeIn">
      <Header />
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-background via-card/50 to-background pt-8 pb-8 md:pt-16 md:pb-12 border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-0">
              <div
                className="animate-fadeIn"
                style={{ animationDelay: "0.1s" }}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 text-foreground tracking-tighter leading-tight flex items-center gap-2">
                  <UploadIcon className="w-8 h-8 text-accent" />
                  Upload Panel
                </h1>
                <p className="text-base sm:text-lg md:text-xl font-semibold text-muted-foreground mb-4">
                  Logged in as:{" "}
                  <span className="text-accent font-bold">{email}</span>
                </p>
                <div className="flex flex-wrap gap-3 items-center">
                  <span className="inline-block px-3 py-1.5 bg-accent/20 text-accent font-semibold text-sm rounded-full">
                    ✓ Authenticated
                  </span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 bg-destructive/90 hover:bg-destructive text-destructive-foreground font-bold rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95 whitespace-nowrap"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <form
            onSubmit={handleUpload}
            className="bg-card border border-border rounded-xl p-6 sm:p-8 md:p-10 space-y-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 animate-fadeIn"
            style={{ animationDelay: "0.2s" }}
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-bold mb-3 text-foreground">
                Post Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border hover:border-accent/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                placeholder="Enter post title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold mb-3 text-foreground">
                Description <span className="text-destructive">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border hover:border-accent/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent resize-none transition-all"
                rows={5}
                placeholder="Enter post description"
              />
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-bold mb-3 text-foreground">
                Thumbnail Image <span className="text-destructive">*</span>
              </label>
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all">
                <input
                  type="file"
                  onChange={handleThumbnailChange}
                  accept="image/*"
                  className="hidden"
                  id="thumbnail-upload"
                />
                <label
                  htmlFor="thumbnail-upload"
                  className="cursor-pointer block"
                >
                  {thumbnail ? (
                    <div className="space-y-3">
                      <svg
                        className="w-6 h-6 mx-auto text-accent"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <p className="text-sm font-bold text-accent">
                        {thumbnail.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(thumbnail.size / 1024 / 1024).toFixed(2)} MB • Ready
                        to upload
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <ImageIcon className="w-10 h-10 mx-auto text-muted-foreground" />
                      <p className="text-sm font-bold text-foreground">
                        Click to upload thumbnail
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Images only (Max 500MB)
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {thumbnailPreview && (
                <div className="mt-6 relative group">
                  <img
                    src={thumbnailPreview}
                    alt="Thumbnail Preview"
                    className="max-h-48 rounded-xl mx-auto border border-border object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setThumbnail(null);
                      setThumbnailPreview("");
                    }}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Location Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Country */}
              <div>
                <label className="block text-sm font-bold mb-3 text-foreground flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
                  Country
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border hover:border-accent/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  placeholder="(optional)"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-bold mb-3 text-foreground flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border hover:border-accent/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  placeholder="(optional)"
                />
              </div>

              {/* Server */}
              <div>
                <label className="block text-sm font-bold mb-3 text-foreground flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="8"/><rect x="2" y="14" width="20" height="8"/><line x1="6" y1="6" x2="6" y2="6.01"/><line x1="6" y1="18" x2="6" y2="18.01"/></svg>
                  Server Name
                </label>
                <input
                  type="text"
                  value={server}
                  onChange={(e) => setServer(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-border hover:border-accent/50 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
                  placeholder="(optional)"
                />
              </div>
            </div>

            {/* NSFW Checkbox */}
            <div className="flex items-center gap-3 bg-red-900/20 border border-red-600/50 rounded-lg p-4">
              <input
                type="checkbox"
                id="nsfw-checkbox"
                checked={nsfw}
                onChange={(e) => setNsfw(e.target.checked)}
                className="w-5 h-5 accent-red-600 rounded cursor-pointer"
              />
              <label htmlFor="nsfw-checkbox" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  <p className="text-sm font-bold text-red-400">
                    Mark as NSFW
                  </p>
                </div>
                <p className="text-xs text-red-300 mt-1">
                  This content is Not Safe For Work and requires age
                  verification
                </p>
              </label>
            </div>

            {/* Media Upload */}
            <div>
              <label className="block text-sm font-bold mb-3 text-foreground">
                Media Files <span className="text-destructive">*</span>
              </label>
              <div className="border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all">
                <input
                  type="file"
                  onChange={handleMediaChange}
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  id="media-upload"
                />
                <label htmlFor="media-upload" className="cursor-pointer block">
                  {mediaFiles.length > 0 ? (
                    <div className="space-y-3">
                      <svg
                        className="w-6 h-6 mx-auto text-accent"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <p className="text-sm font-bold text-accent">
                        {mediaFiles.length} file
                        {mediaFiles.length !== 1 ? "s" : ""} selected
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Click to add more files
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <UploadIcon className="w-10 h-10 mx-auto text-muted-foreground" />
                      <p className="text-sm font-bold text-foreground">
                        Click to upload media files
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Images and videos supported (Max 500MB each, unlimited
                        quantity)
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {mediaPreviews.length > 0 && (
                <div className="mt-6">
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-foreground mb-3">
                      Uploaded Media ({mediaPreviews.length})
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {mediaPreviews.map((media, idx) => (
                        <div key={idx} className="relative group">
                          {media.type.startsWith("image/") ? (
                            <img
                              src={media.preview}
                              alt={`Preview ${idx}`}
                              className="w-full aspect-square rounded-lg border border-border object-cover"
                            />
                          ) : (
                            <video
                              src={media.preview}
                              className="w-full aspect-square rounded-lg border border-border object-cover bg-muted"
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => removeMediaFile(idx)}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            {idx + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {uploadMessage && (
              <div className="p-4 bg-green-900/20 border border-green-600/50 rounded-lg text-green-400 text-sm font-medium flex items-center gap-2 animate-fadeIn">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                {uploadMessage}
              </div>
            )}

            {uploadError && (
              <div className="p-4 bg-destructive/10 border border-destructive/50 rounded-lg text-destructive text-sm font-medium flex items-center gap-2 animate-fadeIn">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                {uploadError}
              </div>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="w-full px-4 py-4 bg-accent text-accent-foreground font-bold rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <UploadIcon className="w-5 h-5" />
              {uploading ? "Uploading..." : "Upload Post"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
