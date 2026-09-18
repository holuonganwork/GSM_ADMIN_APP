# GSM-ADMIN Backend API Specification (Đặc Tả Kỹ Thuật API)

Tài liệu này quy chuẩn toàn bộ các API endpoints mà giao diện quản trị điều hành Green SM (**GSM Operations Portal**) kết nối.
Các dịch vụ Backend (Node.js/Express, FastAPI, NestJS, Go, v.v.) cần tuân thủ cấu trúc dữ liệu và chuẩn phản hồi sau.

- **Base URL:** `/api` (hoặc cấu hình qua biến môi trường `VITE_API_URL`)
- **Định dạng dữ liệu:** `application/json`
- **Mã hóa:** `UTF-8`

---

## 1. Xác thực & Thông tin Điều phối viên (Operator Profile)

### `GET /api/operator/profile`
Lấy thông tin tài khoản điều phối viên đang đăng nhập và ca trực hiện tại.

**Response 200 OK:**
```json
{
  "id": "op-001",
  "name": "Nguyễn Mai Chi",
  "code": "GSM-889",
  "role": "Chuyên viên Điều phối GSM",
  "shift": "Ca sáng",
  "shiftTime": "07:00 - 15:00",
  "avatarUrl": "/avatar-chi.svg",
  "status": "online"
}
```

### `PATCH /api/operator/status`
Cập nhật trạng thái làm việc của điều phối viên (`online` | `break` | `busy`).

**Request Body:**
```json
{
  "status": "break"
}
```

---

## 2. Quản lý Sự cố & Điều phối (Tickets API)

### `GET /api/tickets`
Lấy danh sách ticket cần xử lý trong ca trực với các bộ lọc linh hoạt.

**Query Parameters:**
- `status` *(optional)*: `all` | `cho_tiep_nhan` | `dang_xu_ly` | `cho_tai_xe` | `cho_quan_ly` | `hoan_tat`
- `priority` *(optional)*: `all` | `P1` | `P2` | `P3` | `P4`
- `vehicle` *(optional)*: `all` | tên model xe (vd: `VF e34`, `VF 8`, `VF 5`)
- `search` *(optional)*: Chuỗi tìm kiếm theo mã ticket, biển số xe, tên tài xế, tiêu đề sự cố

**Response 200 OK:**
```json
[
  {
    "id": "TK-8842",
    "priority": "P1",
    "priorityLabel": "P1 Khẩn cấp",
    "title": "Xe báo lỗi cổng sạc DC tại trạm V-GREEN Times City - Mức pin còn 8%",
    "description": "Tài xế đang chở khách, súng sạc không khoá cáp và báo lỗi mã đỏ trên màn hình trung tâm.",
    "createdAt": "10:14 (03/05/2025)",
    "timeAgo": "4 phút trước",
    "slaDeadline": "10:25",
    "slaRemainingSeconds": 342,
    "driver": {
      "name": "Lê Hoàng Long",
      "phone": "0912.345.678",
      "initials": "LH",
      "rating": 4.96,
      "completedRides": 1420
    },
    "vehicle": {
      "model": "VinFast VF e34",
      "plate": "29E-521.84",
      "batterySoC": 8,
      "estimatedKm": 26,
      "status": "Đang đỗ (P)",
      "bmsCode": "DC_TIMEOUT_09",
      "location": "Hầm B2 Times City, 458 Minh Khai, Q. Hai Bà Trưng",
      "speed": 0
    },
    "chargingStation": {
      "name": "Trụ DC 60kW #04",
      "hub": "Hầm B2 Times City, Phân khu Park Hill",
      "status": "Cổng kẹt chốt khoá",
      "stationId": "VG-HN-0482",
      "chargerType": "DC Fast Charge 60kW - CCS2"
    },
    "status": "dang_xu_ly",
    "statusLabel": "Đang xử lý",
    "coordinator": "Nguyễn Mai Chi",
    "aiRecommendation": {
      "confidence": 96,
      "text": "Phát hiện Trụ sạc số 06 (DC 60kW) cách 15m đang trống...",
      "actionText": "Áp dụng giải pháp đề xuất này",
      "subActionText": "Xem xe sạc lưu động khả dụng"
    },
    "history": [
      {
        "id": "h1",
        "time": "10:14",
        "source": "Hệ thống GSM Telematics",
        "badge": "Tự động kích hoạt",
        "badgeType": "system",
        "text": "Cảnh báo xe SOC < 10% kết nối sạc không thành công tại Trụ 04."
      }
    ],
    "resolution": {
      "action": "Hướng dẫn đổi trụ sạc lân cận & cấp voucher",
      "rootCause": "Lỗi phần mềm trụ sạc (Firmware handshake timeout)",
      "internalNote": "Đã nhả súng sạc Trụ 04 thành công.",
      "driverMessage": "Kính gửi Bác tài Long, trụ số 06 đã sẵn sàng nạp năng lượng...",
      "autoVoucher": true,
      "reportVGreen": true,
      "authorityLevel": "Phê duyệt bởi Điều phối viên chính thức"
    }
  }
]
```

### `GET /api/tickets/:id`
Lấy chi tiết một ticket.

### `POST /api/tickets`
Tạo mới một ticket sự cố từ tổng đài hoặc lái xe.

**Request Body:**
```json
{
  "priority": "P1",
  "title": "Xe sự cố nguồn 12V",
  "description": "Không khởi động được sau khi dừng đèn đỏ",
  "driver": {
    "name": "Trần Văn A",
    "phone": "0987.654.321"
  },
  "vehicle": {
    "model": "VinFast VF 8",
    "plate": "30K-123.45",
    "batterySoC": 45,
    "location": "Ngã tư Nguyễn Trãi - Khuất Duy Tiến"
  }
}
```

### `PATCH /api/tickets/:id`
Cập nhật thông tin, trạng thái hoặc phương án xử lý ticket.

### `POST /api/tickets/:id/close`
Đóng ticket và hoàn tất ca xử lý.

**Request Body:**
```json
{
  "action": "Đã điều phối xe cứu hộ và bàn giao khách",
  "rootCause": "Sự cố pin 12V",
  "internalNote": "Xử lý thành công trong 12 phút"
}
```

---

## 3. Chỉ Số & Hiệu Suất Ca Trực (Shift Metrics & SLA)

### `GET /api/metrics/shift`
Lấy chỉ số thời gian thực phục vụ hiển thị 4 thẻ KPI hàng đầu và báo cáo SLA.

**Response 200 OK:**
```json
{
  "totalTickets": 45,
  "trendPercentage": 5.2,
  "closedTickets": 38,
  "inProgressTickets": 7,
  "emergencyTickets": 2,
  "emergencyP1Count": 1,
  "emergencySubText": ["1 sạc pin <10%", "1 va chạm"],
  "avgSlaMinutes": 2.6,
  "slaTargetMinutes": 3.5,
  "responseSpeedFasterPercent": 25,
  "fcrRatePercent": 93.5,
  "fcrTargetPercent": 90.0,
  "driverRating": 4.95,
  "shiftSlaPercent": 98.6,
  "shiftProcessed": 38,
  "shiftBacklog": 1
}
```

---

## 4. Kênh Trò Chuyện & Nhắn Tin Tài Xế (Driver Chat API)

### `GET /api/chat/conversations`
Lấy danh sách các cuộc hội thoại chat với tài xế.

**Response 200 OK:**
```json
[
  {
    "id": "c1",
    "driverName": "Lê Hoàng Long",
    "phone": "0912.345.678",
    "car": "VF e34 • 29E-521.84",
    "lastMessage": "Dạ súng đã kêu tách mở rồi chị ơi...",
    "time": "10:17",
    "unread": 1,
    "priority": "P1"
  }
]
```

### `GET /api/chat/conversations/:id/messages`
Lấy danh sách tin nhắn của một cuộc hội thoại.

### `POST /api/chat/conversations/:id/messages`
Gửi tin nhắn phản hồi tới tài xế.

**Request Body:**
```json
{
  "text": "Chào Bác tài, đội cứu hộ đang tới hỗ trợ nhé."
}
```

---

## 5. Bản Đồ Giám Sát Đội Xe & Điểm Sạc (Fleet Map API)

### `GET /api/fleet/points`
Lấy tọa độ thời gian thực của xe GSM và các trụ sạc V-GREEN.

**Query Parameters:**
- `filter`: `all` | `vehicles` | `chargers`

**Response 200 OK:**
```json
[
  {
    "id": "v-01",
    "type": "vehicle",
    "name": "VF e34 (29E-521.84)",
    "driver": "Lê Hoàng Long",
    "soc": 8,
    "status": "Lỗi sạc",
    "top": "48%",
    "left": "52%",
    "isAlert": true
  },
  {
    "id": "ch-01",
    "type": "charger",
    "name": "Trạm V-GREEN Times City",
    "slots": "12/16 trụ trống",
    "typeDesc": "DC 60-150kW Supercharge",
    "top": "50%",
    "left": "55%",
    "isAlert": false
  }
]
```

---

## 6. Danh Bạ Quản Lý Tài Xế (Driver Directory API)

### `GET /api/drivers`
Tìm kiếm và duyệt danh bạ tài xế.

**Query Parameters:**
- `search`: Từ khóa tìm kiếm theo tên, số điện thoại, biển số, đội xe.

**Response 200 OK:**
```json
[
  {
    "id": "TX-0921",
    "name": "Lê Hoàng Long",
    "phone": "0912.345.678",
    "vehicle": "VinFast VF e34 (29E-521.84)",
    "rating": 4.96,
    "rides": 1420,
    "team": "Đội 1 - Times City",
    "status": "Sự cố sạc pin (P1)",
    "statusColor": "bg-rose-100 text-rose-700"
  }
]
```

---

## 7. Thông Báo Toàn Ca (Notifications API)

### `GET /api/notifications`
Lấy danh sách cảnh báo thời gian thực gửi tới điều phối viên.

### `POST /api/notifications/:id/read`
Đánh dấu thông báo đã xem.

---

## 8. WebSocket Kênh Thời Gian Thực (Khuyến nghị)
- Kênh sự cố khẩn cấp: `ws://host/api/ws/incidents` (bắn ticket mới và cập nhật trạng thái)
- Kênh chat tài xế: `ws://host/api/ws/chat/:convId`
- Kênh viễn thông đội xe (Telematics): `ws://host/api/ws/telematics`
