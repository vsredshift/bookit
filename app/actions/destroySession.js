"use server";

import { createSessionClient } from "@/config/appwrite";
import { cookies } from "next/headers";

async function destroySession() {
  const sessionCookie = (await cookies()).get("appwrite-session");

  if (!sessionCookie) {
    return {
      error: "No session cookie found",
    };
  }

  try {
    const { account } = await createSessionClient(sessionCookie.value);

    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");

    return {
      success: true,
    };
  } catch (error) {
    return {
      error: "Could not tear down session",
    };
  }
}

export default destroySession;
