<script setup lang="ts">
import type { UserCuenta } from '~/composables/useKambistaApi'

useHead({
  title: 'Operación - Kambista',
})

definePageMeta({
  middleware: 'auth',
})

const auth = useAuthStore()

const rateFormatter = new Intl.NumberFormat('es-PE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function formatExchangeRate(value: number) {
  if (!Number.isFinite(value) || value <= 0)
    return '—'
  return rateFormatter.format(value)
}

function formatMoneyDisplay(raw: string) {
  const s = String(raw).trim().replace(/\s/g, '').replace(',', '.')
  const n = Number(s)
  if (!Number.isFinite(n))
    return '0.00'
  return n.toFixed(2)
}

const tx = useTransactionStore()

if (!tx.hasValidDraft) {
  await navigateTo('/home')
}

tx.setStep(1)

const { getBanks, getSourceFunds, getUserAccounts } = useKambistaApi()

const { data: banks, pending: banksPending, error: banksError } = await useAsyncData('transaction-banks', () =>
  getBanks(),
)

const { data: userAccounts, pending: userAccountsPending, error: userAccountsError, refresh: refreshUserAccounts } =
  await useAsyncData(
    'transaction-user-accounts',
    async () => {
      const id = auth.user?.id
      if (!id)
        return [] as UserCuenta[]
      return getUserAccounts(id)
    },
  )

const { data: sourceFunds, pending: fundsPending, error: fundsError } = await useAsyncData(
  'transaction-source-funds',
  () => getSourceFunds(),
)

const banksList = computed(() => banks.value ?? [])
const sourceFundsList = computed(() => sourceFunds.value ?? [])
const userAccountsList = computed(() => userAccounts.value ?? [])

const destinationMoneda = computed((): 'PEN' | 'USD' => (tx.mode === 'compra' ? 'PEN' : 'USD'))

const accountsModalOpen = ref(false)
const addAccountModalOpen = ref(false)

const listsPending = computed(() => banksPending.value || fundsPending.value)
const listsError = computed(() => banksError.value ?? fundsError.value)

const selectedDestinationAccount = computed(() => {
  const id = tx.destinationAccountId
  if (!id)
    return null
  return userAccountsList.value.find(c => String(c.id) === id) ?? null
})

const destinationFieldLabel = computed(() => {
  const a = selectedDestinationAccount.value
  if (!a)
    return 'Selecciona tu cuenta de destino'
  const num = String(a.numeroCuenta ?? '').replace(/\D/g, '')
  const tail = num.length > 4 ? ` · ${num.slice(-4)}` : ''
  return `${a.alias || 'Cuenta'}${tail}`
})

function openAccountsModal() {
  accountsModalOpen.value = true
  void refreshUserAccounts()
}

function onPickDestinationAccount(id: string) {
  tx.setDestinationAccountId(id)
  accountsModalOpen.value = false
}

function onAccountCreated(account: UserCuenta) {
  tx.setDestinationAccountId(String(account.id))
  void refreshUserAccounts()
  addAccountModalOpen.value = false
  accountsModalOpen.value = false
}

function openAddAccountFromPicker() {
  addAccountModalOpen.value = true
}

const step1FormComplete = computed(
  () => !!tx.originBankId && !!tx.destinationAccountId && !!tx.sourceFundId,
)

const step1Error = ref<string | null>(null)

const sendCurrencyPrefix = computed(() => (tx.mode === 'compra' ? '$' : 'S/'))
const receiveCurrencyPrefix = computed(() => (tx.mode === 'compra' ? 'S/' : '$'))

const rateBidDisplay = computed(() => formatExchangeRate(tx.rateBid))
const rateAskDisplay = computed(() => formatExchangeRate(tx.rateAsk))

async function onContinueStep1() {
  step1Error.value = null
  if (!tx.originBankId || !tx.destinationAccountId || !tx.sourceFundId) {
    step1Error.value = 'Selecciona todas las opciones para continuar.'
    return
  }
  tx.setStep(2)
  await navigateTo('/transaction/transfiere')
}

const selectWrapClass =
  'relative block w-full [&_select]:w-full [&_select]:appearance-none [&_select]:rounded-lg [&_select]:border [&_select]:border-[#dfe4ec] [&_select]:bg-white [&_select]:py-2.5 [&_select]:px-3 [&_select]:text-[14px] [&_select]:text-[#0a1325] [&_select]:outline-none [&_select]:transition [&_select]:focus:border-[#95e8df] [&_select]:focus:ring-2 [&_select]:focus:ring-[#95e8df]/40 [&_select]:disabled:cursor-not-allowed [&_select]:disabled:opacity-50'
</script>

<template>
  <TransactionFlowShell :current-step="1">
    <TransactionStepPanel>
      <h1 class="mb-6 text-center text-[18px] font-bold leading-snug text-[#0a1325] sm:text-[20px]">
        Completa los datos de tu operación
      </h1>

      <TransactionSummaryCard
        class="mb-6"
        :send-label="sendCurrencyPrefix"
        :receive-label="receiveCurrencyPrefix"
        :send-display="formatMoneyDisplay(tx.sendAmount)"
        :receive-display="formatMoneyDisplay(tx.receiveAmount)"
        :coupon-code="tx.couponCode"
        :rate-bid-display="rateBidDisplay"
        :rate-ask-display="rateAskDisplay"
      />

      <div class="space-y-3">
        <p v-if="listsError" class="text-center text-[13px] text-red-600">
          No se pudieron cargar bancos u origen de fondos. Intenta de nuevo más tarde.
        </p>

        <TransactionDismissibleAlert v-if="!listsError" variant="info">
          Tiempo estimado de espera
          <strong class="font-semibold">BCP, Interbank, BanBif y Pichincha</strong>: 15 minutos (Aplica para cualquier monto). Otros bancos 1 día útil.
        </TransactionDismissibleAlert>

        <div>
          <label for="tx-origin-bank" class="mb-1.5 block text-[13px] font-medium text-[#1a253f] sm:text-[14px]">
            ¿Desde qué banco nos envías tu dinero?
          </label>
          <div :class="selectWrapClass">
            <select
              id="tx-origin-bank"
              :value="tx.originBankId ?? ''"
              :disabled="listsPending || !!listsError"
              @change="tx.setOriginBankId(($event.target as HTMLSelectElement).value || null)"
            >
              <option value="" disabled>
                {{ listsPending ? 'Cargando…' : 'Selecciona' }}
              </option>
              <option
                v-for="b in banksList"
                :key="`origin-${b.id}`"
                :value="String(b.id)"
              >
                {{ b.name }}
              </option>
            </select>
          </div>
        </div>

        <div>
          <span class="mb-1.5 block text-[13px] font-medium text-[#1a253f] sm:text-[14px]">
            ¿En qué cuenta deseas recibir tu dinero?
          </span>
          <div class="relative">
            <button
              id="tx-dest-account"
              type="button"
              class="flex w-full items-center rounded-lg border border-[#dfe4ec] bg-white px-3 py-2.5 text-left text-[14px] text-[#0a1325] outline-none transition focus:border-[#95e8df] focus:ring-2 focus:ring-[#95e8df]/40 disabled:cursor-not-allowed disabled:opacity-50"
              :disabled="listsPending || !!listsError || !auth.user"
              @click="openAccountsModal"
            >
              <span class="min-w-0 truncate font-medium">{{ destinationFieldLabel }}</span>
            </button>
          </div>
        </div>

        <AccountsPickerModal
          :open="accountsModalOpen"
          :accounts="userAccountsList"
          :pending="userAccountsPending"
          :load-error="!!userAccountsError"
          :moneda="destinationMoneda"
          :selected-account-id="tx.destinationAccountId"
          @close="accountsModalOpen = false"
          @select="onPickDestinationAccount($event)"
          @add="openAddAccountFromPicker"
        />

        <AddAccountModal
          v-if="auth.user"
          :open="addAccountModalOpen"
          :user-id="auth.user.id"
          :banks="banksList"
          :default-moneda="destinationMoneda"
          @close="addAccountModalOpen = false"
          @created="onAccountCreated($event)"
        />

        <TransactionDismissibleAlert v-if="!listsError" variant="warning">
          Recuerda que las cuentas deben
          <strong class="font-semibold">estar a tu nombre</strong>. Kambista
          <strong class="font-semibold">no transfiere a cuentas de terceros</strong>.
        </TransactionDismissibleAlert>

        <div>
          <label for="tx-source-funds" class="mb-1.5 block text-[13px] font-medium text-[#1a253f] sm:text-[14px]">
            Origen de fondos
          </label>
          <div :class="selectWrapClass">
            <select
              id="tx-source-funds"
              :value="tx.sourceFundId ?? ''"
              :disabled="listsPending || !!listsError"
              @change="tx.setSourceFundId(($event.target as HTMLSelectElement).value || null)"
            >
              <option value="" disabled>
                {{ listsPending ? 'Cargando…' : 'Selecciona' }}
              </option>
              <option
                v-for="s in sourceFundsList"
                :key="`fund-${s.id}`"
                :value="String(s.id)"
              >
                {{ s.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <p v-if="step1Error" class="mt-6 text-center text-[13px] font-medium text-red-600">
        {{ step1Error }}
      </p>
    </TransactionStepPanel>

    <TransactionStepActions>
      <button
        type="button"
        class="w-full rounded-md bg-[#95e8df] py-3.5 text-center text-[14px] font-semibold uppercase tracking-wide text-[#07122c] transition hover:bg-[#82ddd2] disabled:cursor-not-allowed disabled:opacity-50 sm:text-[15px]"
        :disabled="listsPending || !!listsError || !step1FormComplete"
        @click="onContinueStep1"
      >
        Continuar
      </button>
    </TransactionStepActions>
  </TransactionFlowShell>
</template>
