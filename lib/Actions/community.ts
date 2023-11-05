'use server';

import { FilterQuery, SortOrder } from 'mongoose';

import Community from '../Model/Community';
import Threads from '../Model/Thread';
import Users from '../Model/User';
import { connectionDb } from '../DataBase';
import { revalidatePath } from 'next/cache';

export async function createCommunity({
  id,
  username,
  name,
  bio,
  image,
  createdBy,
}: any) {
  try {
    connectionDb();
    // Find the user with the provided unique id
    const user = await Users.findById(createdBy);

    if (!user) {
      throw new Error('User not found'); // Handle the case if the user with the id is not found
    }
    console.log({ username });

    const newCommunity = new Community({
      id,
      username,
      name,
      image,
      bio,
      createdBy, // Use the mongoose ID of the user
    });

    const createdCommunity = await newCommunity.save();
    await Community.findByIdAndUpdate(createdCommunity._id, {
      $push: { members: user._id },
    });
    // Update User model
    user.communities.push(createdCommunity._id);
    await user.save();

    return createdCommunity;
  } catch (error) {
    // Handle any errors
    console.error('Error creating community:', error);
    throw error;
  }
}

export async function fetchCommunityDetails(id: string) {
  try {
    connectionDb();

    const communityDetails = await Community.findById(id)
      .populate({
        path: 'createdBy',
        model: 'User',
      })
      .populate({
        path: 'threads',
        model: 'Threads',
        populate: {
          path: 'author',
          model: 'User',
        },
      });
    // .populate([
    //   'createdBy',
    //   {
    //     path: 'members',
    //     model: Users,
    //     select: 'name username image _id id',
    //   },
    //   {
    //     path: 'threads',
    //     model: Threads,
    //     populate: {
    //       path: 'author',
    //       model: 'User',
    //     },
    //   },
    // ]);

    return JSON.stringify(communityDetails);
  } catch (error) {
    // Handle any errors
    console.error('Error fetching community details:', error);
    throw error;
  }
}

export async function fetchAllCommunity() {
  try {
    connectionDb();

    const communityPosts = await Community.find({}).populate({
      path: 'members',
      model: 'User',
    });
    return JSON.stringify(communityPosts);
  } catch (error) {
    console.error('Error fetching community posts:', error);
    throw error;
  }
}

export async function fetchCommunityPosts(id: string) {
  try {
    connectionDb();

    const communityPosts = await Community.findById(id)
      .populate({
        path: 'threads',
        model: Threads,
        populate: [
          {
            path: 'author',
            model: 'User',
            select: 'name image id', // Select the "name" and "_id" fields from the "User" model
          },
          {
            path: 'children',
            model: Threads,
            populate: {
              path: 'author',
              model: 'User',
              select: 'image _id', // Select the "name" and "_id" fields from the "User" model
            },
          },
          {
            path: 'community',
            model: Community,
          },
        ],
      })
      .populate({ path: 'members', model: 'User' })
      .populate({ path: 'createdBy', model: 'User' });

    return JSON.stringify(communityPosts);
  } catch (error) {
    // Handle any errors
    console.error('Error fetching community posts:', error);
    throw error;
  }
}

export async function fetchCommunities({
  searchString = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc',
}: {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectionDb();

    // Calculate the number of communities to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, 'i');

    // Create an initial query object to filter communities.
    const query: FilterQuery<typeof Community> = {};

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== '') {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched communities based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    // Create a query to fetch the communities based on the search and sort criteria.
    const communitiesQuery = Community.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate('members');

    // Count the total number of communities that match the search criteria (without pagination).
    const totalCommunitiesCount = await Community.countDocuments(query);

    const communities = await communitiesQuery.exec();

    // Check if there are more communities beyond the current page.
    const isNext = totalCommunitiesCount > skipAmount + communities.length;

    return { communities, isNext };
  } catch (error) {
    console.error('Error fetching communities:', error);
    throw error;
  }
}

export async function addMemberToCommunity(
  communityId: string,
  memberId: string
) {
  try {
    connectionDb();

    // Find the community by its unique id
    const community = await Community.findById(communityId);

    if (!community) {
      throw new Error('Community not found');
    }
    // Find the user by their unique id
    const user = await Users.findById(memberId);

    if (!user) {
      throw new Error('User not found');
    }

    // Check if the user is already a member of the community
    const exist = community.members.includes(user._id);
    if (exist) {
      const RemoveMemberInCommunity = community.members.filter(
        (items: any) => items._id.toString() !== user._id.toString()
      );
      const RemoveCommunityInUser = user.communities.filter(
        (items: any) => items._id.toString() !== community._id.toString()
      );
      console.log({ RemoveCommunityInUser });
      await Community.findByIdAndUpdate(communityId, {
        members: RemoveMemberInCommunity,
      });
      await Users.findByIdAndUpdate(memberId, {
        communities: RemoveCommunityInUser,
      });
    } else {
      // Add the user's _id to the members array in the community
      community.members.push(user._id);
      await community.save();

      // Add the community's _id to the communities array in the user
      user.communities.push(community._id);
      await user.save();
    }

    revalidatePath('/communities');
    return JSON.stringify(community);
  } catch (error) {
    // Handle any errors
    console.error('Error adding member to community:', error);
    throw error;
  }
}

export async function removeUserFromCommunity(
  userId: string,
  communityId: string
) {
  try {
    connectionDb();

    const userIdObject = await Users.findOne({ id: userId }, { _id: 1 });
    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    if (!userIdObject) {
      throw new Error('User not found');
    }

    if (!communityIdObject) {
      throw new Error('Community not found');
    }

    // Remove the user's _id from the members array in the community
    await Community.updateOne(
      { _id: communityIdObject._id },
      { $pull: { members: userIdObject._id } }
    );

    // Remove the community's _id from the communities array in the user
    await Users.updateOne(
      { _id: userIdObject._id },
      { $pull: { communities: communityIdObject._id } }
    );

    return { success: true };
  } catch (error) {
    // Handle any errors
    console.error('Error removing user from community:', error);
    throw error;
  }
}

export async function updateCommunityInfo(
  communityId: string,
  name: string,
  username: string,
  image: string
) {
  try {
    connectionDb();

    // Find the community by its _id and update the information
    const updatedCommunity = await Community.findOneAndUpdate(
      { id: communityId },
      { name, username, image }
    );

    if (!updatedCommunity) {
      throw new Error('Community not found');
    }

    return updatedCommunity;
  } catch (error) {
    // Handle any errors
    console.error('Error updating community information:', error);
    throw error;
  }
}

export async function deleteCommunity(communityId: string) {
  try {
    connectionDb();

    // Find the community by its ID and delete it
    const deletedCommunity = await Community.findOneAndDelete({
      id: communityId,
    });

    if (!deletedCommunity) {
      throw new Error('Community not found');
    }

    // Delete all threads associated with the community
    await Threads.deleteMany({ community: communityId });

    // Find all users who are part of the community
    const communityUsers = await Users.find({ communities: communityId });

    // Remove the community from the 'communities' array for each user
    const updateUserPromises = communityUsers.map((user) => {
      user.communities.pull(communityId);
      return user.save();
    });

    await Promise.all(updateUserPromises);

    return deletedCommunity;
  } catch (error) {
    console.error('Error deleting community: ', error);
    throw error;
  }
}
