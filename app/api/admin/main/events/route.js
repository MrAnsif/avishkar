import { connectDB } from "@/lib/db";
import Event from "@/lib/models/Event";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import { mainAdminAuth } from "@/lib/middleware/mainAdminAuth";
import mongoose from "mongoose";

// --------------------- CREATE MAIN EVENT ---------------------
export async function POST(req) {
  try {
    await connectDB();
    mainAdminAuth(req);

    const body = await req.json();
    const {
      title,
      description,
      type,
      teamSize,
      upiId,
      amount,
      rules,
      imageBase64,
      startTime,
      endTime,
      registrationDeadline,
    } = body;

    // 🔒 Required field validation
    if (
      !title ||
      !type ||
      !upiId ||
      amount === undefined ||
      !rules ||
      !Array.isArray(rules) ||
      !imageBase64 ||
      !startTime ||
      !endTime ||
      !registrationDeadline
    ) {
      return NextResponse.json(
        { message: "All required fields must be provided" },
        { status: 400 }
      );
    }

    if (!["individual", "team"].includes(type)) {
      return NextResponse.json(
        { message: "Invalid event type" },
        { status: 400 }
      );
    }

    if (type === "team" && (!teamSize || teamSize < 2)) {
      return NextResponse.json(
        { message: "Team events must have teamSize >= 2" },
        { status: 400 }
      );
    }

    // ☁️ Upload image (Base64)
    const uploadResult = await cloudinary.uploader.upload(imageBase64, {
      folder: "main_events",
    });

    const event = await Event.create({
      title,
      description,
      eventCategory: "common",   // 🔒 fixed for main events
      department: null,           // 🔒 always null for common events
      type,
      teamSize: type === "team" ? Number(teamSize) : 1,
      upiId,
      amount: Number(amount),
      rules,
      imageUrl: uploadResult.secure_url,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      registrationDeadline: new Date(registrationDeadline),
      isActive: true,
    });

    // Remove department from response
    const { department, ...responseEvent } = event.toObject();

    return NextResponse.json(
      { message: "Main event created successfully", event: responseEvent },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE MAIN EVENT ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

// --------------------- UPDATE MAIN EVENT ---------------------
export async function PUT(req) {
  try {
    await connectDB();
    mainAdminAuth(req);

    const body = await req.json();
    const { eventId, imageBase64, ...updates } = body;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json(
        { message: "Invalid eventId" },
        { status: 400 }
      );
    }

    const event = await Event.findById(eventId);
    if (!event || event.eventCategory !== "common") {
      return NextResponse.json(
        { message: "Main event not found" },
        { status: 404 }
      );
    }

    // 🔒 Prevent category & department tampering
    delete updates.eventCategory;
    delete updates.department;

    // 🧠 Team size logic
    if (updates.type === "individual") {
      updates.teamSize = 1;
    }
    if (updates.type === "team" && updates.teamSize < 2) {
      return NextResponse.json(
        { message: "Team size must be at least 2" },
        { status: 400 }
      );
    }

    // ☁️ Image update (optional)
    if (imageBase64) {
      const uploadResult = await cloudinary.uploader.upload(imageBase64, {
        folder: "main_events",
      });
      updates.imageUrl = uploadResult.secure_url;
    }

    Object.assign(event, updates);
    await event.save();

    const { department, ...responseEvent } = event.toObject();

    return NextResponse.json(
      { message: "Main event updated successfully", event: responseEvent },
      { status: 200 }
    );
  } catch (error) {
    console.error("UPDATE MAIN EVENT ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

// --------------------- DELETE MAIN EVENT ---------------------
export async function DELETE(req) {
  try {
    await connectDB();
    mainAdminAuth(req);

    const { eventId } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json(
        { message: "Invalid eventId" },
        { status: 400 }
      );
    }

    const event = await Event.findById(eventId);
    if (!event || event.eventCategory !== "common") {
      return NextResponse.json(
        { message: "Main event not found" },
        { status: 404 }
      );
    }

    await Event.findByIdAndDelete(eventId);

    return NextResponse.json(
      { message: "Main event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE MAIN EVENT ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

// --------------------- GET ALL MAIN EVENTS ---------------------
export async function GET(req) {
  try {
    await connectDB();
    mainAdminAuth(req);

    const events = await Event.find({ eventCategory: "common" })
      .sort({ createdAt: -1 })
      .lean();

    // Remove department from all events
    const cleanEvents = events.map(({ department, ...rest }) => rest);

    return NextResponse.json({ events: cleanEvents }, { status: 200 });
  } catch (error) {
    console.error("GET MAIN EVENTS ERROR:", error);
    return NextResponse.json(
      { message: "Failed to fetch main events" },
      { status: 500 }
    );
  }
}

// --------------------- ENABLE / DISABLE MAIN EVENT ---------------------
export async function PATCH(req) {
  try {
    await connectDB();
    mainAdminAuth(req);

    const { eventId, isActive } = await req.json();

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json(
        { message: "Invalid eventId" },
        { status: 400 }
      );
    }

    if (typeof isActive !== "boolean") {
      return NextResponse.json(
        { message: "isActive must be true or false" },
        { status: 400 }
      );
    }

    const event = await Event.findOneAndUpdate(
      { _id: eventId, eventCategory: "common" },
      { isActive },
      { new: true }
    );

    if (!event) {
      return NextResponse.json(
        { message: "Main event not found" },
        { status: 404 }
      );
    }

    const { department, ...responseEvent } = event.toObject();

    return NextResponse.json(
      {
        message: `Event ${isActive ? "enabled" : "disabled"} successfully`,
        event: responseEvent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("TOGGLE MAIN EVENT STATUS ERROR:", error);
    return NextResponse.json(
      { message: "Failed to update event status" },
      { status: 500 }
    );
  }
}
