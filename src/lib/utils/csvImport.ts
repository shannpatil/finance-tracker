import Papa from 'papaparse'
import type { TransactionType } from '@/types'

export interface ParsedRow {
  amount: number
  type: TransactionType
  categoryName: string
  date: string
  note: string
  is_recurring: false
  recurrence_frequency: null
}

export interface ImportResult {
  valid: ParsedRow[]
  errors: { row: number; message: string }[]
}

interface RawCSVRow {
  [key: string]: string
}

// Normalize common column name variations
function getField(row: RawCSVRow, candidates: string[]): string {
  for (const c of candidates) {
    if (row[c] !== undefined) return row[c]
    // case-insensitive
    const key = Object.keys(row).find(k => k.toLowerCase() === c.toLowerCase())
    if (key) return row[key]
  }
  return ''
}

export function parseCSV(file: File): Promise<ImportResult> {
  return new Promise(resolve => {
    Papa.parse<RawCSVRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        const valid: ParsedRow[] = []
        const errors: { row: number; message: string }[] = []

        data.forEach((row, i) => {
          const rowNum = i + 2 // 1-indexed + header row

          const rawAmount   = getField(row, ['amount', 'Amount', 'AMOUNT'])
          const rawType     = getField(row, ['type', 'Type', 'TYPE', 'transaction_type'])
          const rawDate     = getField(row, ['date', 'Date', 'DATE', 'transaction_date'])
          const rawCategory = getField(row, ['category', 'Category', 'CATEGORY'])
          const rawNote     = getField(row, ['note', 'Note', 'description', 'Description', 'memo', 'Memo'])

          if (!rawAmount && !rawType && !rawDate) {
            errors.push({ row: rowNum, message: 'Empty or unrecognized row' })
            return
          }

          if (!rawDate) {
            errors.push({ row: rowNum, message: 'Missing required field: date' })
            return
          }
          if (!rawAmount) {
            errors.push({ row: rowNum, message: 'Missing required field: amount' })
            return
          }
          if (!rawType) {
            errors.push({ row: rowNum, message: 'Missing required field: type (income/expense)' })
            return
          }

          const normalizedType = rawType.trim().toLowerCase()
          if (!['income', 'expense'].includes(normalizedType)) {
            errors.push({ row: rowNum, message: `Invalid type "${rawType}" — must be "income" or "expense"` })
            return
          }

          const amount = parseFloat(rawAmount.replace(/[^0-9.-]/g, ''))
          if (isNaN(amount) || amount <= 0) {
            errors.push({ row: rowNum, message: `Invalid amount "${rawAmount}"` })
            return
          }

          const parsedDate = Date.parse(rawDate)
          if (isNaN(parsedDate)) {
            errors.push({ row: rowNum, message: `Invalid date "${rawDate}"` })
            return
          }

          valid.push({
            amount: Math.round(amount * 100) / 100,
            type: normalizedType as TransactionType,
            categoryName: rawCategory?.trim() || 'Other',
            date: new Date(parsedDate).toISOString().slice(0, 10),
            note: rawNote?.trim() || '',
            is_recurring: false,
            recurrence_frequency: null,
          })
        })

        resolve({ valid, errors })
      },
      error: err => {
        resolve({ valid: [], errors: [{ row: 0, message: `Parse error: ${err.message}` }] })
      },
    })
  })
}
