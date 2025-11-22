import { RequestHandler } from "express";
import { uploadMediaFile, uploadPostMetadata, getServersList, updateServersList } from "../utils/r2-storage";

interface UploadRequest {
  title: string;
  description: string;
  country?: string;
  city?: string;
  server?: string;
}

export const handleUpload: RequestHandler = async (req, res) => {
  try {
    const { title, description, country, city, server } = req.body as UploadRequest;
    const file = req.file;

    if (!title || !description || !file) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const postId = Date.now().toString();
    const mediaFileName = file.originalname || `${Date.now()}-media`;

    const mediaUrl = await uploadMediaFile(
      postId,
      mediaFileName,
      file.buffer,
      file.mimetype || "application/octet-stream",
    );

    const postMetadata = {
      id: postId,
      title,
      description,
      country: country || "",
      city: city || "",
      server: server || "",
      mediaFiles: [mediaFileName],
      createdAt: new Date().toISOString(),
    };

    await uploadPostMetadata(postId, postMetadata);

    if (server && server.trim()) {
      const servers = await getServersList();
      const updatedServers = Array.from(new Set([...servers, server]));
      updatedServers.sort();
      await updateServersList(updatedServers);
    }

    res.json({
      success: true,
      message: "Post uploaded successfully",
      postId,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
};
