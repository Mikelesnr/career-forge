import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { createHmac, timingSafeEqual } from 'node:crypto'

function verifyWebhook(
  body: string,
  secret: string,
  id: string,
  timestamp: string,
  signatures: string,
) {
  const timestampSeconds = Number(timestamp)
  if (!Number.isFinite(timestampSeconds) || Math.abs(Date.now() / 1000 - timestampSeconds) > 300) {
    throw new Error('Webhook timestamp is outside the allowed tolerance')
  }

  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ''), 'base64')
  const signedContent = `${id}.${timestamp}.${body}`
  const expected = createHmac('sha256', secretBytes).update(signedContent).digest()

  const valid = signatures.split(' ').some((signature) => {
    const [, encoded] = signature.split(',', 2)
    if (!encoded) return false
    const received = Buffer.from(encoded, 'base64')
    return received.length === expected.length && timingSafeEqual(received, expected)
  })

  if (!valid) throw new Error('Invalid webhook signature')
}

export async function POST(req: Request) {
  // You can find this in your Clerk Dashboard under Webhooks
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    return new Response('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env', {
      status: 500,
    })
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = (await headerPayload).get("svix-id");
  const svix_timestamp = (await headerPayload).get("svix-timestamp");
  const svix_signatures = (await headerPayload).get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signatures) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Read the raw body so the signature is verified against the exact payload.
  const body = await req.text()

  let evt: WebhookEvent

  try {
    verifyWebhook(body, WEBHOOK_SECRET, svix_id, svix_timestamp, svix_signatures)
    evt = JSON.parse(body) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Handle the event
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data;

    const email = email_addresses[0]?.email_address;

    if (email) {
      await prisma.user.upsert({
        where: { id },
        update: {
          email,
          firstName: first_name || null,
          lastName: last_name || null,
          imageUrl: image_url || null,
        },
        create: {
          id,
          email,
          firstName: first_name || null,
          lastName: last_name || null,
          imageUrl: image_url || null,
        },
      });
    }
  }

  return new Response('', { status: 200 })
}