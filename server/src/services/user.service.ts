import { normalizePhoneNumber } from "../utils/phoneHelper";
import { findGithubUserProfileService } from "./github.service";
import { db } from "../config/firebase";
import { getUserRef } from "@/utils/firebaseHelper";
import { UnauthorizedError } from "@/errors/UnauthorizedError";

export const likeGithubUserService = async (
  inputPhoneNumber: string,
  githubUserId: number
) => {
  const userRef = getUserRef(inputPhoneNumber);
  const snapshot = await userRef.once("value");

  if (!snapshot.exists()) {
    throw new Error("User account not found. Please log in to continue.");
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
    (error, committed, snapshot) => {
      if (error) {
        console.error("Transaction error:", error);
        throw new Error("Transaction failed");
      }
      if (!committed) {
        console.warn("Transaction not committed");
        throw new Error("Like/unlike not committed");
      }
    }
  );

  return {
    success: true,
    action,
  };
};

export const getUserProfileService = async (inputPhoneNumber: string) => {
  const phoneNumber = normalizePhoneNumber(inputPhoneNumber);
  const ref = db.ref(`users/${phoneNumber}`);
  const snapshot = await ref.once("value");

  if (!snapshot.exists()) {
    throw new UnauthorizedError(
      "User account not found. Please log in to continue."
    );
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
