import { RequestHandler } from "express";
import {
  uploadMediaFile,
  uploadPostMetadata,
  getServersList,
  updateServersList,
  uploadPostMetadataWithThumbnail,
} from "../utils/r2-storage";

interface UploadRequest {
  title: string;
  description: string;
  country?: string;
  city?: string;
  server?: string;
  nsfw?: string | boolean;
}

export const handleUpload: RequestHandler = async (req, res) => {
  try {
    const { title, description, country, city, server, nsfw } =
      req.body as UploadRequest;
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    if (!title || !description || !files?.media || !files?.thumbnail) {
      console.error("Missing required fields", {
        title: !!title,
        description: !!description,
        media: !!files?.media,
        mediaCount: files?.media?.length,
        thumbnail: !!files?.thumbnail,
      });
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    if (files.media.length === 0) {
      res.status(400).json({ error: "At least one media file is required" });
      return;
    }

    const thumbnailFile = files.thumbnail[0];
    const postId = Date.now().toString();
    const thumbnailFileName = `thumbnail-${Date.now()}`;

    try {
      console.log(
        `[${new Date().toISOString()}] Starting upload for post ${postId} with ${files.media.length} media file(s)`,
      );

      // Upload thumbnail
      const thumbnailUrl = await uploadMediaFile(
        postId,
        thumbnailFileName,
        thumbnailFile.buffer,
        thumbnailFile.mimetype || "image/jpeg",
      );

      // Upload all media files
      const mediaFileNames: string[] = [];
      for (let i = 0; i < files.media.length; i++) {
        const mediaFile = files.media[i];
        const sanitizedName = mediaFile.originalname || `media-${i + 1}`;
        const mediaFileName = `${Date.now()}-${i}-${sanitizedName}`;

        console.log(
          `Uploading media file ${i + 1}/${files.media.length}: ${mediaFileName}`,
        );

        await uploadMediaFile(
          postId,
          mediaFileName,
          mediaFile.buffer,
          mediaFile.mimetype || "application/octet-stream",
        );

        mediaFileNames.push(mediaFileName);
      }

      console.log(`Successfully uploaded ${mediaFileNames.length} media files`);

      const postMetadata = {
        id: postId,
        title,
        description,
        country: country || "",
        city: city || "",
        server: server || "",
        nsfw: nsfw === "true" || nsfw === true,
        mediaFiles: mediaFileNames,
        createdAt: new Date().toISOString(),
      };

      await uploadPostMetadataWithThumbnail(postId, postMetadata, thumbnailUrl);

      if (server && server.trim()) {
        try {
          const servers = await getServersList();
          const updatedServers = Array.from(new Set([...servers, server]));
          updatedServers.sort();
          await updateServersList(updatedServers);
        } catch (serverError) {
          console.error("Error updating servers list:", serverError);
        }
      }

      console.log(
        `[${new Date().toISOString()}] ✅ Post ${postId} uploaded successfully`,
      );

      res.json({
        success: true,
        message: "Post uploaded successfully",
        postId,
        mediaCount: mediaFileNames.length,
      });
    } catch (r2Error) {
      console.error("R2 upload error:", r2Error);
      const errorMessage =
        r2Error instanceof Error ? r2Error.message : String(r2Error);
      console.error("Detailed R2 error:", {
        error: errorMessage,
        stack: r2Error instanceof Error ? r2Error.stack : undefined,
        postId,
      });
      res.status(500).json({
        error: `Upload to R2 failed: ${errorMessage}`,
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      error: "Upload failed",
      details:
        process.env.NODE_ENV === "development"
          ? error instanceof Error
            ? error.message
            : String(error)
          : undefined,
    });
  }
};
