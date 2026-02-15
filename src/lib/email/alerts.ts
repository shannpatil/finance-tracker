import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.ALERT_FROM_EMAIL ?? 'onboarding@resend.dev'

export async function checkAndSendBudgetAlerts(
  userId: string,
  categoryId: string,
  month: number,
  year: number
): Promise<void> {
  const supabase = await createClient()

  // Fetch the budget for this category/month
  const { data: budget } = await supabase
    .from('budgets')
    .select('id, monthly_limit, alert_sent_80, alert_sent_100, categories(name)')
    .eq('user_id', userId)
    .eq('category_id', categoryId)
    .eq('month', month)
    .eq('year', year)
    .single()

  if (!budget) return

  // Sum spend for this category/month
  const startDate = `${year}-${String(month).padStart(2, '0')}-01`
  const endDate   = `${year}-${String(month).padStart(2, '0')}-31`

  const { data: txns } = await supabase
    .from('transactions')
    .select('amount')
    .eq('user_id', userId)
    .eq('category_id', categoryId)
    .eq('type', 'expense')
    .gte('date', startDate)
    .lte('date', endDate)

  const spent = txns?.reduce((sum, t) => sum + t.amount, 0) ?? 0
  const pct   = spent / budget.monthly_limit

  // Get user email
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) return

  const budgetWithCat = budget as unknown as { categories?: { name: string } | null }
  const categoryName = budgetWithCat.categories?.name ?? 'a category'

  if (pct >= 1 && !budget.alert_sent_100) {
    await resend.emails.send({
      from: FROM,
      to: user.email,
      subject: `Budget limit reached: ${categoryName}`,
      html: `
        <p>You have reached <strong>100%</strong> of your monthly budget for <strong>${categoryName}</strong>.</p>
        <p>Limit: ${budget.monthly_limit} | Spent: ${spent.toFixed(2)}</p>
      `,
    })
    await supabase
      .from('budgets')
      .update({ alert_sent_100: true })
      .eq('id', budget.id)
  } else if (pct >= 0.8 && !budget.alert_sent_80) {
    await resend.emails.send({
      from: FROM,
      to: user.email,
      subject: `Budget 80% warning: ${categoryName}`,
      html: `
        <p>You have used <strong>80%</strong> of your monthly budget for <strong>${categoryName}</strong>.</p>
        <p>Limit: ${budget.monthly_limit} | Spent: ${spent.toFixed(2)}</p>
      `,
    })
    await supabase
      .from('budgets')
      .update({ alert_sent_80: true })
      .eq('id', budget.id)
  }
}
