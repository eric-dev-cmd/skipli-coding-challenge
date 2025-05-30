import { normalizePhoneNumber } from "../utils/phone";
import { findGithubUserProfileService } from "./github.service";
import { db } from "../config/firebase.config";

export const likeGithubUserService = async (
  inputPhoneNumber: string,
  githubUserId: number
) => {
  const phoneNumber = normalizePhoneNumber(inputPhoneNumber);
  const userRef = db.ref(`users/${phoneNumber}`);
  const snapshot = await userRef.once("value");

  if (!snapshot.exists()) {
    throw new Error("User does not exist. Please authenticate first.");
  }

  const likesRef = userRef.child("favorite_github_users");

  await likesRef.transaction(
    (currentLikes) => {
      const likes = currentLikes || [];
      if (!likes.includes(githubUserId)) {
        likes.push(githubUserId);
      }
      return likes;
    },
    (error, committed) => {
      if (error) throw new Error("Transaction failed");
      if (!committed) throw new Error("Like not committed");
    }
  );
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
