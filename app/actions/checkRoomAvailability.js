"use server";

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import checkAuth from "./checkAuth";
import { Query } from "node-appwrite";
import { dateRangesOverlap, toUTCDateTime } from "@/utils/formatDate";

const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
const col = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS;

async function checkRoomAvailability(roomId, checkIn, checkOut) {
  const sessionCookie = (await cookies()).get("appwrite-session");

  if (!sessionCookie) {
    redirect("/login");
  }

  try {
    const { databases } = await createSessionClient();

    const checkInDateTime = toUTCDateTime(checkIn);
    const checkOutDateTime = toUTCDateTime(checkOut);

    // Fetch all bookings for a given room
    const { document: bookings } = await databases.listDocuments(db, col, [
      Query.equal("room_id", roomId),
    ]);

    if (bookings) {
      // Loop over bookings and check for overlaps
      for (const booking of bookings) {
        const bookingCheckInDateTime = toUTCDateTime(booking.check_in);
        const bookingCheckOutDateTime = toUTCDateTime(booking.check_out);
        console.log("BOOKING: ", booking);

        if (
          dateRangesOverlap(
            checkInDateTime,
            checkOutDateTime,
            bookingCheckInDateTime,
            bookingCheckOutDateTime
          )
        ) {
          return false;
        }
      }
    }
    return true;
  } catch (error) {
    console.error("Failed check availability: ", error);
    return {
      error: "Something went wrong checking room availability",
    };
  }
}

export default checkRoomAvailability;
