import { createClient } from '@/app/lib/supabase/server'

interface CurrentUser {
  email: string
  userId: string | null
  isAdmin: boolean
  canVerify: boolean
  roleName: string
}

export async function getCurrentUser(
  supabase: Awaited<ReturnType<typeof createClient>>
): Promise<CurrentUser> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { email: 'Unknown', userId: null, isAdmin: false, canVerify: false, roleName: 'viewer' }
  }

  // user_roles.role_id -> roles table (managed by rhino-access)
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('roles(name, hierarchy_level)')
    .eq('user_id', user.id)
    .single()

  const role = roleData?.roles as unknown as { name: string; hierarchy_level: number } | null

  const roleName = role?.name ?? 'viewer'

  return {
    email: user.email || 'Unknown',
    userId: user.id,
    // admin, super_admin, and quality_assurance can see both counters
    isAdmin: (role?.hierarchy_level ?? 0) >= 80 || roleName === 'quality_assurance',
    canVerify: roleName === 'admin' || roleName === 'super_admin' || roleName === 'quality_assurance',
    roleName,
  }
}
