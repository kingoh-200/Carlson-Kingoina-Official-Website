import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  // Save to database
  const supabase = await createClient();

  const { error: dbError } = await supabase
    .from("contact_messages")
    .insert({ name, email, message });

  if (dbError) {
    console.error("Failed to save message:", dbError);
  }

  // Optionally send email via Resend
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("RESEND_API_KEY not set — message saved to DB only");
    return NextResponse.json({ success: true, emailSent: false });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL ?? "kingoina254@gmail.com",
      subject: `New message from ${name}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    return NextResponse.json({ success: true, emailSent: true });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json({ success: true, emailSent: false });
  }
}
