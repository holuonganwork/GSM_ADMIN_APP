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
