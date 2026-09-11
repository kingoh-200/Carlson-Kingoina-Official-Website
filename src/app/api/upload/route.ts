import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

// Vercel Serverless Functions reject request bodies over about 4.5 MB before
// this handler runs. Leave room for multipart form-data overhead.
const MAX_UPLOAD_SIZE = 4 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const ALLOWED_FOLDERS = new Set(["images", "portfolio", "profile"]);

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    // Accept both "folder" and "bucket" params from the client
    const requestedFolder = (formData.get("folder") as string) || (formData.get("bucket") as string) || "portfolio";
    const folder = ALLOWED_FOLDERS.has(requestedFolder) ? requestedFolder : "portfolio";

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and GIF images are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_UPLOAD_SIZE) {
      return NextResponse.json(
        { error: "File must be 4 MB or smaller for uploads on Vercel." },
        { status: 400 }
      );
    }

    // Check Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: "Cloudinary not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to Vercel env vars." },
        { status: 500 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      cloudinary.uploader.upload(
        base64,
        {
          folder,
          resource_type: "image",
          transformation: folder === "profile"
            ? [{ width: 1200, height: 1200, crop: "fill", gravity: "auto", quality: "auto:best", fetch_format: "auto" }]
            : [
                { width: 1200, height: 1200, crop: "limit" },
                { quality: "auto", fetch_format: "auto" },
              ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result!);
        }
      );
    });

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
