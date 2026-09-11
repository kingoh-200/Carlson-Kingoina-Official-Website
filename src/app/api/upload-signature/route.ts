import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export const runtime = "nodejs";

const ALLOWED_FOLDERS = new Set(["images", "portfolio", "profile"]);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request: Request) {
  const requestedFolder = new URL(request.url).searchParams.get("folder") || "images";
  const folder = ALLOWED_FOLDERS.has(requestedFolder) ? requestedFolder : "images";
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({ error: "Cloudinary is not configured." }, { status: 500 });
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = cloudinary.utils.api_sign_request({ folder, timestamp }, apiSecret);

  return NextResponse.json({ cloudName, apiKey, folder, timestamp, signature });
}
