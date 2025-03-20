"use server";

import { createAdminClient } from "@/config/appwrite";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
const col = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS;

async function getRoom(id) {
  try {
    const { databases } = await createAdminClient();

    const room = await databases.getDocument(db, col, id);

    // revalidatePath("/", "layout");

    return room;
  } catch (error) {
    console.error("Failed to get rooms", error);
    redirect("/error");
  }
}

export default getRoom;