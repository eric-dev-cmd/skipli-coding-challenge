import { normalizePhoneNumber } from "../utils/phoneHelper";
import { findGithubUserProfileService } from "./github.service";
import { db } from "../config/firebase";
import { getUserRef } from "@/utils/firebaseHelper";

export const likeGithubUserService = async (
  inputPhoneNumber: string,
  githubUserId: number
) => {
  const userRef = getUserRef(inputPhoneNumber);
  const snapshot = await userRef.once("value");

  if (!snapshot.exists()) {
    throw new Error("User does not exist. Please authenticate first.");
  }

  const likesRef = userRef.child("favorite_github_users");

  let action: "liked" | "unliked" = "liked";

  await likesRef.transaction(
    (currentLikes) => {
      let likes = currentLikes || [];
      if (likes.includes(githubUserId)) {
        // Unlike
        likes = likes.filter((id: number) => id !== githubUserId);
        action = "unliked";
      } else {
        // Like
        likes.push(githubUserId);
      }
      return likes;
    },
    (error, committed) => {
      if (error) throw new Error("Transaction failed");
      if (!committed) throw new Error("Like/unlike not committed");
    }
  );

  return { success: true, action };
};

export const getUserProfileService = async (inputPhoneNumber: string) => {
  const phoneNumber = normalizePhoneNumber(inputPhoneNumber);
  const ref = db.ref(`users/${phoneNumber}`);
  const snapshot = await ref.once("value");

  if (!snapshot.exists()) {
    throw new Error("User not found");
  }

  const data = snapshot.val();
  const favoriteIds = data.favorite_github_users || [];

  const favorites = await Promise.all(
    favoriteIds.map((id: number) => findGithubUserProfileService(id.toString()))
  );

  return {
    phone_number: phoneNumber,
    favorite_github_users: favorites,
  };
};
