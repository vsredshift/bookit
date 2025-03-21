"use server";

import { createAdminClient } from "@/config/appwrite";
import checkAuth from "./checkAuth";
import { ID } from "node-appwrite";
import { revalidatePath } from "next/cache";

const db = process.env.NEXT_PUBLIC_APPWRITE_DATABASE;
const col = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ROOMS;
const bucket = process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ROOMS;

async function createRoom(previousState, formData) {
  // Get databases instances
  const { databases, storage } = await createAdminClient();

  try {
    const { user } = await checkAuth();

    if (!user) {
      return {
        error: "You must be logged in to create a room.",
      };
    }

    // Upload image
    const image = formData.get("image");
    let imageID;

    if (image && image.size > 0 && image.name !== "undefined") {
      try {
        const response = await storage.createFile(bucket, ID.unique(), image);
        imageID = response.$id;
      } catch (error) {
        console.error("Error uploading image: ", error);
        return {
          error: "Error uploading image",
        };
      }
    } else {
      console.log("No image provided or file is not valid");
    }

    // Create Room
    const newRoom = await databases.createDocument(db, col, ID.unique(), {
      user_id: user.id,
      name: formData.get("name"),
      description: formData.get("description"),
      sqft: formData.get("sqft"),
      capacity: formData.get("capacity"),
      location: formData.get("location"),
      address: formData.get("address"),
      amenities: formData.get("amenities"),
      availability: formData.get("availability"),
      price_per_hour: formData.get("price_per_hour"),
      image: imageID,
    });

    revalidatePath("/", "layout");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Create room error: ", error);
    const errorMessage =
      error.response?.message || "An unexpected error occured";
    return {
      error: errorMessage,
    };
  }
}

export default createRoom;
