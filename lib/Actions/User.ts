'use server';
import { throws } from 'assert';
import { connectionDb } from '../DataBase';
import Users from '../Model/User';
import Threads from '../Model/Thread';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import Community from '../Model/Community';

const { ObjectId } = mongoose.Types;

interface props {
  userid: String;
  name: String;
  username: String;
  bio: String;
  image: String;
  onboarded: Boolean;
  pathname: string;
}
export default async function ({
  userid,
  name,
  username,
  bio,
  image,
  onboarded,
  pathname,
}: props) {
  try {
    await connectionDb();

    const exist = await Users.findOne({ userid });

    if (!exist) {
      await Users.create({ userid, name, username, bio, image, onboarded });
    } else {
      await Users.findOneAndUpdate(
        { userid },
        { userid, name, username, bio, image, onboarded },
        { new: true }
      );
      revalidatePath(pathname);
      console.log('update completed');
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function updateUserData({
  userid,
  name,
  username,
  bio,
  image,
  banner,
}: any) {
  try {
    await connectionDb();

    const exist = await Users.findOne({ userid });
    console.log({ exist });
    if (!exist) {
      await Users.create({ userid, name, username, bio, image, banner });
    } else {
      await Users.findOneAndUpdate(
        { userid },
        { name, username, bio, image, banner },
        { new: true }
      );
      console.log('update completed');
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

export const fetchUser = async ({ userid }: { userid: any }) => {
  await connectionDb();
  const user = await Users.findOne({ userid })
    .populate({
      path: 'threads',
      model: 'Threads',
      populate: [
        {
          path: 'author',
          model: 'User',
          select: ' _id name parentId image',
        },
        {
          path: 'children',
          populate: {
            path: 'author',
            model: 'User',
            select: ' _id name parentId image',
          },
          model: 'Threads',
        },
      ],
    })
    .populate({
      path: 'communities',
      model: Community,
      populate: { path: 'threads', model: 'Threads' },
    });

  return JSON.stringify(user);
};

export const fetchUserBySearch = async ({ userid }: { userid: any }) => {
  await connectionDb();
  const user = await Users.findById(userid).populate({
    path: 'threads',
    model: 'Threads',
    populate: [
      {
        path: 'author',
        model: 'User',
        select: ' _id name parentId image',
      },
      {
        path: 'children',
        populate: {
          path: 'author',
          model: 'User',
          select: ' _id name parentId image',
        },
        model: 'Threads',
      },
    ],
  });

  return JSON.stringify(user);
};

export const fetchAllUsers = async () => {
  try {
    connectionDb();
    const res = await Users.find({});

    return JSON.stringify(res);
  } catch (error) {}
};

export const UserSearchQuery = async (
  value: string,
  pageSize = 6,
  pageNumber = 1
) => {
  try {
    connectionDb();
    const res = await Users.find({
      $or: [
        { name: { $regex: value, $options: 'i' } },
        { username: { $regex: value, $options: 'i' } },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize);

    const documentCount = await Users.find({
      $or: [
        { name: { $regex: value, $options: 'i' } },
        { username: { $regex: value, $options: 'i' } },
      ],
    }).countDocuments();

    const noOfPages = documentCount / pageSize;

    return JSON.stringify({ res, documentCount, noOfPages });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getValueUsers = async (value: string) => {
  console.log({ value });
  try {
    connectionDb();
    const res = await Users.find({
      $or: [
        { name: { $regex: value, $options: 'i' } },
        { username: { $regex: value, $options: 'i' } },
      ],
    });
    const threadRes = await Threads.find({}).populate({
      path: 'author',
      model: 'User',
    });
    console.log({ res });
    const res2 = threadRes.filter(
      (items, i) =>
        items?.author.username.toLowerCase().includes(value.toLowerCase()) ||
        items?.author.name?.toLowerCase().includes(value.toLowerCase()) ||
        items.message.toLowerCase().includes(value.toLowerCase())
    );
    console.log({ res2 });
    return JSON.stringify({ res, res2 });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const AddFriend = async ({ activeuser, seconduser, path }: any) => {
  try {
    connectionDb();
    console.log({ activeuser, seconduser, path });
    const res = await Users.findById(seconduser);
    const activerres = await Users.findById(activeuser);

    const exist = res.followers.includes(activeuser);

    if (!exist) {
      await Users.findByIdAndUpdate(seconduser, {
        $push: { followers: activerres._id },
      });
      await Users.findByIdAndUpdate(activeuser, {
        $push: { following: res._id },
      });
    } else {
      const secondfollow = res.followers.filter(
        (items: any) => items.toString() !== activeuser
      );
      const activefollow = activerres.following.filter(
        (items: any) => items.toString() !== seconduser
      );
      await Users.findByIdAndUpdate(seconduser, { followers: secondfollow });
      await Users.findByIdAndUpdate(activeuser, { following: activefollow });
    }
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getsuggestedUsers = async (userid: string) => {
  try {
    connectionDb();
    const res = await Users.findById(userid).populate({
      path: 'followers',
      model: 'User',
      populate: { path: 'followers', model: 'User' },
    });
    let followersArray: Array<any> = [];
    res.followers.forEach((items: any) => {
      console.log({ i: items.followers });
      followersArray = [...followersArray, ...items.followers];
    });
    const filterOutCommonUsers = followersArray.filter(
      (item) => {
        const exist = res.followers.find(
          (items: any) => items._id.toString() === item._id.toString()
        );

        if (!exist) {
          return item;
        }
      }
      // res.followers.includes(item._id)
    );

    return JSON.stringify(filterOutCommonUsers);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const allUsers = async () => {
  try {
    connectionDb();
    const res = await Users.find({}).populate({
      path: 'followers',
      model: 'User',
      populate: { path: 'followers', model: 'User' },
    });
    return JSON.stringify(res);
  } catch (error: any) {
    throw new Error(error);
  }
};
