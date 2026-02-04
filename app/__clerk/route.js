import { handleClerkRequest } from '@clerk/nextjs/server';

export async function GET(req) {
  return handleClerkRequest(req);
}

export async function POST(req) {
  return handleClerkRequest(req);
}
