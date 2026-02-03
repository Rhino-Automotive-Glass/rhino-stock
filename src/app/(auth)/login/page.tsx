import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Bienvenido</h2>
        <p className="text-sm text-slate-600">
          Inicia sesión para acceder al sistema
        </p>
      </div>

      <LoginForm />
    </div>
  )
}
