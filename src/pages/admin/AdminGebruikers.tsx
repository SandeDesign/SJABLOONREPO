import { useEffect, useState } from 'react'
import { Shield, User, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { getCollection, updateDocument } from '../../lib/firestore'
import { Card, CardContent } from '../../components/ui/Card'
import { AuthUser } from '../../contexts/AuthContext'

interface FirestoreUser extends AuthUser {
  id: string
  naam?: string
  actief?: boolean
}

const CmsGebruikers = () => {
  const [users, setUsers] = useState<FirestoreUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCollection<FirestoreUser>('users')
      .then(setUsers)
      .finally(() => setLoading(false))
  }, [])

  const updateRole = async (userId: string, role: 'klant' | 'admin') => {
    try {
      await updateDocument(`users/${userId}`, { role })
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)))
      toast.success('Rol bijgewerkt')
    } catch {
      toast.error('Rol bijwerken mislukt')
    }
  }

  const deactiveer = async (userId: string) => {
    try {
      await updateDocument(`users/${userId}`, { actief: false })
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, actief: false } : u)))
      toast.success('Gebruiker gedeactiveerd')
    } catch {
      toast.error('Deactiveren mislukt')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gebruikers</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Beheer gebruikers en rollen.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Laden...</div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Geen gebruikers gevonden.</div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user.id} className={user.actief === false ? 'opacity-50' : ''}>
              <CardContent className="pt-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  {user.role === 'admin' ? (
                    <Shield size={18} className="text-purple-600" />
                  ) : (
                    <User size={18} className="text-gray-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {user.naam || user.displayName || 'Onbekend'}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      updateRole(user.id, e.target.value as 'klant' | 'admin')
                    }
                    className="px-2 py-1 border border-gray-300 rounded text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="klant">Klant</option>
                    <option value="admin">Admin</option>
                  </select>
                  {user.actief !== false && (
                    <button
                      onClick={() => deactiveer(user.id)}
                      className="p-2 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500"
                      title="Deactiveren"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default CmsGebruikers
