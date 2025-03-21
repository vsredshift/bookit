"use server";

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Query } from "node-appwrite";

const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
const col = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS;

async function getMyRooms() {
  const sessionCookie = (await cookies()).get("appwrite-session");

  if (!sessionCookie) {
    redirect("/login");
  }

  try {
    const { account, databases } = await createSessionClient(
      sessionCookie.value
    );
    const user = await account.get();
    const userId = user.$id;
    
    const { documents: rooms } = await databases.listDocuments(db, col, [
      Query.equal("user_id", userId),
    ]);

    return rooms;
  } catch (error) {
    console.log("Failed to get user rooms: ", error);
    redirect("/error");
  }
}

export default getMyRooms;
