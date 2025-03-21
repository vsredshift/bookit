"use server";

import { createSessionClient } from "@/config/appwrite";
import { revalidatePath } from "next/cache";
import { redirect } from "next/dist/server/api-utils";
import { cookies } from "next/headers";
import { Query } from "node-appwrite";

const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
const col = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS;

async function deleteRoom(roomId) {
  const sessionCookie = (await cookies()).get("appwrite-session");

  if (!sessionCookie) {
    redirect("/login");
  }

  try {
    const { databases, account } = await createSessionClient(
      sessionCookie.value
    );
    const user = await account.get();
    const userId = user.$id;

    // Get user's rooms
    const { documents: rooms } = await databases.listDocuments(db, col, [
      Query.equal("user_id", userId),
    ]);

    // Find room to delete
    const roomToDelete = rooms.find((room) => room.$id === roomId);

    // Delete the room
    if (roomToDelete) {
      await databases.deleteDocument(db, col, roomToDelete.$id);

      revalidatePath("/rooms/my", "layout");
      revalidatePath("/", "layout");

      return {
        success: true,
      };
    } else {
      return {
        error: "Room not found",
      };
    }
  } catch (error) {
    console.error("Error deleting room: ", error);
    return {
      error: "Failed to delete room",
    };
  }
}

export default deleteRoom;
