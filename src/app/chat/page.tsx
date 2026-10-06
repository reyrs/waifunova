import { createServerSupabase } from '@/lib/supabase-server'
import { Studio } from '@/components/studio/Studio'

export const metadata = { title: 'Ngobrol - Waifunova' }

export default async function ChatPage() {
  const supabase = await createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <Studio userId={user?.id ?? 'guest'} email={user?.email ?? ''} />
}

