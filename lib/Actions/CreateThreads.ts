'use server';

import Threads from '../Model/Thread';
import { connectionDb } from '../DataBase';
import { revalidatePath } from 'next/cache';
import Users from '../Model/User';
import { trendingWordByHashtag } from '../utils';
import { wordorPhrase, hashtag } from '../utils';
import { getTrendingTopics } from '../TrendingWords';

interface props {
  message: string;
  author: string;
  pictureMessage: string;
  communityId: string | null;
  path: string;
}
export const postThread = async ({ message, author, path }: props) => {
  try {
    await connectionDb();

    const thread = await Threads.create({ message, author });

    await Users.findOneAndUpdate(
      { _id: author },
      {
        $push: {
          threads: thread._id,
        },
      }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const fetchTreads = async (pageSize = 6, pageNumber = 1) => {
  try {
    await connectionDb();
    console.log('we go here ');
    const post = await Threads.find({ parentId: null || undefined })
      .sort({ createdAt: -1 })
      .skip(pageSize * (pageNumber - 1))
      .limit(pageSize)
      .populate({ path: 'author', model: 'User' })
      .populate({
        path: 'children',
        populate: {
          path: 'author',
          model: 'User',
          select: ' _id name parentId image',
        },
      });

    const documentCount = await Threads.find({
      parentId: null || undefined,
    }).countDocuments();

    const noOfPages = documentCount / pageSize;

    return JSON.stringify({ post, documentCount, noOfPages });
  } catch (error: any) {
    throw new Error(error);
  }
};

export const fetchThread = async (id: string) => {
  try {
    await connectionDb();
    const res = await Threads.findById(id)
      .populate({ path: 'author', model: 'User' })
      .populate({
        path: 'children',
        populate: {
          path: 'author',
          model: 'User',
          select: ' _id name parentId image',
        },
        model: 'Threads',
      });

    return JSON.stringify(res);
  } catch (error: any) {
    throw new Error(error);
  }
};

export async function getActivity(userId: string) {
  console.log({ userId });
  try {
    connectionDb();

    // Find all threads created by the user
    const userThreads = await Threads.find({ author: userId });

    // Collect all the child thread ids (replies) from the 'children' field of each user thread
    const childThreadIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    }, []);

    // Find and return the child threads (replies) excluding the ones created by the same user
    const replies = await Threads.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId }, // Exclude threads authored by the same user
    }).populate({
      path: 'author',
      model: 'User',
      select: 'name image _id',
    });

    return replies;
  } catch (error) {
    console.error('Error fetching replies: ', error);
    throw error;
  }
}

export const ThreadComment = async (
  message: string,
  author: string,
  parentId: string,
  pictureMessage: string,
  path: string
) => {
  try {
    await connectionDb();

    const thread = await Threads.create({
      message,
      author,
      parentId,
      $push: { pictureMessage: pictureMessage },
    });

    await Users.findByIdAndUpdate(author, { $push: { threads: thread._id } });

    await Threads.findByIdAndUpdate(parentId, {
      $push: { children: thread._id },
    });
    revalidatePath(path);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const LikeThreads = async (
  userid: string,
  threadid: string,
  path: string
) => {
  console.log({ threadid, userid });
  try {
    connectionDb();
    const res = await Threads.findOne({ _id: threadid });

    let { likes } = res;

    console.log({ LIKES: likes });

    const like = res.likes.find((items: any) => items === userid);
    let update = [];

    if (like) {
      update = likes.filter((items: any) => items !== userid);
    } else {
      update = [...likes, userid];
    }
    console.log({ update });
    const updatelikes = await Threads.findOneAndUpdate(
      { _id: threadid },
      { likes: update },
      { new: true }
    );
    revalidatePath(path);
    return JSON.stringify(updatelikes);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const fetchTopTreadQuery = async (value: string) => {
  console.log({ value });
  try {
    await connectionDb();
    const res = await Threads.find({}).sort({ likes: -1 }).populate('author');
    console.log({ res: res.length });
    const ress = res.filter(
      (items) =>
        items.author.name.toLowerCase() === value.toLowerCase() ||
        items.author.username.toLowerCase() === value.toLowerCase()
    );
    console.log({ ress: ress.length });
    return JSON.stringify(ress);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const fetchTrendingWords = async () => {
  try {
    await connectionDb();
    const res = await Threads.find({ parentId: null || undefined });
    const word = getTrendingTopics(res);
    const wordPhase = wordorPhrase(res);
    const hashword = hashtag(res);

    const sort = wordPhase
      .concat(hashword)
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    return JSON.stringify(hashword);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const getLatestThreads = async (values: string) => {
  console.log({ values });
  try {
    connectionDb();
    const res = await Threads.find({ message: { $regex: values } })
      .sort({ createdAt: -1 })
      .populate({ path: 'author', model: 'User' });

    return JSON.stringify(res);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const fetchRepies = async (userid: string) => {
  console.log({ userid });
  try {
    connectionDb();
    const res = await Threads.find({})
      .populate({ path: 'author', model: 'User' })
      .populate({
        path: 'children',
        model: 'Threads',
        populate: {
          path: 'author',
          model: 'User',
          select: '_id name parentId image',
        },
      });

    const ress = res.filter((items) => {
      const exist = items.children.find((item: any) => {
        return item.author._id.toString() === userid;
      });

      if (exist) {
        return true;
      }
    });
    console.log({ ress });
    return JSON.stringify(ress);
  } catch (error: any) {
    throw new Error(error);
  }
};

export const threadUserLike = async (value: string) => {
  try {
    connectionDb();
    const res = await Threads.find({ likes: { $in: value } })
      .populate({ path: 'author', model: 'User' })
      .populate({
        path: 'children',
        model: 'Threads',
        populate: {
          path: 'author',
          model: 'User',
          select: '_id name parentId image',
        },
      });
    return JSON.stringify(res);
  } catch (error: any) {
    throw new Error(error);
  }
};
