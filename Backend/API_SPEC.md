# GSM-ADMIN Backend API Specification (Đặc Tả Kỹ Thuật API)
## Cổng Kiểm Soát Tuân Thủ & Thẩm Định Giải Trình Gian Lận GSM

Tài liệu này quy chuẩn toàn bộ các API endpoints, cấu trúc dữ liệu JSON, quy tắc nghiệp vụ và lược đồ cơ sở dữ liệu mà giao diện Cổng Kiểm Soát Tuân Thủ GSM (**GSM Operations Portal - Fraud & Compliance Desk**) kết nối và đồng bộ với hệ thống Backend.

- **Base URL:** `/api` (hoặc cấu hình tùy biến qua biến môi trường `VITE_API_URL`, mặc định proxy cổng `http://localhost:8000`)
- **Định dạng dữ liệu:** `application/json`
- **Bộ mã ký tự:** `UTF-8`

> [!IMPORTANT]
> **Quy định cốt lõi về định danh tài xế & Tuân thủ pháp lý:**
> - Theo yêu cầu nghiệp vụ kiểm soát tuân thủ của GSM, đối tượng tài xế **bắt buộc có Số Căn Cước Công Dân (CCCD 12 chữ số)** để tra cứu, định danh duy nhất và truy vết lịch sử xử lý vi phạm.
> - **Tuyệt đối không có trường "Đội xe" (Team / Fleet)** trong toàn bộ schema cơ sở dữ liệu, payload API và giao diện hiển thị.

---

## 1. Kiến Trúc Luồng Nghiệp Vụ (Business Workflow)

Hệ thống được thiết kế theo mô hình **HITL (Human-in-the-Loop)** phân tách nghiêm ngặt giữa hồ sơ chờ thẩm định và hồ sơ lưu trữ:

1. **Bàn Thẩm Định Chính (Pending Review Desk - `/cases`):**
   - Hàng đợi chỉ tiếp nhận các hồ sơ ở trạng thái `da_nop_cho_duyet` (Tài xế đã nộp biên bản giải trình qua app GSM Driver, đang chờ chuyên viên kiểm soát thẩm định).
   - *Quy tắc:* Loại bỏ hoàn toàn trạng thái "Chờ nộp" (`cho_tai_xe_giai_trinh`) khỏi hàng đợi thẩm định.
2. **Kho Lưu Trữ Lịch Sử Phán Quyết & Xử Lý (Case History Archive - `/case_history`):**
   - Lưu trữ toàn bộ các hồ sơ đã có kết luận hoặc đã log hành động xử lý:
     - `da_tha_loi`: Chấp thuận giải trình, minh oan cho tài xế, bảo lưu 100% điểm tín nhiệm.
     - `da_canh_cao`: Cảnh cáo và nhắc nhở bằng văn bản lần đầu.
     - `da_xu_phat`: Ra quyết định chế tài (phạt tiền trừ ví, tạm khóa app, hoặc khóa vĩnh viễn).
     - `yeu_cau_bo_sung`: Chuyên viên yêu cầu tài xế bổ sung thêm video/hình ảnh trong 24 giờ. Hồ sơ này được rút khỏi hàng đợi chờ duyệt và lưu trữ vào kho Lịch Sử để theo dõi tiến độ.
3. **Tìm Kiếm Linh Hoạt Liên Trang (Agile Cross-Tab Real-time Search):**
   - Thanh tìm kiếm tại Header hỗ trợ truy vấn đa năng theo thời gian thực trên mọi trang: Số CCCD 12 số, mã hồ sơ (`GL-8842`), biển số xe (`29E-521.84`), họ tên tài xế hoặc mã tài xế (`TX-0921`).

---

## 2. Chuẩn Dữ Liệu Chi Tiết (Data Models)

### 2.1. Loại Vi Phạm (`FraudType`)
| Giá trị mã (`fraudType`) | Nhãn tiếng Việt (`fraudTypeLabel`) | Mô tả hành vi |
| :--- | :--- | :--- |
| `cuoc_ao` | Gian lận cuốc ảo (Bonus Hunting) | Bấm nhận & hoàn thành chuyến khống để đạt mốc thưởng ngày |
| `gps_spoofing` | Giả lập vị trí GPS (Mock Location) | Dùng phần mềm can thiệp tọa độ vào nốt sân bay/khách sạn |
| `gian_lan_voucher` | Trục lợi mã giảm giá Voucher | Dùng nhiều tài khoản gia đình đặt cuốc ngắn hưởng trợ giá |
| `thu_cuoc_sai` | Thu cước sai / Thu ngoài app | Đòi thêm tiền mặt của khách hoặc tự nâng giá khi mưa bão |
| `tat_dinh_vi` | Cố tình ngắt T-Box Telematics | Rút giắc OBD/hộp đen để xe chạy cuốc dù ngoài hệ thống |
| `khac` | Vi phạm tuân thủ khác | Các hành vi vi phạm quy chế vận hành GSM khác |

### 2.2. Trạng Thái Hồ Sơ (`CaseStatus`)
| Giá trị mã (`status`) | Phân loại trang hiển thị | Ý nghĩa nghiệp vụ |
| :--- | :--- | :--- |
| `da_nop_cho_duyet` | **Hồ Sơ Chờ Thẩm Định** | Tài xế đã gửi bản giải trình, đang chờ chuyên viên xử lý |
| `yeu_cau_bo_sung` | **Lịch Sử Phán Quyết** | Đã log yêu cầu nộp thêm chứng cứ kỹ thuật trong 24h |
| `da_tha_loi` | **Lịch Sử Phán Quyết** | Đã thẩm định: Chấp thuận giải trình, minh oan |
| `da_canh_cao` | **Lịch Sử Phán Quyết** | Đã thẩm định: Nhắc nhở quy chế, không phạt tiền |
| `da_xu_phat` | **Lịch Sử Phán Quyết** | Đã thẩm định: Phạt tiền, tạm đình chỉ hoặc chấm dứt HĐ |

---

## 3. Danh Sách Chi Tiết API Endpoints

### 3.1. Chuyên Viên Thẩm Định (Operator Profile API)

#### `GET /api/operator/profile`
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

#### `PATCH /api/operator/status`
Cập nhật trạng thái trực ca của chuyên viên (`online` | `break` | `busy`).

**Request Body:**
```json
{
  "status": "break"
}
```

---

### 3.2. Quản Lý Hồ Sơ Gian Lận (Compliance Cases API)

#### `GET /api/compliance/cases`
Lấy danh sách các hồ sơ nghi vấn vi phạm với các bộ lọc nghiệp vụ.

**Query Parameters:**
- `status` *(string, optional)*: `da_nop_cho_duyet` | `yeu_cau_bo_sung` | `da_tha_loi` | `da_canh_cao` | `da_xu_phat` | `all`
- `fraudType` *(string, optional)*: Lọc theo mã loại gian lận (`cuoc_ao`, `gps_spoofing`, v.v.)
- `severity` *(string, optional)*: `nghiem_trong` | `trung_binh` | `nhe` | `all`
- `search` *(string, optional)*: Tìm kiếm theo mã hồ sơ, số CCCD, biển số xe, tên hoặc mã tài xế.

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
      "anomalyDescription": "Hệ thống Telematics ghi nhận xe luôn ở số P tại Times City trong suốt thời gian nhận và trả khách.",
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
        { "id": "l1", "time": "09:10", "event": "Khởi tạo cuốc xe", "detail": "Trùng IMEI với khách", "severity": "high" },
        { "id": "l2", "time": "09:12", "event": "Bắt đầu đón khách", "detail": "Hộp số giữ nguyên P", "severity": "medium" },
        { "id": "l3", "time": "09:28", "event": "Hoàn tất chuyến đi", "detail": "GPS không đổi tọa độ thực", "severity": "high" }
      ]
    },
    "explanation": {
      "explanationId": "EXP-4401",
      "submittedAt": "09:42 (18/09/2026)",
      "reasonCategory": "Sự cố thiết bị / Khách đi xe ngoài",
      "content": "Kính gửi Ban Kiểm soát Tuân thủ GSM, tôi xin giải trình cuốc xe này như sau: Khách hàng là người quen cần đi gấp nhưng xe tôi đang cắm súng sạc chưa rút kịp...",
      "attachments": [
        { "id": "att1", "name": "anh_dong_ho_sac_pin.jpg", "url": "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400", "type": "image", "sizeText": "1.4 MB" }
      ],
      "status": "da_nop_cho_duyet"
    },
    "status": "da_nop_cho_duyet",
    "statusLabel": "Đã nộp giải trình - Chờ duyệt"
  }
]
```

---

#### `GET /api/compliance/cases/:id`
Lấy chi tiết toàn bộ hồ sơ vi phạm theo mã ID.

---

#### `POST /api/compliance/cases/:id/decision`
Kiểm soát viên ban hành phán quyết thẩm định chính thức.

**Request Body:**
```json
{
  "decisionType": "xu_phat_tien",
  "fineAmount": 850000,
  "suspensionDays": 0,
  "reason": "Phát hiện cuốc ảo có chủ đích nhằm trục lợi tiền thưởng mốc ngày theo Điều 14 Quy chế Vận hành.",
  "messageToDriver": "Ban Kiểm soát thông báo: Bạn bị truy thu 350.000đ tiền thưởng gian lận và phạt 500.000đ trừ ví tài xế.",
  "officerName": "Nguyễn Mai Chi",
  "officerCode": "GSM-INSPECT-88"
}
```

**Bảng Chuyển Trạng Thái Sau Khi Ra Quyết Định (`Decision Mapping`):**
| `decisionType` gửi lên | Cập nhật `status` của hồ sơ | Cập nhật `statusLabel` | Vị trí sau cập nhật |
| :--- | :--- | :--- | :--- |
| `tha_loi` | `da_tha_loi` | Đã tha lỗi / Minh oan | Chuyển sang Lịch Sử |
| `canh_cao` | `da_canh_cao` | Đã nhắc nhở & cảnh cáo | Chuyển sang Lịch Sử |
| `yeu_cau_bo_sung` | `yeu_cau_bo_sung` | Yêu cầu bổ sung chứng cứ | Chuyển sang Lịch Sử |
| `xu_phat_tien` | `da_xu_phat` | Đã xử phạt vi phạm | Chuyển sang Lịch Sử |
| `tam_khoa` | `da_xu_phat` | Đã xử phạt vi phạm | Chuyển sang Lịch Sử |
| `khoa_vinh_vien` | `da_xu_phat` | Đã xử phạt vi phạm | Chuyển sang Lịch Sử |

**Response 200 OK:**
Trả về đối tượng `FraudCase` hoàn chỉnh với `status` mới và trường `decision` được ghi nhận.

---

#### `POST /api/compliance/cases/:id/request-evidence`
Gửi thông báo đẩy về ứng dụng `GSM-Driver` yêu cầu tài xế bổ sung biên bản hoặc hóa đơn minh chứng.

**Request Body:**
```json
{
  "note": "Yêu cầu cung cấp biên bản kiểm tra giắc cắm OBD tại Xưởng dịch vụ VinFast trong 24h."
}
```

---

### 3.3. Chỉ Số Thống Kê Tuân Thủ (Compliance Metrics API)

#### `GET /api/compliance/metrics`
Lấy các chỉ số KPI tuân thủ trong ca làm việc phục vụ Dashboard và báo cáo xuất ca.

**Response 200 OK:**
```json
{
  "totalCases": 28,
  "pendingReview": 4,
  "exoneratedCount": 11,
  "penalizedCount": 9,
  "warnedCount": 2,
  "supplementaryCount": 2,
  "totalFinesRecovered": 18500000,
  "avgReviewTimeHours": 3.4,
  "slaCompliancePercent": 96.4
}
```

---

### 3.4. Danh Bạ Tuân Thủ & Tra Cứu CCCD (Driver Compliance Directory)

#### `GET /api/compliance/drivers`
Tra cứu danh sách tài xế theo số CCCD (12 số), họ tên, số điện thoại hoặc biển số xe.

**Query Parameters:**
- `search` *(string, optional)*: Từ khóa tìm kiếm tự do (CCCD, tên, biển số xe)

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

#### `GET /api/compliance/drivers/:cccd`
Truy vấn toàn bộ hồ sơ tín nhiệm, chỉ số tuân thủ và danh sách các vụ việc trong lịch sử của tài xế theo Số CCCD.

---

### 3.5. Thông Báo Hệ Thống (Notifications API)

#### `GET /api/notifications`
Lấy danh sách các cảnh báo bất thường mới từ hệ thống AI/Telematics hoặc thông báo tài xế nộp giải trình.

**Response 200 OK:**
```json
[
  {
    "id": "notif-1",
    "title": "Hồ sơ giải trình mới",
    "desc": "Tài xế Lê Hoàng Long (29E-521.84) vừa nộp bản giải trình cho hồ sơ #GL-8842",
    "time": "5 phút trước",
    "type": "info",
    "read": false,
    "caseId": "GL-8842"
  }
]
```

#### `POST /api/notifications/:id/read`
Đánh dấu thông báo đã đọc.

---

## 4. Thiết Kế Lược Đồ Cơ Sở Dữ Liệu Đề Xuất (Database Schema)

Dưới đây là lược đồ cơ sở dữ liệu mẫu bằng SQL (tương thích SQLite, PostgreSQL, MySQL) để triển khai Backend nhanh chóng:

```sql
-- 1. Bảng Chuyên viên kiểm soát
CREATE TABLE operators (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    role VARCHAR(100) NOT NULL,
    shift VARCHAR(50) NOT NULL,
    shift_time VARCHAR(50) NOT NULL,
    avatar_url TEXT,
    status VARCHAR(20) DEFAULT 'online' CHECK (status IN ('online', 'break', 'busy'))
);

-- 2. Bảng Tài xế (Định danh bằng CCCD 12 số, KHÔNG CÓ CỘT ĐỘI XE)
CREATE TABLE drivers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    cccd VARCHAR(12) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    plate VARCHAR(20) NOT NULL,
    vehicle_model VARCHAR(50) NOT NULL,
    avatar_url TEXT,
    trust_score INTEGER DEFAULT 100 CHECK (trust_score BETWEEN 0 AND 100),
    prior_violations_count INTEGER DEFAULT 0,
    completed_rides INTEGER DEFAULT 0,
    rating REAL DEFAULT 5.0
);

CREATE INDEX idx_drivers_cccd ON drivers(cccd);
CREATE INDEX idx_drivers_plate ON drivers(plate);

-- 3. Bảng Hồ sơ nghi vấn gian lận
CREATE TABLE fraud_cases (
    id VARCHAR(50) PRIMARY KEY,
    fraud_type VARCHAR(50) NOT NULL,
    fraud_type_label VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('nghiem_trong', 'trung_binh', 'nhe')),
    severity_label VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deadline_hours INTEGER DEFAULT 24,
    status VARCHAR(30) NOT NULL CHECK (status IN ('da_nop_cho_duyet', 'yeu_cau_bo_sung', 'da_tha_loi', 'da_canh_cao', 'da_xu_phat')),
    status_label VARCHAR(100) NOT NULL,
    driver_id VARCHAR(50) REFERENCES drivers(id),
    
    -- Dữ liệu kỹ thuật cuốc xe & chứng cứ viễn thông (Telematics)
    trip_id VARCHAR(50),
    trip_code VARCHAR(100),
    detected_at TIMESTAMP,
    anomaly_title TEXT NOT NULL,
    anomaly_description TEXT,
    fare_amount INTEGER DEFAULT 0,
    voucher_amount INTEGER DEFAULT 0,
    bonus_claimed INTEGER DEFAULT 0,
    pickup_address TEXT,
    dropoff_address TEXT,
    gps_distance_km REAL,
    telematics_actual_km REAL,
    max_speed_kmh REAL,
    device_imei_same_as_customer BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_cases_status ON fraud_cases(status);
CREATE INDEX idx_cases_driver ON fraud_cases(driver_id);

-- 4. Bảng Bản giải trình tài xế (Khớp chính xác với Frontend DriverExplanation)
CREATE TABLE driver_explanations (
    id VARCHAR(50) PRIMARY KEY,          -- Map với explanationId trên FE
    case_id VARCHAR(50) UNIQUE REFERENCES fraud_cases(id) ON DELETE CASCADE,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reason_category VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    status VARCHAR(30) DEFAULT 'da_nop_cho_duyet'
);

-- 5. Bảng File đính kèm giải trình (Ảnh sạc xe, tin nhắn khách...)
CREATE TABLE explanation_attachments (
    id VARCHAR(50) PRIMARY KEY,
    explanation_id VARCHAR(50) REFERENCES driver_explanations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'image',
    size_text VARCHAR(50)
);

-- 6. Bảng Phán quyết của kiểm soát viên
CREATE TABLE case_decisions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    case_id VARCHAR(50) UNIQUE REFERENCES fraud_cases(id) ON DELETE CASCADE,
    decision_type VARCHAR(30) NOT NULL CHECK (decision_type IN ('tha_loi', 'canh_cao', 'yeu_cau_bo_sung', 'xu_phat_tien', 'tam_khoa', 'khoa_vinh_vien')),
    decided_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    officer_name VARCHAR(100) NOT NULL,
    officer_code VARCHAR(50) NOT NULL,
    fine_amount INTEGER DEFAULT 0,
    suspension_days INTEGER DEFAULT 0,
    reason TEXT NOT NULL,
    message_to_driver TEXT NOT NULL
);

-- 7. Bảng Nhật ký viễn thông T-Box Telematics
CREATE TABLE telematics_logs (
    id VARCHAR(50) PRIMARY KEY,
    case_id VARCHAR(50) REFERENCES fraud_cases(id) ON DELETE CASCADE,
    log_time VARCHAR(20) NOT NULL,
    event VARCHAR(100) NOT NULL,
    detail TEXT NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('high', 'medium', 'info'))
);

-- 8. Bảng Thông báo ca trực
CREATE TABLE notifications (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    desc TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type VARCHAR(20) CHECK (type IN ('danger', 'warning', 'info', 'success')),
    is_read BOOLEAN DEFAULT FALSE,
    case_id VARCHAR(50)
);
```

---

## 5. Định Dạng Chuẩn Lỗi HTTP (Error Handling Standard)

Mọi phản hồi lỗi từ API Backend phải trả về mã HTTP tương ứng kèm thân JSON có cấu trúc thống nhất:

```json
{
  "success": false,
  "message": "Không tìm thấy hồ sơ mang mã #GL-9999",
  "code": "CASE_NOT_FOUND",
  "timestamp": "2026-09-19T16:00:00Z"
}
```

| HTTP Status | Mã lỗi đề xuất | Trường hợp xảy ra |
| :--- | :--- | :--- |
| `400 Bad Request` | `INVALID_PAYLOAD` | Thiếu số tiền phạt khi chọn `xu_phat_tien` hoặc thiếu lý do |
| `404 Not Found` | `RESOURCE_NOT_FOUND` | Không tìm thấy mã hồ sơ hoặc số CCCD tài xế |
| `422 Unprocessable` | `INVALID_CCCD` | Số CCCD không đủ 12 chữ số hoặc dữ liệu không hợp lệ |
| `500 Internal Error`| `SERVER_ERROR` | Lỗi kết nối cơ sở dữ liệu hoặc xử lý nội bộ |
