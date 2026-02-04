import { auth, clerkClient } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Registration from "@/lib/models/Registration";

export async function POST() {
  try {
    await connectDB();

    const { userId } = auth();
    if (!userId) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Get Clerk user
    const clerkUser = await clerkClient.users.getUser(userId);
    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) {
      return Response.json(
        { message: "User email not found" },
        { status: 400 }
      );
    }

    // Relink registrations by email → production userId
    const result = await Registration.updateMany(
      { email },
      { $set: { userId } }
    );

    return Response.json({
      message: "User relinked successfully",
      updatedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Relink error:", err);
    return Response.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}