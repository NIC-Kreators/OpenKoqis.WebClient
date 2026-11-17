import { ref, computed } from 'vue'

export type UserRole = 'dispatcher' | 'driver' | 'analyst' | 'admin'

export interface UserProfile {
  id: string
  username: string
  name: string
  email: string
  phone: string
  role: UserRole
  roleName: string
  authSource: 'internal' | 'keycloak'
}

const currentUser = ref<UserProfile | null>({
  id: 'usr-001',
  username: 'admin.city',
  name: 'Алихан Амангелдиулы',
  email: 'admin.city@astana.gov.kz',
  phone: '+7 701 450 12 34',
  role: 'dispatcher',
  roleName: 'Диспетчер ЦУП Астана',
  authSource: 'keycloak'
})

const isRootAdminConfigured = ref(true)

export function useAuth() {
  const isAuthenticated = computed(() => !!currentUser.value)

  const login = (role: UserRole = 'dispatcher') => {
    const roleProfiles: Record<UserRole, UserProfile> = {
      dispatcher: {
        id: 'usr-disp',
        username: 'dispatcher.astana',
        name: 'Андрей Агафонов',
        email: 'aigerim.k@openkoqis.kz',
        phone: '+7 701 555 11 22',
        role: 'dispatcher',
        roleName: 'Главный Диспетчер ЦУП',
        authSource: 'keycloak'
      },
      driver: {
        id: 'usr-driver',
        username: 'driver.kamaz01',
        name: 'Куандыков Бексултан',
        email: 'b.omarov@waste-astana.kz',
        phone: '+7 777 321 44 55',
        role: 'driver',
        roleName: 'Водитель мусоровоза 01-AST',
        authSource: 'internal'
      },
      analyst: {
        id: 'usr-analyst',
        username: 'analyst.ml',
        name: 'Куандыков Бексултан',
        email: 'd.akhmetov@openkoqis.kz',
        phone: '+7 702 987 65 43',
        role: 'analyst',
        roleName: 'Data Scientist / ML Аналитик',
        authSource: 'keycloak'
      },
      admin: {
        id: 'usr-root',
        username: 'root',
        name: 'Куандыков Бексултан',
        email: 'root@openkoqis.internal',
        phone: '+7 700 000 00 01',
        role: 'admin',
        roleName: 'Root Admin (Keycloak / Local)',
        authSource: 'internal'
      }
    }

    currentUser.value = roleProfiles[role]
  }

  const logout = () => {
    currentUser.value = null
  }

  const switchRole = (role: UserRole) => {
    login(role)
  }

  return {
    currentUser,
    isAuthenticated,
    isRootAdminConfigured,
    login,
    logout,
    switchRole
  }
}
