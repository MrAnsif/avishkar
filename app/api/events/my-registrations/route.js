import { connectDB } from "@/lib/db";
import Registration from "@/lib/models/Registration";
import Event from "@/lib/models/Event";
import { NextResponse } from "next/server";
import { jwtVerify, createRemoteJWKSet } from "jose";

export async function GET(req) {
  try {
    await connectDB();

    // Get token from Authorization header
    const authHeader = req.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("MY-REGISTRATIONS API - No Bearer token found");
      return NextResponse.json(
        { message: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    console.log("TOKEN", token);
    // Verify token using Clerk's JWKS endpoint
    let userId;
    try {
      const JWKS = createRemoteJWKSet(
        new URL('https://cosmic-adder-20.clerk.accounts.dev/.well-known/jwks.json')
      );

      const { payload } = await jwtVerify(token, JWKS, {
        issuer: 'https://cosmic-adder-20.clerk.accounts.dev',
        clockTolerance: 60,
      });

      userId = payload.sub;
      console.log("MY-REGISTRATIONS API - UserId:", userId);
    } catch (err) {
      console.error("Token verification failed:", err);
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // Find registrations of this user and populate event details
    const registrations = await Registration.find({ userId })
      .populate({
        path: "eventId",
        model: Event,
        select: "title description imageUrl amount type teamSize rules upiId department eventCategory"
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      { registrations },
      { status: 200 }
    );
  } catch (err) {
    console.error("MY REGISTRATIONS FETCH ERROR:", err);
    return NextResponse.json(
      { message: "Failed to fetch registrations", error: err.message },
      { status: 500 }
    );
  }
}