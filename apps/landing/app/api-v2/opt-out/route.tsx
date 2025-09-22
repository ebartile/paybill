import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body // Example fields

    // Configure SMTP transport using environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    // Send mail
    await transporter.sendMail({
      from: `"My App" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO, // recipient email from env
      subject: 'New Submission',
      text: `You have a new message from ${name} (${email}):\n\n${message}`,
      html: `<p>You have a new message from <strong>${name}</strong> (${email}):</p><p>${message}</p>`,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('SMTP Error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
