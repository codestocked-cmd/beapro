import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const secret = req.headers.get('X-Webhook-Secret')

  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json() as {
    event: 'job.complete' | 'job.failed'
    job_id: string
    user_id: string
    result_id: string | null
    error: string | null
  }

  const supabase = await createServerClient()
  await supabase.channel(`user:${body.user_id}`).send({
    type: 'broadcast',
    event: body.event,
    payload: { job_id: body.job_id, result_id: body.result_id, error: body.error },
  })

  return NextResponse.json({ received: true })
}
