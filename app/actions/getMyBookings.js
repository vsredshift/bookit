"use server";

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import checkAuth from "./checkAuth";
import { Query } from "node-appwrite";
import { redirect } from "next/navigation";

const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
const col = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_BOOKINGS;

async function getMyBookings() {
  const sessionCookie = (await cookies()).get("appwrite-session");

  if (!sessionCookie) {
    redirect("/login");
  }

  try {
    const { databases } = await createSessionClient(sessionCookie.value);
    const { user } = await checkAuth();

    const { documents: bookings } = await databases.listDocuments(db, col, [
      Query.equal("user_id", user.id),
    ]);

    return bookings;
  } catch (error) {
    console.error("Error retrieving user bookings: ", error);
    return {
      error: "Something went wrong getting bookings",
    };
  }
}

export default getMyBookings;
