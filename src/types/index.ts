export type TransactionType = 'income' | 'expense'
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly'
export type TimeFilter = 'this_month' | 'this_year' | 'custom'

export interface Profile {
  id: string
  email: string
  currency: string
  created_at: string
}

export interface Category {
  id: string
  user_id: string | null
  name: string
  color: string
  is_default: boolean
  created_at: string
}

export interface Transaction {
  id: string
  user_id: string
  amount: number
  type: TransactionType
  category_id: string | null
  date: string
  note: string | null
  is_recurring: boolean
  recurrence_frequency: RecurrenceFrequency | null
  created_at: string
  // joined
  categories?: Pick<Category, 'id' | 'name' | 'color'> | null
}

export interface Budget {
  id: string
  user_id: string
  category_id: string
  monthly_limit: number
  month: number
  year: number
  alert_sent_80: boolean
  alert_sent_100: boolean
  created_at: string
  // joined
  categories?: Pick<Category, 'id' | 'name' | 'color'> | null
  // computed
  spent?: number
}

export interface SavingsGoal {
  id: string
  user_id: string
  name: string
  target_amount: number
  current_amount: number
  target_date: string | null
  created_at: string
}

export interface SavingsContribution {
  id: string
  goal_id: string
  user_id: string
  amount: number
  date: string
  note: string | null
  created_at: string
}

// Chart data shapes
export interface NetWorthPoint {
  month: string  // "YYYY-MM"
  netWorth: number
}

export interface SpendingDonutSlice {
  name: string
  color: string
  value: number
}

export interface IncomeExpenseBar {
  month: string  // "YYYY-MM"
  income: number
  expense: number
}

export interface BudgetWithSpend extends Budget {
  spent: number
  percentage: number
}

// Form inputs
export interface TransactionFormData {
  amount: string
  type: TransactionType
  category_id: string
  date: string
  note: string
  is_recurring: boolean
  recurrence_frequency: RecurrenceFrequency | ''
}

export interface BudgetFormData {
  category_id: string
  monthly_limit: string
  month: number
  year: number
}

export interface GoalFormData {
  name: string
  target_amount: string
  target_date: string
}

export interface DateRange {
  start: string  // ISO date "YYYY-MM-DD"
  end: string
}
