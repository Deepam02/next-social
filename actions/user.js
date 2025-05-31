'use server'

import { db } from "@/lib/db"

export const createUser = async (user) => {
  const { id, first_name, last_name, email_address, image_url, username } =
    user;
  console.log("createUser function called with data:", user);
  
  try {
    console.log("Checking if user exists...");
    const userExists = await db.user.findUnique({
      where: {
        id,
      },
    });
    console.log("User exists check result:", userExists);

    if (userExists) {
      console.log("User already exists, updating instead...");
      return await updateUser(user);
    }

    console.log("Creating new user...");
    const newUser = await db.user.create({
      data: {
        id,
        first_name,
        last_name,
        email_address,
        image_url,
        username,
      },
    });
    console.log("New user created successfully:", newUser);
    return { success: true, data: newUser };
  } catch (e) {
    console.error("Error in createUser:", e);
    return {
      error: "Failed to save new user in db",
      details: e.message
    };
  }
};

export const updateUser = async (user) => {
  const { id, first_name, last_name, email_address, image_url, username } =
    user;
  try {
    const updatedUser = await db.user.update({
      where: {
        id,
      },
      data: {
        first_name,
        last_name,
        email_address,
        image_url,
        username,
      },
    });
    console.log("User updated successfully:", updatedUser);
    return { success: true, data: updatedUser };
  } catch (e) {
    console.error("Error in updateUser:", e);
    return {
      error: "Failed to update user in db",
      details: e.message
    };
  }
};

export const getUser = async (id) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email_address: true,
        image_url: true,
        username: true,
        banner_url: true,
        banner_id: true,
      },
    });
    return { success: true, data: user };
  } catch (e) {
    console.error("Error in getUser:", e);
    return {
      error: "Failed to get user from db",
      details: e.message
    };
  }
};

export const deleteUser = async (id) => {
  try {
    const deletedUser = await db.user.delete({
      where: {
        id,
      },
    });
    console.log("User deleted successfully:", deletedUser);
    return { success: true, data: deletedUser };
  } catch (e) {
    console.error("Error in deleteUser:", e);
    return {
      error: "Failed to delete user from db",
      details: e.message
    };
  }
};