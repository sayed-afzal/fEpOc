import { useNavigate } from 'react-router-dom'
import AuthCard from '../AuthCard'

export default function AuthPage() {
  const navigate = useNavigate()

  return <AuthCard onSignIn={() => navigate('/dashboard')} />
}
