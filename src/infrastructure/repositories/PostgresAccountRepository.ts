import { pool } from '../../database/connection'
import { AccountRepository } from '../../domain/repositories/AccountRepository'

export class PostgresAccountRepository implements AccountRepository {

  async exists(
    accountNumber: string,
    branchCode: string,
    bankCode: string
  ): Promise<boolean> {

    const result = await pool.query(
      `
      SELECT 1
      FROM accounts
      WHERE account_number = $1
      AND branch_code = $2
      AND bank_code = $3
      AND active = true
      LIMIT 1
      `,
      [accountNumber, branchCode, bankCode]
    )

    return (result.rowCount ?? 0) > 0
  }
}