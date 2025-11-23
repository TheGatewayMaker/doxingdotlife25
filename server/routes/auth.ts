import { RequestHandler } from "express";

interface AuthRequest {
  username: string;
  password: string;
}

interface AuthSession {
  token: string;
  createdAt: number;
  expiresAt: number;
}

// In-memory session store (in production, use Redis or a database)
const sessions: Map<string, AuthSession> = new Map();

// Token validity: 24 hours
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000;

// Generate a secure random token
const generateToken = (): string => {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { username, password } = req.body as AuthRequest;

    // Validate credentials against environment variables
    const validUsername = process.env.ADMIN_USERNAME || "uploader81";
    const validPassword = process.env.ADMIN_PASSWORD || "uploader123";

    if (!username || !password) {
      res.status(400).json({ error: "Username and password required" });
      return;
    }

    if (username !== validUsername || password !== validPassword) {
      res.status(401).json({ error: "Invalid username or password" });
      return;
    }

    // Generate session token
    const token = generateToken();
    const now = Date.now();
    const session: AuthSession = {
      token,
      createdAt: now,
      expiresAt: now + TOKEN_EXPIRY_MS,
    };

    sessions.set(token, session);

    // Clean up old sessions
    for (const [key, value] of sessions.entries()) {
      if (value.expiresAt < now) {
        sessions.delete(key);
      }
    }

    res.json({
      success: true,
      message: "Login successful",
      token,
      expiresIn: TOKEN_EXPIRY_MS,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

export const handleLogout: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      sessions.delete(token);
    }

    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
};

export const handleCheckAuth: RequestHandler = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ authenticated: false, message: "No token provided" });
      return;
    }

    const session = sessions.get(token);
    const now = Date.now();

    if (!session || session.expiresAt < now) {
      if (session) {
        sessions.delete(token);
      }
      res.status(401).json({ authenticated: false, message: "Token expired or invalid" });
      return;
    }

    res.json({
      authenticated: true,
      message: "Token is valid",
      expiresAt: session.expiresAt,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(500).json({ error: "Auth check failed" });
  }
};

// Middleware to verify authentication
export const authMiddleware: (
  req: any,
  res: any,
  next: any,
) => void = (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ error: "No authentication token provided" });
      return;
    }

    const session = sessions.get(token);
    const now = Date.now();

    if (!session || session.expiresAt < now) {
      if (session) {
        sessions.delete(token);
      }
      res.status(401).json({ error: "Token expired or invalid" });
      return;
    }

    // Token is valid, continue
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({ error: "Authentication failed" });
  }
};
