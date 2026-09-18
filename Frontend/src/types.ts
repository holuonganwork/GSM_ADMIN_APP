/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TicketPriority = 'P1' | 'P2' | 'P3' | 'P4';

export type TicketStatus = 
  | 'all'
  | 'cho_tiep_nhan' 
  | 'dang_xu_ly' 
  | 'cho_tai_xe' 
  | 'cho_quan_ly' 
  | 'hoan_tat';

export interface DriverInfo {
  name: string;
  phone: string;
  initials: string;
  avatarUrl?: string;
  rating?: number;
  completedRides?: number;
}

export interface VehicleTelemetry {
  model: string;
  plate: string;
  batterySoC: number;
  estimatedKm: number;
  status: string; // e.g. "Đang đỗ (P)"
  bmsCode: string; // e.g. "DC_TIMEOUT_09"
  location: string;
  speed?: number;
}

export interface ChargingStationInfo {
  name: string;
  hub: string;
  status: string;
  stationId: string;
  chargerType: string;
}

export interface AIRecommendation {
  confidence: number;
  text: string;
  actionText: string;
  subActionText?: string;
}

export interface TimelineLog {
  id: string;
  time: string;
  source: string;
  badge: string;
  badgeType?: 'system' | 'call' | 'auto' | 'agent';
  text: string;
}

export interface ResolutionData {
  action: string;
  rootCause: string;
  internalNote: string;
  driverMessage: string;
  autoVoucher: boolean;
  reportVGreen: boolean;
  authorityLevel: string;
}

export interface Ticket {
  id: string;
  priority: TicketPriority;
  priorityLabel: string;
  title: string;
  description: string;
  createdAt: string;
  timeAgo: string;
  slaDeadline: string;
  slaRemainingSeconds: number; // positive = remaining, negative = overdue
  driver: DriverInfo;
  vehicle: VehicleTelemetry;
  chargingStation?: ChargingStationInfo;
  status: TicketStatus;
  statusLabel: string;
  coordinator: string;
  aiRecommendation: AIRecommendation;
  history: TimelineLog[];
  resolution: ResolutionData;
}

export interface ShiftMetrics {
  totalTickets: number;
  trendPercentage: number;
  closedTickets: number;
  inProgressTickets: number;
  emergencyTickets: number;
  emergencyP1Count: number;
  emergencySubText: string[];
  avgSlaMinutes: number;
  slaTargetMinutes: number;
  responseSpeedFasterPercent: number;
  fcrRatePercent: number;
  fcrTargetPercent: number;
  driverRating: number;
  shiftSlaPercent: number;
  shiftProcessed: number;
  shiftBacklog: number;
}

export interface ChatMessage {
  id: string | number;
  sender: 'driver' | 'operator' | 'system';
  text: string;
  time: string;
}

export interface DriverConversation {
  id: string | number;
  driverName: string;
  phone: string;
  car: string;
  lastMessage: string;
  time: string;
  unread: number;
  priority: TicketPriority;
}

export interface DriverDirectoryItem {
  id: string;
  name: string;
  phone: string;
  vehicle: string;
  rating: number;
  rides: number;
  team: string;
  status: string;
  statusColor?: string;
}

export interface FleetTelemetryPoint {
  id: string | number;
  type: 'vehicle' | 'charger' | 'truck';
  name: string;
  driver?: string;
  soc?: number;
  status: string;
  top: string;
  left: string;
  isAlert?: boolean;
  slots?: string;
  typeDesc?: string;
}

export interface AppNotification {
  id: string | number;
  title: string;
  desc: string;
  time: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  read?: boolean;
}

export interface OperatorProfile {
  id: string;
  name: string;
  code: string;
  role: string;
  shift: string;
  shiftTime: string;
  avatarUrl: string;
  status: 'online' | 'break' | 'busy';
}

export interface SLABreakdownItem {
  type: string;
  total: number;
  passed: number;
  failed: number;
  rate: number;
}

export const emptyShiftMetrics: ShiftMetrics = {
  totalTickets: 0,
  trendPercentage: 0,
  closedTickets: 0,
  inProgressTickets: 0,
  emergencyTickets: 0,
  emergencyP1Count: 0,
  emergencySubText: [],
  avgSlaMinutes: 0,
  slaTargetMinutes: 3.5,
  responseSpeedFasterPercent: 0,
  fcrRatePercent: 100,
  fcrTargetPercent: 90.0,
  driverRating: 5.0,
  shiftSlaPercent: 100,
  shiftProcessed: 0,
  shiftBacklog: 0,
};

export const defaultOperatorProfile: OperatorProfile = {
  id: 'op-001',
  name: 'Điều phối viên',
  code: 'GSM-OPS',
  role: 'Chuyên viên Điều phối GSM',
  shift: 'Ca hiện tại',
  shiftTime: '07:00 - 15:00',
  avatarUrl: '/avatar-chi.svg',
  status: 'online',
};
