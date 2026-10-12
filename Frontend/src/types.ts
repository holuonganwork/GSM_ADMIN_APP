/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GSM Compliance & Fraud Investigation System Types
 */

export type FraudType = 
  | 'all'
  | 'cuoc_ao'           // Gian lận cuốc ảo / Chạy khống cuốc
  | 'gps_spoofing'      // Giả lập tọa độ GPS (Mock Location)
  | 'gian_lan_voucher'  // Trục lợi mã giảm giá, khuyến mãi
  | 'thu_cuoc_sai'      // Tự ý nâng giá cước / Thu sai tiền
  | 'tat_dinh_vi'       // Cố tình ngắt kết nối T-Box Telematics
  | 'khac';             // Vi phạm quy chế tuân thủ khác

export type CaseSeverity = 'nghiem_trong' | 'trung_binh' | 'nhe';

export type CaseStatus = 
  | 'all'
  | 'da_nop_cho_duyet'      // Tài xế đã nộp biên bản giải trình, chờ kiểm soát viên duyệt
  | 'cho_tai_xe_giai_trinh' // Hệ thống đã gửi yêu cầu, đang chờ tài xế nộp biên bản
  | 'yeu_cau_bo_sung'       // Kiểm soát viên yêu cầu nộp thêm chứng cứ
  | 'da_tha_loi'            // Đã thẩm định và quyết định Tha lỗi / Minh oan
  | 'da_canh_cao'           // Đã nhắc nhở / cảnh cáo bằng văn bản
  | 'da_xu_phat';           // Đã ra quyết định xử phạt (tiền / khóa tài khoản)

export type DecisionType = 
  | 'tha_loi'           // Tha lỗi / Miễn trách nhiệm (Chấp nhận giải trình)
  | 'canh_cao'          // Cảnh cáo & Nhắc nhở quy chế lần đầu
  | 'yeu_cau_bo_sung'   // Yêu cầu tài xế gửi thêm tài liệu trong 24h
  | 'xu_phat_tien'      // Phạt tiền / Thu hồi tiền thưởng gian lận
  | 'tam_khoa'          // Tạm đình chỉ tài khoản có thời hạn (3 - 30 ngày)
  | 'khoa_vinh_vien';   // Khóa vĩnh viễn / Chấm dứt hợp đồng hợp tác

export interface DriverComplianceInfo {
  id: string;             // Mã tài xế (vd: TX-0921)
  name: string;           // Họ và tên tài xế
  cccd: string;           // Số Căn cước công dân (12 số) - KHÔNG CÓ THÔNG TIN ĐỘI XE
  phone: string;          // Số điện thoại đăng ký
  plate: string;          // Biển số xe VinFast
  vehicleModel: string;   // Model xe (VF e34, VF 8, VF 5, v.v.)
  avatarUrl?: string;     // Ảnh đại diện tài xế
  trustScore: number;     // Điểm tín nhiệm tuân thủ (0 - 100)
  priorViolationsCount: number; // Số lần từng bị lập biên bản
  completedRides: number; // Tổng số chuyến đã hoàn thành
  rating: number;         // Đánh giá sao trung bình (vd: 4.96)
}

export interface ExplanationAttachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document';
  sizeText?: string;
}

export interface DriverExplanation {
  explanationId: string;
  submittedAt: string;          // Thời điểm nộp giải trình từ app GSM Driver
  reasonCategory: string;       // Nhóm lý do: Lỗi mạng 4G, Khách yêu cầu hủy, Sự cố pin, v.v.
  content: string;              // Nguyên văn lời giải trình/tự bào chữa của tài xế
  attachments: ExplanationAttachment[]; // Bằng chứng ảnh, biên nhận xăng/sạc, tin nhắn khách
  status: 'cho_tai_xe_giai_trinh' | 'da_nop_cho_duyet' | 'yeu_cau_bo_sung';
}

export interface TelematicsLogItem {
  id: string;
  time: string;
  event: string;
  detail: string;
  severity: 'high' | 'medium' | 'info';
}

export interface SystemEvidence {
  tripId: string;
  tripCode: string;             // Mã cuốc xe (vd: GSM-TRIP-77291)
  detectedAt: string;           // Thời điểm AI phát hiện bất thường
  anomalyTitle: string;         // Tiêu đề dấu hiệu vi phạm
  anomalyDescription: string;   // Mô tả kỹ thuật hành vi gian lận
  fareAmount: number;           // Tiền cước chuyến đi (VNĐ)
  voucherAmount: number;        // Giá trị khuyến mãi/voucher áp dụng (VNĐ)
  bonusClaimed: number;         // Tiền thưởng chuyến tài xế dự kiến nhận (VNĐ)
  pickup: string;               // Điểm đón theo app
  dropoff: string;              // Điểm trả theo app
  gpsDistanceKm: number;        // Quãng đường báo cáo trên app (km)
  telematicsActualKm: number;   // Quãng đường thực tế đo qua hộp đen T-Box xe VinFast (km)
  maxSpeedKmh: number;          // Tốc độ cao nhất ghi nhận
  deviceImeiSameAsCustomer?: boolean; // Cảnh báo trùng thiết bị khách và tài xế
  telematicsLogs: TelematicsLogItem[];
}

export interface CaseDecision {
  decisionType: DecisionType;
  decidedAt: string;
  officerName: string;
  officerCode: string;
  fineAmount?: number;          // Số tiền phạt / truy thu (VNĐ)
  suspensionDays?: number;      // Số ngày tạm khóa (3, 7, 14, 30 ngày)
  reason: string;               // Căn cứ điều khoản xử lý quy chế GSM
  messageToDriver: string;      // Thông báo gửi về màn hình app GSM Driver của tài xế
}

export interface FraudCase {
  id: string;                   // Mã hồ sơ (vd: #GL-8842)
  fraudType: FraudType;
  fraudTypeLabel: string;
  severity: CaseSeverity;
  severityLabel: string;
  createdAt: string;
  timeAgo: string;
  deadlineHours: number;        // Thời hạn xử lý còn lại (giờ)
  driver: DriverComplianceInfo;
  evidence: SystemEvidence;
  explanation?: DriverExplanation;
  status: CaseStatus;
  statusLabel: string;
  decision?: CaseDecision;
}

export interface ComplianceMetrics {
  totalCases: number;           // Tổng số vụ nghi vấn gian lận ghi nhận
  pendingReview: number;        // Biên bản giải trình đang chờ thẩm định
  exoneratedCount: number;      // Số vụ đã tha lỗi / minh oan
  penalizedCount: number;       // Số vụ đã xử phạt / truy thu
  totalFinesRecovered: number;  // Tổng số tiền phạt và truy thu (VNĐ)
  avgReviewTimeHours: number;   // Thời gian thẩm định trung bình (giờ)
  slaCompliancePercent: number; // Tỷ lệ giải quyết đúng hạn cam kết (%)
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

export interface AppNotification {
  id: string | number;
  title: string;
  desc: string;
  time: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  read?: boolean;
  caseId?: string;
}

export const emptyComplianceMetrics: ComplianceMetrics = {
  totalCases: 0,
  pendingReview: 0,
  exoneratedCount: 0,
  penalizedCount: 0,
  totalFinesRecovered: 0,
  avgReviewTimeHours: 0,
  slaCompliancePercent: 0,
};

export const defaultOperatorProfile: OperatorProfile = {
  id: 'op-001',
  name: 'Nguyễn Mai Chi',
  code: 'GSM-INSPECT-88',
  role: 'Kiểm soát viên Tuân thủ & Gian lận GSM',
  shift: 'Ca sáng',
  shiftTime: '07:00 - 15:00',
  avatarUrl: '/avatar-chi.svg',
  status: 'online',
};

// Aliases for backwards compatibility during migration
export type Ticket = FraudCase;
export type ShiftMetrics = ComplianceMetrics;
export const emptyShiftMetrics = emptyComplianceMetrics;
