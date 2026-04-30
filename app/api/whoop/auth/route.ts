import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'

export async function GET() {
  const state = randomUUID()
  const params = new URLSearchParams({
    client_id: process.env.NEXT_PUBLIC_WHOOP_CLIENT_ID ?? '',
    redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/whoop/callback`,
    response_type: 'code',
    scope: 'offline read:recovery read:sleep read:workout read:profile',
    state,
  })

  const response = NextResponse.redirect(
    `https://api.prod.whoop.com/oauth/oauth2/auth?${params}`
  )

  response.cookies.set('whoop_oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 600,
  })

  return response
}
