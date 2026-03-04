export interface AccountRepository {
  exists(
    accountNumber: string,
    branchCode: string,
    bankCode: string
  ): Promise<boolean>
}