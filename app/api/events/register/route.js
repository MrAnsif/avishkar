import { connectDB } from "@/lib/db";
import Registration from "@/lib/models/Registration";
import Event from "@/lib/models/Event";
import cloudinary from "@/lib/cloudinary";
import { jwtVerify, createRemoteJWKSet } from "jose";

async function generateUnique4DigitCode() {
  let code;
  let exists = true;
  while (exists) {
    code = Math.floor(1000 + Math.random() * 9000).toString();
    exists = await Registration.exists({ uniqueCode: code });
  }
  return code;
}

export async function POST(req) {
  try {
    await connectDB();

    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return Response.json(
        { message: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    console.log("TOKEN", token);

    // Verify token using Clerk's JWKS endpoint
    let userId;
    try {
      // Get your Clerk Frontend API from the JWT issuer
      const JWKS = createRemoteJWKSet(
        new URL('https://cosmic-adder-20.clerk.accounts.dev/.well-known/jwks.json')
      );

      const { payload } = await jwtVerify(token, JWKS, {
        issuer: 'https://cosmic-adder-20.clerk.accounts.dev',
        clockTolerance: 60,
      });

      userId = payload.sub;
      console.log("AUTH USER ID:", userId);
    } catch (err) {
      console.error("Token verification failed:", err);
      return Response.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (!userId) {
      return Response.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      eventId,
      name,
      age,
      email,
      phone,
      participantType,
      college,
      participantDepartment,
      semester,
      school,
      schoolClass,
      teamMembers = [],
      paymentScreenshot,
    } = body;

    if (
      !eventId ||
      !name ||
      !email ||
      !phone ||
      !participantType ||
      !paymentScreenshot
    ) {
      return Response.json(
        { message: "Missing fields" },
        { status: 400 }
      );
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return Response.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    const exists = await Registration.findOne({ userId, eventId });
    if (exists) {
      return Response.json(
        { message: "Already registered" },
        { status: 409 }
      );
    }

    const upload = await cloudinary.uploader.upload(paymentScreenshot, {
      folder: "event_payments",
    });

    const uniqueCode = await generateUnique4DigitCode();

    const registration = await Registration.create({
      userId,
      eventId,
      name,
      age,
      email,
      phone,
      participantType,
      college: participantType === "college" ? college : null,
      participantDepartment:
        participantType === "college" ? participantDepartment : null,
      semester: participantType === "college" ? semester : null,
      school: participantType === "school" ? school : null,
      schoolClass: participantType === "school" ? schoolClass : null,
      teamMembers,
      paymentScreenshot: upload.secure_url,
      uniqueCode,
    });

    return Response.json(
      { message: "Registered successfully", registration },
      { status: 201 }
    );
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return Response.json(
      { message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}