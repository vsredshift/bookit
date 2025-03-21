"use server";

import { createSessionClient } from "@/config/appwrite";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import checkAuth from "./checkAuth";

const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
const col = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS;

async function cancelBooking(bookingId) {
  const sessionCookie = (await cookies()).get("appwrite-session");

  if (!sessionCookie) {
    redirect("/login");
  }

  try {
    const { databases } = await createSessionClient(sessionCookie.value);
    const { user } = await checkAuth();

    if (!user) {
      return {
        error: "You must be logged in to manage bookings",
      };
    }

    const booking = await databases.getDocument(db, col, bookingId);

    if (booking.user_id !== user.id) {
      return {
        error: "You are not authorized to cancel this booking",
      };
    }

    await databases.deleteDocument(db, col, bookingId);

    revalidatePath("/bookings", "layout");

    return {
      success: true,
    };
  } catch (error) {}
}

export default cancelBooking;
