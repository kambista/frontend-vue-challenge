<script setup lang="ts">
interface NavItem {
  label: string
  to: string
  badge?: string
  image: string
}

const navItems: NavItem[] = [
  { label: "Inicio",                    to: "/dashboard",            image: "item_1.png" },
  { label: "Historial de operaciones",  to: "/dashboard/operations", image: "item_2.png" },
  { label: "Cuentas bancarias",         to: "/dashboard/accounts",   image: "item_4.png" },
  { label: "Regala y gana",             to: "/dashboard/referral",   image: "item_5.png" },
  { label: "Kambista beneficios",       to: "/dashboard/benefits",   image: "item_6.png" },
  { label: "Alertas de tipo de cambio", to: "/dashboard/alerts",     image: "item_7.png" },
  { label: "Kambi Koinks",              to: "/dashboard/koinks",     image: "item_8.png", badge: "NUEVO" },
  { label: "Ayuda",                     to: "/dashboard/help",       image: "item_9.png" },
]

const route = useRoute()
const router = useRouter()
const operationStore = useOperationStore()
const userMenuOpen = ref(false)
const sidebarCollapsed = ref(false)

// Cargar datos del usuario desde localStorage
onMounted(() => {
  operationStore.loadUserData()
  document.addEventListener("click", closeUserMenu)
})

onUnmounted(() => {
  document.removeEventListener("click", closeUserMenu)
})

const currentTitle = computed(() => {
  const exact = navItems.find(i => i.to === route.path)
  if (exact) return exact.label
  const prefix = navItems
    .filter(i => i.to !== "/dashboard")
    .find(i => route.path.startsWith(i.to))
  return prefix?.label ?? "Inicio"
})

// Nombre del usuario truncado (máximo 8 caracteres)
const displayName = computed(() => {
  const name = operationStore.userName || 'Usuario'
  if (name.length > 8) {
    return name.substring(0, 8) + '...'
  }
  return name.toUpperCase()
})

// Email del usuario
const displayEmail = computed(() => {
  return operationStore.userEmail || 'usuario@email.com'
})

function closeUserMenu() {
  userMenuOpen.value = false
}

function handleLogout() {
  operationStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="flex min-h-screen bg-[#F0F2F5] relative overflow-hidden">
    <!-- Overlay for mobile sidebar -->
    <div 
      v-if="!sidebarCollapsed" 
      class="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
      @click="sidebarCollapsed = true"
    ></div>

    <!-- Sidebar wrapper — relative so the toggle button can straddle the border -->
    <div 
      :class="[
        'fixed md:relative flex-shrink-0 z-50 h-full transition-transform duration-300',
        sidebarCollapsed ? '-translate-x-full md:translate-x-0' : 'translate-x-0'
      ]"
    >
      <aside
        :class="[
          'bg-white border-r border-gray-100 flex flex-col h-screen',
          'transition-[width] duration-300 ease-in-out',
          sidebarCollapsed ? 'w-[72px]' : 'w-64',
        ]"
      >
        <!-- Logo -->
        <div
          :class="[
            'flex items-center h-16 border-b border-gray-100 shrink-0 overflow-hidden',
            sidebarCollapsed ? 'justify-center px-2' : 'px-5',
          ]"
        >
          <NuxtLink to="/dashboard" aria-label="Ir a inicio">
            <img
              src="/images/logo-kambista-sinfondo-variante.png"
              alt="Kambista"
              :class="['block transition-all duration-300', sidebarCollapsed ? 'h-6' : 'h-8 scale-150']"
            />
          </NuxtLink>
        </div>

        <!-- Nav items -->
        <nav class="flex-1 px-2 py-4 space-y-0.5" aria-label="Navegación principal">
          <div
            v-for="item in navItems"
            :key="item.to"
            class="relative group/item"
          >
            <NuxtLink
              :to="item.to"
              :class="[
                'flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200',
                sidebarCollapsed ? 'justify-center px-0 py-2.5' : 'px-3 py-2.5',
                route.path === item.to
                  ? 'bg-[#eff0f6] text-[#111760] font-semibold'
                  : 'text-gray-600 hover:bg-[#eff0f6] hover:text-[#111760]',
              ]"
            >
              <img
                :src="`/images/dashboard/${item.image}`"
                :alt="item.label"
                class="flex-shrink-0 w-7 h-7 object-contain"
              />
              <template v-if="!sidebarCollapsed">
                <span class="truncate">{{ item.label }}</span>
                <span
                  v-if="item.badge"
                  class="ml-auto text-[10px] font-bold bg-[#111760] text-white px-1.5 py-0.5 rounded flex-shrink-0"
                >{{ item.badge }}</span>
              </template>
            </NuxtLink>

            <!-- Tooltip — only visible when sidebar is collapsed -->
            <div
              v-if="sidebarCollapsed"
              class="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 z-50
                     opacity-0 -translate-x-2 hidden md:block
                     group-hover/item:opacity-100 group-hover/item:translate-x-0
                     transition-all duration-200 ease-out"
            >
              <div class="relative bg-[#111760] text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
                {{ item.label }}
                <span
                  v-if="item.badge"
                  class="ml-1.5 text-[9px] bg-white text-[#111760] px-1 py-0.5 rounded font-bold"
                >{{ item.badge }}</span>
                <!-- Arrow pointing left -->
                <span class="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-[#111760]" />
              </div>
            </div>
          </div>
        </nav>
      </aside>

      <!-- Toggle button — centered on the sidebar/content border, at the top of the nav -->
      <button
        :class="[
          'absolute right-0 top-5 translate-x-1/2 z-50 hidden md:flex',
          'w-6 h-6 rounded-full bg-white border border-gray-200 shadow-md',
          'items-center justify-center cursor-pointer',
          'text-gray-400 hover:text-[#111760] hover:border-[#111760] hover:shadow-lg',
          'transition-all duration-200 hover:scale-110',
        ]"
        type="button"
        :aria-label="sidebarCollapsed ? 'Expandir menú' : 'Contraer menú'"
        @click="sidebarCollapsed = !sidebarCollapsed"
      >
        <svg
          :class="['transition-transform duration-300 ease-in-out', sidebarCollapsed ? 'rotate-180' : '']"
          width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
    </div>

    <!-- Main area -->
    <div class="flex-1 flex flex-col overflow-[auto] md:overflow-hidden relative w-full">
      <header class="bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 py-3 gap-2 md:gap-4 relative z-20">
        <!-- Mobile hamburger -->
        <button 
          class="md:hidden flex items-center justify-center p-2 text-[#111760] hover:bg-gray-50 rounded-lg mr-2"
          @click="sidebarCollapsed = !sidebarCollapsed"
          aria-label="Toggle Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <h1 class="text-base md:text-lg font-bold text-[#111760] shrink-0 truncate max-w-[120px] sm:max-w-none">{{ currentTitle }}</h1>

        <div class="flex-1 justify-center items-center leading-relaxed hidden md:flex">
          <span class="text-left text-xs text-gray-500">
            Horario: Lunes a viernes 9:00 am a 7:00 pm<br />
            Sábados de 09:00 am a 2:00 pm
          </span>
        </div>

        <div class="flex items-center gap-4 shrink-0">
          <div class="text-sm text-gray-700 hidden sm:flex items-center gap-1">
            Tienes <strong class="ml-1">{{ operationStore.userKoinks.toLocaleString() }} Koinks</strong>
            <span class="ml-0.5"><img src="/images/dashboard/koinks.png" alt="Koinks" class="w-4 h-4" /></span>
          </div>

          <div class="relative">
            <button
              class="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#111760] transition-colors"
              type="button"
              @click.stop="userMenuOpen = !userMenuOpen"
            >
              <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <span class="hidden sm:inline">{{ displayName }}</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            <Transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div v-if="userMenuOpen" class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-50 overflow-hidden">
                <div class="px-4 py-3 border-b border-gray-100">
                  <p class="font-semibold text-sm text-gray-800">Mi cuenta</p>
                  <p class="text-xs text-gray-500 truncate" :title="displayEmail">{{ displayEmail }}</p>
                </div>
                <NuxtLink to="/dashboard/profile" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Perfil</NuxtLink>
                <NuxtLink to="/dashboard/settings" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Configuración</NuxtLink>
                <hr class="border-gray-100 my-1" />
                <button @click="handleLogout" class="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">Cerrar sesión</button>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
