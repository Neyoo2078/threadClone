'use server';
import { throws } from 'assert';
import { connectionDb } from '../DataBase';
import Users from '../Model/User';
import Threads from '../Model/Thread';

interface props {
  userid: String;
  name: String;
  username: String;
  bio: String;
  image: String;
  onboarded: Boolean;
}
export default async function ({
  userid,
  name,
  username,
  bio,
  image,
  onboarded,
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
  const user = await Users.findOne({ userid }).populate({
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
