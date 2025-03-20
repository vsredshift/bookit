"use server";

import { createAdminClient } from "@/config/appwrite";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
const col = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS;

async function getRooms() {
  try {
    const { databases } = await createAdminClient();

    const { documents: rooms } = await databases.listDocuments(db, col);

    // revalidatePath("/", "layout");

    return rooms;
  } catch (error) {
    console.error("Failed to get rooms", error);
    redirect("/error");
  }
}

export default getRooms;