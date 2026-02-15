'use client'

import { createContext, useContext, useReducer, type ReactNode } from 'react'
import { getDateRange } from '@/lib/utils/dates'
import type { TimeFilter, DateRange } from '@/types'

interface TimeFilterState {
  filter: TimeFilter
  customRange: DateRange | undefined
  dateRange: DateRange
}

type Action =
  | { type: 'SET_FILTER'; filter: TimeFilter }
  | { type: 'SET_CUSTOM_RANGE'; range: DateRange }

function reducer(state: TimeFilterState, action: Action): TimeFilterState {
  switch (action.type) {
    case 'SET_FILTER': {
      const dateRange = getDateRange(action.filter, state.customRange)
      return { ...state, filter: action.filter, dateRange }
    }
    case 'SET_CUSTOM_RANGE': {
      const dateRange = getDateRange('custom', action.range)
      return { ...state, filter: 'custom', customRange: action.range, dateRange }
    }
  }
}

interface TimeFilterContext extends TimeFilterState {
  setFilter: (filter: TimeFilter) => void
  setCustomRange: (range: DateRange) => void
}

const Context = createContext<TimeFilterContext | null>(null)

export function TimeFilterProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    filter: 'this_month',
    customRange: undefined,
    dateRange: getDateRange('this_month'),
  })

  const value: TimeFilterContext = {
    ...state,
    setFilter:      filter => dispatch({ type: 'SET_FILTER', filter }),
    setCustomRange: range  => dispatch({ type: 'SET_CUSTOM_RANGE', range }),
  }

  return <Context.Provider value={value}>{children}</Context.Provider>
}

export function useTimeFilter(): TimeFilterContext {
  const ctx = useContext(Context)
  if (!ctx) throw new Error('useTimeFilter must be used within TimeFilterProvider')
  return ctx
}
