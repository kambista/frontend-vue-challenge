import type { BankOption, FundSourceOption } from '~/types/operation'
import bankAccountsMock from '../../mocks/bankAccounts.json'
import sourceFundsMock from '../../mocks/sourceFunds.json'

/**
 * Provides static mock data for banks and fund sources.
 * Data is sourced from /mocks/bankAccounts.json and /mocks/sourceFunds.json.
 */
export function useMocks() {
  const bankOptions: BankOption[] = bankAccountsMock as BankOption[]
  const fundOptions: FundSourceOption[] = sourceFundsMock as FundSourceOption[]

  return {
    bankOptions,
    fundOptions,
  }
}
