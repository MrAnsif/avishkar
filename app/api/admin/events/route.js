import { connectDB } from "@/lib/db";
import Event from "@/lib/models/Event";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { adminAuth } from "@/lib/middleware/adminAuth";
import mongoose from "mongoose";

// ========================
// CREATE EVENT
// ========================
export async function POST(req) {
  try {
    await connectDB();

    // ✅ Get admin info from JWT
    const adminData = adminAuth(req);
    const departmentName = adminData.department; // e.g., "cse"

    const {
      title,
      description,
      eventCategory,
      type,
      teamSize,
      upiId,
      amount,
      rules,
      imageBase64,
      startTime,
      endTime,
      registrationDeadline,
    } = await req.json();

    // Validation
    if (
      !title ||
      !eventCategory ||
      !type ||
      !upiId ||
      amount === undefined || // check if amount is provided
      !rules ||
      !imageBase64 ||
      !startTime ||
      !endTime ||
      !registrationDeadline
    ) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    console.log("Starting Cloudinary upload...");

    // Upload image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imageBase64, {
      folder: "events",
      resource_type: "auto",
    });

    console.log("Cloudinary upload successful:", uploadResult.secure_url);

    // ✅ Create Event using department from JWT
    const event = await Event.create({
      title,
      description,
      eventCategory,
      department: eventCategory === "department" ? departmentName : null,
      type,
      teamSize: type === "team" ? Number(teamSize || 1) : 1,
      upiId,
      amount,
      rules,
      imageUrl: uploadResult.secure_url,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      registrationDeadline: new Date(registrationDeadline),
      isActive: true,
    });

    console.log("Event created successfully:", event._id);

    return NextResponse.json({ message: "Event added successfully", event }, { status: 201 });
  } catch (error) {
    console.error("Add Event Error:", error);
    return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
  }
}

// ========================
// UPDATE EVENT
// ========================
export async function PUT(req) {
  try {
    await connectDB();

    // ✅ Get admin info from JWT
    const adminData = adminAuth(req);
    const departmentName = adminData.department;

    const {
      eventId,
      title,
      description,
      eventCategory,
      type,
      teamSize,
      upiId,
      amount,
      rules,
      imageBase64,
      startTime,
      endTime,
      registrationDeadline,
      isActive,
    } = await req.json();

    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json({ message: "Valid Event ID required" }, { status: 400 });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // Update fields
    if (title) event.title = title;
    if (description) event.description = description;
    if (eventCategory) event.eventCategory = eventCategory;
    if (eventCategory === "department") event.department = departmentName; // ✅ ensure department from JWT
    if (type) event.type = type;
    if (type === "team" && teamSize) event.teamSize = Number(teamSize);
    if (upiId) event.upiId = upiId;
    if (amount !== undefined) event.amount = amount;
    if (rules) event.rules = rules;
    if (startTime) event.startTime = new Date(startTime);
    if (endTime) event.endTime = new Date(endTime);
    if (registrationDeadline) event.registrationDeadline = new Date(registrationDeadline);
    if (isActive !== undefined) event.isActive = isActive;

    // Update image if new base64 provided
    if (imageBase64) {
      console.log("Updating event image...");
      if (event.imageUrl) {
        try {
          const urlParts = event.imageUrl.split("/");
          const filename = urlParts[urlParts.length - 1];
          const publicId = `events/${filename.split(".")[0]}`;
          await cloudinary.uploader.destroy(publicId);
          console.log("Old image deleted:", publicId);
        } catch (deleteError) {
          console.error("Error deleting old image:", deleteError);
        }
      }

      const uploadResult = await cloudinary.uploader.upload(imageBase64, {
        folder: "events",
        resource_type: "auto",
      });

      event.imageUrl = uploadResult.secure_url;
      console.log("New image uploaded:", uploadResult.secure_url);
    }

    await event.save();

    return NextResponse.json({ message: "Event updated successfully", event }, { status: 200 });
  } catch (error) {
    console.error("Update Event Error:", error);
    return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
  }
}

// ========================
// DELETE EVENT
// ========================
export async function DELETE(req) {
  try {
    await connectDB();

    // ✅ Get admin info from JWT (optional, just for logging/security)
    const adminData = adminAuth(req);

    const { eventId } = await req.json();
    if (!eventId || !mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json({ message: "Valid Event ID required" }, { status: 400 });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // Delete image from Cloudinary
    if (event.imageUrl) {
      try {
        const urlParts = event.imageUrl.split("/");
        const filename = urlParts[urlParts.length - 1];
        const publicId = `events/${filename.split(".")[0]}`;
        await cloudinary.uploader.destroy(publicId);
        console.log("Image deleted from Cloudinary:", publicId);
      } catch (deleteError) {
        console.error("Error deleting image from Cloudinary:", deleteError);
      }
    }

    await Event.findByIdAndDelete(eventId);

    return NextResponse.json({ message: "Event deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Delete Event Error:", error);
    return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
  }
}
export async function GET(req, { params }) {
  try {
    await connectDB();

    const { department } = params;

    if (!department) {
      return NextResponse.json({ message: "Department is required" }, { status: 400 });
    }

    // Fetch events where department matches OR common events
    const events = await Event.find({
      $or: [
        { department: department },
        { eventCategory: "common" }
      ]
    }).sort({ startTime: 1 });

    return NextResponse.json({ events }, { status: 200 });
  } catch (error) {
    console.error("Fetch Department Events Error:", error);
    return NextResponse.json({ message: error.message || "Server Error" }, { status: 500 });
  }
}
// ========================
// ENABLE / DISABLE EVENT
// ========================
export async function PATCH(req) {
  try {
    await connectDB();

    // 🔐 Admin auth (optional but recommended)
    adminAuth(req);

    const { eventId, isActive } = await req.json();

    if (!eventId || typeof isActive !== "boolean") {
      return NextResponse.json(
        { message: "Event ID and isActive(boolean) are required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return NextResponse.json(
        { message: "Invalid Event ID" },
        { status: 400 }
      );
    }

    const event = await Event.findByIdAndUpdate(
      eventId,
      { isActive },
      { new: true }
    );

    if (!event) {
      return NextResponse.json(
        { message: "Event not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: `Event ${isActive ? "enabled" : "disabled"} successfully`,
        event,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Toggle Event Status Error:", error);
    return NextResponse.json(
      { message: error.message || "Server Error" },
      { status: 500 }
    );
  }
}

