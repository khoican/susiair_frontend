export type Range = '1w' | '1m' | '3m' | '6m' | '1y'

export interface ApiEnvelope<T> {
  statusCode: number
  data: T
  message?: string | string[]
}

export interface ApiError {
  statusCode: number
  message: string | string[]
  error: string
}

export interface LoginPilot {
  id: string
  name: string
  username: string
}

export interface LoginResult {
  accessToken: string
  pilot: LoginPilot
}

export interface Pilot {
  name: string
  totalFlightHours: number
  avatarUrl: string
}

export interface LimitValue {
  current: number
  limit: number
}

export interface FlightHoursCards {
  daily: LimitValue
  weekly: LimitValue
  monthly: LimitValue
  annual: LimitValue
}

export interface ChartPoint {
  date: string
  sum: number
}

export interface FlightChart {
  range: Range
  limitLine: number
  yMax: number
  series: ChartPoint[]
}

export interface FlightHoursSummary {
  cards: FlightHoursCards
  chart: FlightChart
}

export type DocumentStatus = 'safe' | 'soon' | 'expired'

export interface DocumentItem {
  id: string
  label: string
  expiryDate: string
  daysRemaining: number
  status: DocumentStatus
  badgeColor: string
}

export interface DutyLegendItem {
  code: string
  label: string
  color: string
}

export interface ScheduleItem {
  id: string
  duty_date: string
  status: number
  base_name: string
  base_color: string
  duty_type: string
  count_schedules: number
  count_logbooks: number
  isCompleted: boolean
}

export interface SchedulesResponse {
  legend: DutyLegendItem[]
  schedules: ScheduleItem[]
}
