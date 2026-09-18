# GSM-ADMIN Backend API Specification (Đặc Tả Kỹ Thuật API)
## Cổng Kiểm Soát Tuân Thủ & Thẩm Định Giải Trình Gian Lận GSM

Tài liệu này quy chuẩn toàn bộ các API endpoints mà giao diện Cổng Kiểm Soát Tuân Thủ GSM (**GSM Operations Portal - Fraud & Compliance Desk**) kết nối với hệ thống Backend.

- **Base URL:** `/api` (hoặc cấu hình qua biến môi trường `VITE_API_URL`)
- **Định dạng dữ liệu:** `application/json`
- **Mã hóa:** `UTF-8`

> [!IMPORTANT]
> **Quy định về thông tin định danh tài xế:**
> Theo yêu cầu nghiệp vụ tuân thủ pháp lý, đối tượng tài xế **bắt buộc có Số CCCD (12 chữ số)** để tra cứu và truy vết hồ sơ chế tài xuyên suốt.
> **Tuyệt đối không có trường "Đội xe"** trong toàn bộ payload và giao diện.

---

## 1. Thông Tin Chuyên Viên Thẩm Định (Operator Profile)

### `GET /api/operator/profile`
Lấy thông tin tài khoản chuyên viên kiểm soát đang trực ca.

**Response 200 OK:**
```json
{
  "id": "op-001",
  "name": "Nguyễn Mai Chi",
  "code": "GSM-INSPECT-88",
  "role": "Chuyên viên Ban Kiểm Soát Tuân Thủ",
  "shift": "Ca sáng",
  "shiftTime": "07:00 - 15:00",
  "avatarUrl": "/avatar-chi.svg",
  "status": "online"
}
```

### `PATCH /api/operator/status`
Cập nhật trạng thái làm việc của chuyên viên (`online` | `break` | `busy`).

**Request Body:**
```json
{
  "status": "break"
}
```

---

## 2. Quản Lý Hồ Sơ Gian Lận & Giải Trình (Compliance Cases API)

### `GET /api/compliance/cases`
Lấy danh sách các hồ sơ nghi vấn gian lận và biên bản giải trình với các bộ lọc nghiệp vụ.

**Query Parameters:**
- `status` *(optional)*: `all` | `cho_tai_xe_giai_trinh` | `da_nop_cho_duyet` | `yeu_cau_bo_sung` | `da_tha_loi` | `da_canh_cao` | `da_xu_phat`
- `fraudType` *(optional)*: `all` | `cuoc_ao` | `gps_spoofing` | `gian_lan_voucher` | `thu_cuoc_sai` | `tat_dinh_vi` | `khac`
- `severity` *(optional)*: `all` | `nghiem_trong` | `trung_binh` | `nhe`
- `search` *(optional)*: Tìm kiếm theo mã hồ sơ (`#GL-8842`), số CCCD (`001094012845`), biển số xe, tên tài xế

**Response 200 OK:**
```json
[
  {
    "id": "GL-8842",
    "fraudType": "cuoc_ao",
    "fraudTypeLabel": "Gian lận cuốc ảo (Bonus Hunting)",
    "severity": "nghiem_trong",
    "severityLabel": "Nghiêm trọng",
    "createdAt": "09:30 (Hôm nay)",
    "timeAgo": "25 phút trước",
    "deadlineHours": 4,
    "driver": {
      "id": "TX-0921",
      "name": "Lê Hoàng Long",
      "cccd": "001094012845",
      "phone": "0912.345.678",
      "plate": "29E-521.84",
      "vehicleModel": "VinFast VF e34",
      "trustScore": 48,
      "priorViolationsCount": 1,
      "completedRides": 1420,
      "rating": 4.88
    },
    "evidence": {
      "tripId": "TRIP-99014",
      "tripCode": "GSM-TRIP-HN-99014",
      "detectedAt": "09:28 (18/09/2026)",
      "anomalyTitle": "Quãng đường GPS app 14.5km nhưng hộp đen T-Box xe VinFast báo di chuyển 0.1km",
      "anomalyDescription": "Hệ thống Telematics ghi nhận trạng thái xe luôn ở chế độ Đỗ (P) tại bãi xe Time City trong suốt thời gian nhận và trả khách.",
      "fareAmount": 185000,
      "voucherAmount": 50000,
      "bonusClaimed": 350000,
      "pickup": "Khu đô thị Times City, Hai Bà Trưng, Hà Nội",
      "dropoff": "Số 1 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội",
      "gpsDistanceKm": 14.5,
      "telematicsActualKm": 0.12,
      "maxSpeedKmh": 0,
      "deviceImeiSameAsCustomer": true,
      "telematicsLogs": [
        { "id": "l1", "time": "09:10", "event": "Khởi tạo cuốc xe", "detail": "Trùng IMEI với khách", "severity": "high" }
      ]
    },
    "explanation": {
      "id": "EXP-0921-01",
      "submittedAt": "09:45 (Hôm nay)",
      "driverStatement": "Tôi nhận chuyến từ khách nhưng xe gặp trục trặc hệ thống điều hòa...",
      "attachments": [
        { "id": "att1", "name": "anh_chup_dong_ho_xe.jpg", "url": "/mock-evidence-1.jpg", "type": "image" }
      ],
      "acceptedFault": false
    },
    "status": "da_nop_cho_duyet",
    "statusLabel": "Đã nộp giải trình - Chờ thẩm định"
  }
]
```

---

### `GET /api/compliance/cases/:id`
Lấy chi tiết toàn bộ hồ sơ vi phạm, chứng cứ kỹ thuật Telematics và biên bản giải trình của tài xế.

---

### `POST /api/compliance/cases/:id/decision`
Kiểm soát viên ra phán quyết chính thức: **Tha lỗi / Minh oan**, **Cảnh cáo**, **Yêu cầu bổ sung**, **Phạt tiền / Truy thu**, **Tạm khóa app**, hoặc **Khóa vĩnh viễn**.

**Request Body:**
```json
{
  "decisionType": "xu_phat_tien",
  "fineAmount": 850000,
  "suspensionDays": 0,
  "reason": "Phát hiện cuốc ảo có chủ đích nhằm trục lợi thưởng ngày.",
  "messageToDriver": "Hệ thống GSM thông báo: Bạn bị truy thu 350.000đ tiền thưởng gian lận và phạt chế tài 500.000đ trừ ví tài xế.",
  "officerName": "Nguyễn Mai Chi",
  "officerCode": "GSM-INSPECT-88"
}
```

**Giá trị hợp lệ của `decisionType`:**
- `tha_loi`: Chấp nhận giải trình, minh oan cho tài xế, khôi phục điểm tín nhiệm.
- `canh_cao`: Gửi thư cảnh cáo vi phạm quy chế tuân thủ lần đầu.
- `yeu_cau_bo_sung`: Yêu cầu tài xế nộp thêm video/hình ảnh chứng cứ trong 24 giờ.
- `xu_phat_tien`: Thu hồi tiền thưởng gian lận và phạt vi phạm vào ví tài xế.
- `tam_khoa`: Tạm ngưng nhận cuốc từ 3 đến 30 ngày.
- `khoa_vinh_vien`: Chấm dứt hợp đồng hợp tác, đưa CCCD vào danh sách đen (Blacklist).

**Response 200 OK:**
Trả về đối tượng `FraudCase` đã cập nhật với `status = 'da_xu_phat'` hoặc `'da_tha_loi'`, và trường `decision` được ghi nhận.

---

### `POST /api/compliance/cases/:id/request-evidence`
Gửi thông báo đẩy về ứng dụng `GSM-Driver` yêu cầu tài xế bổ sung biên bản giải trình hoặc tài liệu minh chứng.

**Request Body:**
```json
{
  "note": "Vui lòng cung cấp hình ảnh lịch sử nạp tiền hoặc xác nhận của hành khách tại điểm trả."
}
```

---

## 3. Chỉ Số Thống Kê Tuân Thủ (Compliance Metrics API)

### `GET /api/compliance/metrics`
Lấy các chỉ số KPI tuân thủ trong ca làm việc.

**Response 200 OK:**
```json
{
  "totalCases": 28,
  "pendingReview": 6,
  "exoneratedCount": 11,
  "penalizedCount": 9,
  "totalFinesRecovered": 18500000,
  "avgReviewTimeHours": 3.4,
  "slaCompliancePercent": 96.4
}
```

---

## 4. Tra Cứu Tín Nhiệm Tài Xế Theo CCCD (Driver Compliance Directory)

### `GET /api/compliance/drivers`
Tìm kiếm danh bạ tài xế theo Số CCCD (12 số), tên hoặc biển số xe.

**Query Parameters:**
- `search` *(optional)*: Số CCCD hoặc tên tài xế

**Response 200 OK:**
```json
[
  {
    "id": "TX-0921",
    "name": "Lê Hoàng Long",
    "cccd": "001094012845",
    "phone": "0912.345.678",
    "plate": "29E-521.84",
    "vehicleModel": "VinFast VF e34",
    "trustScore": 48,
    "priorViolationsCount": 1,
    "completedRides": 1420,
    "rating": 4.88
  }
]
```

### `GET /api/compliance/drivers/:cccd`
Truy vấn toàn bộ lịch sử vi phạm, giải trình và điểm tín nhiệm của tài xế theo Số CCCD.

---

## 5. Cảnh Báo & Thông Báo Ca Trực (Notifications API)

### `GET /api/notifications`
Lấy danh sách các cảnh báo gian lận mới phát sinh và thông báo tài xế vừa gửi biên bản giải trình.

### `POST /api/notifications/:id/read`
Đánh dấu thông báo đã đọc.
