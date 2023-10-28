import type { IncomingHttpHeaders } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { WebhookRequiredHeaders } from 'svix';
import type { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';
import { NextResponse } from 'next/server';

import {
  addMemberToCommunity,
  createCommunity,
  deleteCommunity,
  removeUserFromCommunity,
  updateCommunityInfo,
} from '@/lib/Actions/community';

const webhookSecret = process.env.NEXT_CLERK_WEBHOOK_SECRET;

export default async function handler(
  req: NextApiRequestWithSvixRequiredHeaders,
  res: NextApiResponse
) {
  const payload = JSON.stringify(req.body);
  const headers = req.headers;
  // Create a new Webhook instance with your webhook secret
  const wh = new Webhook(webhookSecret || '');

  let evt: WebhookEvent;
  try {
    // Verify the webhook payload and headers
    evt = wh.verify(payload, headers) as WebhookEvent;
  } catch (_) {
    // If the verification fails, return a 400 error
    return res.status(400).json({});
  }
  const { id } = evt.data;

  const eventType = evt.type;
  // Listen organization creation event
  if (eventType === 'organization.created') {
    // Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/CreateOrganization
    // Show what evnt?.data sends from above resource
    const { id, name, slug, logo_url, image_url, created_by } = evt?.data ?? {};

    try {
      // @ts-ignore
      await createCommunity(
        // @ts-ignore
        id,
        name,
        slug,
        logo_url || image_url,
        'org bio',
        created_by
      );

      return NextResponse.json({ message: 'User created' }, { status: 201 });
    } catch (err) {
      console.log(err);
      return NextResponse.json(
        { message: 'Internal Server Error' },
        { status: 500 }
      );
    }
  }
  if (eventType === 'user.created') {
    console.log(`User ${id} was ${eventType}`);
    res.status(201).json({});
  }
}

type NextApiRequestWithSvixRequiredHeaders = NextApiRequest & {
  headers: IncomingHttpHeaders & WebhookRequiredHeaders;
};
