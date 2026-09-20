package com.greensm.compliance.service;

import com.greensm.compliance.domain.CaseDecision;
import com.greensm.compliance.domain.Driver;
import com.greensm.compliance.domain.DriverExplanation;
import com.greensm.compliance.domain.ExplanationAttachment;
import com.greensm.compliance.domain.FraudCase;
import com.greensm.compliance.domain.Operator;
import com.greensm.compliance.domain.SystemNotification;
import com.greensm.compliance.domain.TelematicsLog;
import com.greensm.compliance.domain.enums.CaseSeverity;
import com.greensm.compliance.domain.enums.CaseStatus;
import com.greensm.compliance.domain.enums.DecisionType;
import com.greensm.compliance.domain.enums.FraudType;
import com.greensm.compliance.domain.enums.OperatorStatus;
import com.greensm.compliance.repository.DriverRepository;
import com.greensm.compliance.repository.FraudCaseRepository;
import com.greensm.compliance.repository.NotificationRepository;
import com.greensm.compliance.repository.OperatorRepository;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializerService implements CommandLineRunner {

    private final OperatorRepository operatorRepository;
    private final DriverRepository driverRepository;
    private final FraudCaseRepository fraudCaseRepository;
    private final NotificationRepository notificationRepository;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Khởi tạo dữ liệu ban đầu cho hệ thống GSM Compliance Desk...");
        seedOperator();
        seedNotifications();
        seedDriversAndCases();
        log.info("Hoàn tất nạp dữ liệu mẫu thành công!");
    }

    private void seedOperator() {
        if (operatorRepository.existsById("op-001")) return;

        Operator op = Operator.builder()
            .id("op-001")
            .name("Nguyễn Mai Chi")
            .code("GSM-INSPECT-88")
            .role("Chuyên viên Ban Kiểm Soát Tuân Thủ")
            .shift("Ca sáng")
            .shiftTime("07:00 - 15:00")
            .avatarUrl("/avatar-chi.svg")
            .status(OperatorStatus.ONLINE)
            .build();
        operatorRepository.save(op);
    }

    private void seedNotifications() {
        if (notificationRepository.count() > 0) return;

        List<SystemNotification> notifs = List.of(
            SystemNotification.builder()
                .id("notif-1")
                .title("Hồ sơ giải trình mới")
                .desc("Tài xế Lê Hoàng Long (29E-521.84) vừa nộp bản giải trình cho hồ sơ #GL-8842")
                .time("5 phút trước")
                .type("info")
                .isRead(false)
                .caseId("GL-8842")
                .build(),
            SystemNotification.builder()
                .id("notif-2")
                .title("Cảnh báo ngắt T-Box Telematics")
                .desc("Xe 30K-032.55 vừa có dấu hiệu rút giắc nguồn thiết bị Telematics trong 5 giờ")
                .time("18 phút trước")
                .type("warning")
                .isRead(false)
                .caseId("GL-8846")
                .build(),
            SystemNotification.builder()
                .id("notif-3")
                .title("Xử phạt hoàn tất")
                .desc("Đã thu hồi 2.000.000đ tiền vi phạm từ tài xế Đặng Tuấn Kiệt (#GL-8835)")
                .time("1 giờ trước")
                .type("danger")
                .isRead(true)
                .caseId("GL-8835")
                .build()
        );
        notificationRepository.saveAll(notifs);
    }

    private void seedDriversAndCases() {
        if (fraudCaseRepository.count() > 0) return;

        // 1. Tài xế TX-0921: Lê Hoàng Long
        Driver d1 = Driver.builder()
            .id("TX-0921")
            .name("Lê Hoàng Long")
            .cccd("001094012845")
            .phone("0912.345.678")
            .plate("29E-521.84")
            .vehicleModel("VinFast VF e34")
            .trustScore(48)
            .priorViolationsCount(1)
            .completedRides(1420)
            .rating(4.88)
            .build();

        // 2. Tài xế TX-1482: Trần Văn Bình
        Driver d2 = Driver.builder()
            .id("TX-1482")
            .name("Trần Văn Bình")
            .cccd("024091004512")
            .phone("0988.765.432")
            .plate("30K-194.22")
            .vehicleModel("VinFast VF 8")
            .trustScore(35)
            .priorViolationsCount(2)
            .completedRides(2840)
            .rating(4.92)
            .build();

        // 3. Tài xế TX-0774: Nguyễn Quang Minh
        Driver d3 = Driver.builder()
            .id("TX-0774")
            .name("Nguyễn Quang Minh")
            .cccd("033095011984")
            .phone("0977.123.888")
            .plate("29E-882.19")
            .vehicleModel("VinFast VF 5 Plus")
            .trustScore(82)
            .priorViolationsCount(0)
            .completedRides(910)
            .rating(4.95)
            .build();

        // 4. Tài xế TX-3102: Phạm Thị Thu
        Driver d4 = Driver.builder()
            .id("TX-3102")
            .name("Phạm Thị Thu")
            .cccd("001198007621")
            .phone("0933.456.789")
            .plate("29AA-492.01")
            .vehicleModel("VinFast Feliz S")
            .trustScore(94)
            .priorViolationsCount(0)
            .completedRides(3100)
            .rating(4.98)
            .build();

        // 5. Tài xế TX-2019: Hoàng Quốc Việt
        Driver d5 = Driver.builder()
            .id("TX-2019")
            .name("Hoàng Quốc Việt")
            .cccd("017089002341")
            .phone("0904.567.890")
            .plate("30K-032.55")
            .vehicleModel("VinFast VF 8")
            .trustScore(40)
            .priorViolationsCount(1)
            .completedRides(1820)
            .rating(4.89)
            .build();

        // 6. Tài xế TX-5512: Vũ Đình Hải
        Driver d6 = Driver.builder()
            .id("TX-5512")
            .name("Vũ Đình Hải")
            .cccd("036093008819")
            .phone("0915.222.333")
            .plate("29E-301.99")
            .vehicleModel("VinFast VF e34")
            .trustScore(90)
            .priorViolationsCount(0)
            .completedRides(2100)
            .rating(4.96)
            .build();

        // 7. Tài xế TX-4402: Đặng Tuấn Kiệt
        Driver d7 = Driver.builder()
            .id("TX-4402")
            .name("Đặng Tuấn Kiệt")
            .cccd("001090001923")
            .phone("0981.999.888")
            .plate("30K-441.22")
            .vehicleModel("VinFast VF 8")
            .trustScore(20)
            .priorViolationsCount(3)
            .completedRides(890)
            .rating(4.75)
            .build();

        driverRepository.saveAll(List.of(d1, d2, d3, d4, d5, d6, d7));

        // --- CASE 1: GL-8842 ---
        FraudCase c1 = FraudCase.builder()
            .id("GL-8842")
            .fraudType(FraudType.CUOC_AO)
            .fraudTypeLabel("Gian lận cuốc ảo (Bonus Hunting)")
            .severity(CaseSeverity.NGHIEM_TRONG)
            .severityLabel("Nghiêm trọng")
            .createdAt("09:30 (Hôm nay)")
            .timeAgo("25 phút trước")
            .deadlineHours(4)
            .driver(d1)
            .tripId("TRIP-99014")
            .tripCode("GSM-TRIP-HN-99014")
            .detectedAt("09:28 (18/09/2026)")
            .anomalyTitle("Quãng đường GPS app 14.5km nhưng hộp đen T-Box xe VinFast báo di chuyển 0.1km")
            .anomalyDescription("Hệ thống Telematics ghi nhận trạng thái xe luôn ở chế độ Đỗ (P) tại bãi xe Time City trong suốt thời gian nhận và trả khách. App tài xế vẫn bấm bắt đầu chuyến và hoàn thành chuyến sau 18 phút để nhận thưởng mốc 15 cuốc/ngày.")
            .fareAmount(185000)
            .voucherAmount(50000)
            .bonusClaimed(350000)
            .pickup("Khu đô thị Times City, Hai Bà Trưng, Hà Nội")
            .dropoff("Số 1 Đinh Tiên Hoàng, Hoàn Kiếm, Hà Nội")
            .gpsDistanceKm(14.5)
            .telematicsActualKm(0.12)
            .maxSpeedKmh(0.0)
            .deviceImeiSameAsCustomer(true)
            .status(CaseStatus.DA_NOP_CHO_DUYET)
            .statusLabel("Đã nộp giải trình - Chờ duyệt")
            .telematicsLogs(new ArrayList<>())
            .build();

        TelematicsLog l1 = TelematicsLog.builder().id("l1").fraudCase(c1).time("09:10").event("Khởi tạo cuốc xe").detail("Tài xế bấm nhận cuốc từ tài khoản khách hàng (Trùng IMEI thiết bị)").severity("high").build();
        TelematicsLog l2 = TelematicsLog.builder().id("l2").fraudCase(c1).time("09:12").event("Bắt đầu đón khách").detail("Xe VinFast báo động cơ bật nhưng hộp số giữ nguyên P (Park)").severity("medium").build();
        TelematicsLog l3 = TelematicsLog.builder().id("l3").fraudCase(c1).time("09:28").event("Hoàn tất chuyến đi").detail("App báo kết thúc chuyến, GPS không có sự thay đổi tọa độ vệ tinh thực").severity("high").build();
        c1.getTelematicsLogs().addAll(List.of(l1, l2, l3));

        DriverExplanation exp1 = DriverExplanation.builder()
            .id("EXP-4401")
            .fraudCase(c1)
            .submittedAt("09:42 (18/09/2026)")
            .reasonCategory("Sự cố thiết bị / Khách đi xe ngoài")
            .content("Kính gửi Ban Kiểm soát Tuân thủ GSM, tôi xin giải trình cuốc xe này như sau: Khách hàng là người quen của tôi cần đi gấp lên bờ hồ nhưng xe tôi đang cắm súng sạc chưa rút kịp. Do khách vội nên tôi gọi xe khác cho khách đi hộ và thỏa thuận trừ tiền cuốc trên app của tôi. Tôi không cố ý trục lợi tiền thưởng của công ty, kính mong Ban kiểm soát xem xét tha lỗi và nhắc nhở lần đầu.")
            .status("da_nop_cho_duyet")
            .attachments(new ArrayList<>())
            .build();
        ExplanationAttachment att1 = ExplanationAttachment.builder().id("att1").explanation(exp1).name("anh_dong_ho_sac_pin.jpg").url("https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400").type("image").sizeText("1.4 MB").build();
        ExplanationAttachment att2 = ExplanationAttachment.builder().id("att2").explanation(exp1).name("tin_nhan_khach_hang.png").url("https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=400").type("image").sizeText("840 KB").build();
        exp1.getAttachments().addAll(List.of(att1, att2));
        c1.setExplanation(exp1);

        // --- CASE 2: GL-8843 ---
        FraudCase c2 = FraudCase.builder()
            .id("GL-8843")
            .fraudType(FraudType.GPS_SPOOFING)
            .fraudTypeLabel("Giả lập vị trí GPS (Mock Location)")
            .severity(CaseSeverity.NGHIEM_TRONG)
            .severityLabel("Nghiêm trọng")
            .createdAt("08:15 (Hôm nay)")
            .timeAgo("1 giờ trước")
            .deadlineHours(6)
            .driver(d2)
            .tripId("TRIP-98921")
            .tripCode("GSM-TRIP-HN-98921")
            .detectedAt("08:12 (18/09/2026)")
            .anomalyTitle("Tọa độ dịch chuyển 32km trong 3 giây vào bãi đón Ga T1 Sân bay Nội Bài")
            .anomalyDescription("Ghi nhận gói tin Mock Provider từ ứng dụng Fake GPS Location trên thiết bị Android của tài xế. T-Box viễn thông ô tô đang phát tọa độ tại quận Cầu Giấy nhưng vị trí app tài xế hiển thị tại vị trí chờ số 1 Nội Bài.")
            .fareAmount(320000)
            .voucherAmount(0)
            .bonusClaimed(0)
            .pickup("Nhà ga T1, Cảng HKQT Nội Bài")
            .dropoff("Khách sạn Daewoo, Ba Đình, Hà Nội")
            .gpsDistanceKm(32.4)
            .telematicsActualKm(4.1)
            .maxSpeedKmh(420.0)
            .deviceImeiSameAsCustomer(false)
            .status(CaseStatus.DA_NOP_CHO_DUYET)
            .statusLabel("Đã nộp giải trình - Chờ duyệt")
            .telematicsLogs(new ArrayList<>())
            .build();
        TelematicsLog l4 = TelematicsLog.builder().id("l4").fraudCase(c2).time("08:11").event("Phát hiện can thiệp hệ điều hành").detail("FLAG_MOCK_LOCATION bật trên thiết bị Xiaomi 12").severity("high").build();
        TelematicsLog l5 = TelematicsLog.builder().id("l5").fraudCase(c2).time("08:12").event("Tốc độ bất thường").detail("Tốc độ di chuyển tính toán: 420 km/h (Vượt giới hạn an toàn)").severity("high").build();
        c2.getTelematicsLogs().addAll(List.of(l4, l5));

        DriverExplanation exp2 = DriverExplanation.builder()
            .id("EXP-4402")
            .fraudCase(c2)
            .submittedAt("08:50 (18/09/2026)")
            .reasonCategory("Lỗi phần mềm điện thoại")
            .content("Dạ em chào Ban quản lý, em mang điện thoại đi sửa ở phố Thái Hà thì thợ có cài lại phần mềm gì đó em không rõ. Sáng nay mở máy lên thấy định vị nhảy loạn xạ chứ em không hề cố ý gian lận hay chen ngang hàng xe ở sân bay Nội Bài. Em cam kết gỡ bỏ ứng dụng ngay lập tức và xin được giảm nhẹ hình thức xử phạt.")
            .status("da_nop_cho_duyet")
            .attachments(new ArrayList<>())
            .build();
        ExplanationAttachment att3 = ExplanationAttachment.builder().id("att3").explanation(exp2).name("hoa_don_sua_dien_thoai.jpg").url("https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400").type("image").sizeText("2.1 MB").build();
        exp2.getAttachments().add(att3);
        c2.setExplanation(exp2);

        // --- CASE 3: GL-8844 ---
        FraudCase c3 = FraudCase.builder()
            .id("GL-8844")
            .fraudType(FraudType.GIAN_LAN_VOUCHER)
            .fraudTypeLabel("Trục lợi mã giảm giá Voucher")
            .severity(CaseSeverity.TRUNG_BINH)
            .severityLabel("Trung bình")
            .createdAt("07:45 (Hôm nay)")
            .timeAgo("2 giờ trước")
            .deadlineHours(8)
            .driver(d3)
            .tripId("TRIP-98412")
            .tripCode("GSM-TRIP-HN-98412")
            .detectedAt("07:40 (18/09/2026)")
            .anomalyTitle("Áp dụng mã giảm giá 100k cho cuốc xe 105k giữa 2 tài khoản có cùng tài khoản ngân hàng thụ hưởng")
            .anomalyDescription("Tài xế thực hiện 3 chuyến liên tiếp cự ly ngắn < 800m trong vòng 20 phút, mỗi chuyến áp dụng mã VGREEN100. Tài khoản thanh toán chuyến đi trùng khớp với số thẻ liên kết tài xế.")
            .fareAmount(105000)
            .voucherAmount(100000)
            .bonusClaimed(0)
            .pickup("Ngõ 102 Khuất Duy Tiến, Thanh Xuân")
            .dropoff("Số 180 Nguyễn Trãi, Thanh Xuân")
            .gpsDistanceKm(0.8)
            .telematicsActualKm(0.75)
            .maxSpeedKmh(35.0)
            .deviceImeiSameAsCustomer(false)
            .status(CaseStatus.DA_NOP_CHO_DUYET)
            .statusLabel("Đã nộp giải trình - Chờ duyệt")
            .telematicsLogs(new ArrayList<>())
            .build();
        TelematicsLog l6 = TelematicsLog.builder().id("l6").fraudCase(c3).time("07:35").event("Hoàn thành cuốc voucher ngắn").detail("Cước thực thu từ khách: 5.000đ, GSM trợ giá: 100.000đ").severity("medium").build();
        c3.getTelematicsLogs().add(l6);

        DriverExplanation exp3 = DriverExplanation.builder()
            .id("EXP-4403")
            .fraudCase(c3)
            .submittedAt("08:15 (18/09/2026)")
            .reasonCategory("Khách hàng nhờ đặt")
            .content("Dạ em chào anh chị Ban Tuân thủ. Sáng nay em đưa con đi học xong có người nhà đi cùng tuyến nên em bảo người nhà nhập mã giảm giá trên app để đi cho tiết kiệm. Em không biết quy định người thân trong gia đình không được đặt chuyến của nhau. Em xin nộp lại số tiền 300.000đ voucher trợ giá và xin Ban kiểm soát bỏ qua cho em vi phạm lần đầu.")
            .status("da_nop_cho_duyet")
            .attachments(new ArrayList<>())
            .build();
        c3.setExplanation(exp3);

        // --- CASE 4: GL-8845 ---
        FraudCase c4 = FraudCase.builder()
            .id("GL-8845")
            .fraudType(FraudType.THU_CUOC_SAI)
            .fraudTypeLabel("Thu cước sai / Thu tiền ngoài app")
            .severity(CaseSeverity.TRUNG_BINH)
            .severityLabel("Trung bình")
            .createdAt("07:10 (Hôm nay)")
            .timeAgo("2.5 giờ trước")
            .deadlineHours(12)
            .driver(d4)
            .tripId("TRIP-97812")
            .tripCode("GSM-BIKE-HN-97812")
            .detectedAt("07:05 (18/09/2026)")
            .anomalyTitle("Khách hàng khiếu nại tài xế đòi thêm 50.000đ tiền mặt ngoài cước hiển thị")
            .anomalyDescription("Khách hàng gửi hình ảnh hóa đơn chuyển khoản momo cho tài xế có số tiền 110.000đ trong khi cước cuốc xe hiển thị trên hệ thống là 60.000đ.")
            .fareAmount(60000)
            .voucherAmount(0)
            .bonusClaimed(0)
            .pickup("Ga Hà Nội, Lê Duẩn")
            .dropoff("Bệnh viện Bạch Mai, Giải Phóng")
            .gpsDistanceKm(3.2)
            .telematicsActualKm(3.4)
            .maxSpeedKmh(42.0)
            .status(CaseStatus.DA_NOP_CHO_DUYET)
            .statusLabel("Đã nộp giải trình - Chờ duyệt")
            .telematicsLogs(new ArrayList<>())
            .build();
        TelematicsLog l7 = TelematicsLog.builder().id("l7").fraudCase(c4).time("06:55").event("Tiếp nhận khiếu nại khách").detail("Khách phản ánh tài xế báo trời mưa to đòi thêm 50k").severity("medium").build();
        c4.getTelematicsLogs().add(l7);

        DriverExplanation exp4 = DriverExplanation.builder()
            .id("EXP-4404")
            .fraudCase(c4)
            .submittedAt("07:40 (18/09/2026)")
            .reasonCategory("Khách tip thêm / Mua đồ hộ")
            .content("Kính gửi Ban Kiểm soát, sáng nay trời mưa rất to, khách mang theo 2 vali to và cồng kềnh. Tôi đã hỗ trợ che ô bưng đồ lên sảnh viện giúp khách, sau đó khách chủ động chuyển khoản thêm 50.000đ tiền tip cảm ơn chứ tôi không hề ép buộc hay đòi thêm tiền của khách. Tôi có chụp lại ảnh màn hình tin nhắn cảm ơn của khách đính kèm.")
            .status("da_nop_cho_duyet")
            .attachments(new ArrayList<>())
            .build();
        ExplanationAttachment att4 = ExplanationAttachment.builder().id("att4").explanation(exp4).name("tin_nhan_khach_cam_on.jpg").url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400").type("image").sizeText("620 KB").build();
        exp4.getAttachments().add(att4);
        c4.setExplanation(exp4);

        // --- CASE 5: GL-8846 (History - Yêu cầu bổ sung) ---
        FraudCase c5 = FraudCase.builder()
            .id("GL-8846")
            .fraudType(FraudType.TAT_DINH_VI)
            .fraudTypeLabel("Cố tình ngắt T-Box Telematics")
            .severity(CaseSeverity.NGHIEM_TRONG)
            .severityLabel("Nghiêm trọng")
            .createdAt("Hôm qua")
            .timeAgo("18 giờ trước")
            .deadlineHours(2)
            .driver(d5)
            .tripId("TRIP-96501")
            .tripCode("GSM-TRIP-HN-96501")
            .detectedAt("22:15 (17/09/2026)")
            .anomalyTitle("Cổng OBD/T-Box xe VF 8 bị rút giắc tín hiệu trong 5 giờ liên tục")
            .anomalyDescription("Hộp đen ghi nhận tín hiệu ngắt kết nối cơ học. Khi cắm lại, dung lượng pin xe đã giảm từ 85% xuống 32% (hao hụt 53% SoC tương đương di chuyển hơn 200km ngoài hệ thống điều hành).")
            .fareAmount(0)
            .voucherAmount(0)
            .bonusClaimed(0)
            .pickup("Trạm sạc Vincom Long Biên")
            .dropoff("Không xác định")
            .gpsDistanceKm(0.0)
            .telematicsActualKm(210.0)
            .maxSpeedKmh(95.0)
            .status(CaseStatus.YEU_CAU_BO_SUNG)
            .statusLabel("Yêu cầu bổ sung chứng cứ")
            .telematicsLogs(new ArrayList<>())
            .build();
        TelematicsLog l8 = TelematicsLog.builder().id("l8").fraudCase(c5).time("17:00").event("Cảnh báo rút giắc T-Box").detail("Tín hiệu viễn thông mất kết nối đột ngột").severity("high").build();
        TelematicsLog l9 = TelematicsLog.builder().id("l9").fraudCase(c5).time("22:00").event("Cắm lại giắc viễn thông").detail("Pin xe hao hụt 53% SoC").severity("high").build();
        c5.getTelematicsLogs().addAll(List.of(l8, l9));

        DriverExplanation exp5 = DriverExplanation.builder()
            .id("EXP-4405")
            .fraudCase(c5)
            .submittedAt("23:00 (17/09/2026)")
            .reasonCategory("Sự cố thiết bị")
            .content("Xe tôi bị lỏng giắc cắm OBD do nhân viên rửa xe gạt phải, tôi không cố ý ngắt kết nối.")
            .status("yeu_cau_bo_sung")
            .attachments(new ArrayList<>())
            .build();
        c5.setExplanation(exp5);

        CaseDecision dec5 = CaseDecision.builder()
            .fraudCase(c5)
            .decisionType(DecisionType.YEU_CAU_BO_SUNG)
            .decidedAt("08:00 (18/09/2026)")
            .officerName("Nguyễn Mai Chi")
            .officerCode("GSM-INSPECT-88")
            .fineAmount(0)
            .suspensionDays(0)
            .reason("Yêu cầu tài xế mang xe đến Xưởng dịch vụ VinFast kiểm tra giắc cắm T-Box và bổ sung biên bản kỹ thuật trong vòng 24h.")
            .messageToDriver("Ban Kiểm soát yêu cầu bạn mang xe đến Xưởng dịch vụ VinFast gần nhất để kiểm tra giắc T-Box và chụp ảnh biên bản xác nhận gửi lên app trong 24 giờ tới.")
            .build();
        c5.setDecision(dec5);

        // --- CASE 6: GL-8840 (History - Đã tha lỗi) ---
        FraudCase c6 = FraudCase.builder()
            .id("GL-8840")
            .fraudType(FraudType.CUOC_AO)
            .fraudTypeLabel("Gian lận cuốc ảo")
            .severity(CaseSeverity.NHE)
            .severityLabel("Nhẹ")
            .createdAt("Hôm qua")
            .timeAgo("1 ngày trước")
            .deadlineHours(0)
            .driver(d6)
            .tripId("TRIP-94002")
            .tripCode("GSM-TRIP-HN-94002")
            .detectedAt("15:20 (17/09/2026)")
            .anomalyTitle("Khách hủy chuyến sau khi tài xế bấm bắt đầu cuốc 10 giây")
            .anomalyDescription("Thời gian cuốc xe chỉ 10 giây nhưng phát sinh cước hủy 15.000đ.")
            .fareAmount(15000)
            .voucherAmount(0)
            .bonusClaimed(0)
            .pickup("Bến xe Mỹ Đình")
            .dropoff("Bến xe Mỹ Đình")
            .gpsDistanceKm(0.05)
            .telematicsActualKm(0.05)
            .maxSpeedKmh(10.0)
            .status(CaseStatus.DA_THA_LOI)
            .statusLabel("Đã tha lỗi / Minh oan")
            .telematicsLogs(new ArrayList<>())
            .build();

        DriverExplanation exp6 = DriverExplanation.builder()
            .id("EXP-4380")
            .fraudCase(c6)
            .submittedAt("16:00 (17/09/2026)")
            .reasonCategory("Khách bấm nhầm địa chỉ")
            .content("Khách lên xe bảo nhầm điểm đến nên hủy ngay và tôi đã hoàn tiền mặt lại cho khách.")
            .status("da_nop_cho_duyet")
            .attachments(new ArrayList<>())
            .build();
        c6.setExplanation(exp6);

        CaseDecision dec6 = CaseDecision.builder()
            .fraudCase(c6)
            .decisionType(DecisionType.THA_LOI)
            .decidedAt("17:30 (17/09/2026)")
            .officerName("Nguyễn Mai Chi")
            .officerCode("GSM-INSPECT-88")
            .fineAmount(0)
            .suspensionDays(0)
            .reason("Biên bản giải trình hợp lý. Khách hàng xác nhận hủy nhầm, tài xế không có hành vi gian lận trục lợi.")
            .messageToDriver("Ban Kiểm soát GSM đã phê duyệt biên bản giải trình của bạn. Điểm tín nhiệm tuân thủ được bảo lưu 100%. Bạn có thể tiếp tục nhận chuyến bình thường.")
            .build();
        c6.setDecision(dec6);

        // --- CASE 7: GL-8835 (History - Đã xử phạt) ---
        FraudCase c7 = FraudCase.builder()
            .id("GL-8835")
            .fraudType(FraudType.GPS_SPOOFING)
            .fraudTypeLabel("Giả lập vị trí GPS")
            .severity(CaseSeverity.NGHIEM_TRONG)
            .severityLabel("Nghiêm trọng")
            .createdAt("16/09/2026")
            .timeAgo("2 ngày trước")
            .deadlineHours(0)
            .driver(d7)
            .tripId("TRIP-93110")
            .tripCode("GSM-TRIP-HN-93110")
            .detectedAt("14:00 (16/09/2026)")
            .anomalyTitle("Sử dụng phần mềm Mock GPS tái phạm lần 3")
            .anomalyDescription("Tài xế tiếp tục dùng tool giả lập định vị để xếp nốt tại Sân bay Nội Bài dù đã bị cảnh cáo 2 lần.")
            .fareAmount(450000)
            .voucherAmount(0)
            .bonusClaimed(0)
            .pickup("Sân bay Nội Bài")
            .dropoff("Ecopark Hưng Yên")
            .gpsDistanceKm(48.0)
            .telematicsActualKm(12.0)
            .maxSpeedKmh(280.0)
            .status(CaseStatus.DA_XU_PHAT)
            .statusLabel("Đã xử phạt vi phạm")
            .telematicsLogs(new ArrayList<>())
            .build();

        DriverExplanation exp7 = DriverExplanation.builder()
            .id("EXP-4350")
            .fraudCase(c7)
            .submittedAt("15:00 (16/09/2026)")
            .reasonCategory("Phủ nhận vi phạm")
            .content("Tôi không dùng phần mềm gì cả, do GPS của xe VinFast bị lỗi.")
            .status("da_nop_cho_duyet")
            .attachments(new ArrayList<>())
            .build();
        c7.setExplanation(exp7);

        CaseDecision dec7 = CaseDecision.builder()
            .fraudCase(c7)
            .decisionType(DecisionType.TAM_KHOA)
            .decidedAt("16:30 (16/09/2026)")
            .officerName("Nguyễn Mai Chi")
            .officerCode("GSM-INSPECT-88")
            .fineAmount(2000000)
            .suspensionDays(14)
            .reason("Tái phạm hành vi gian lận GPS theo Điều 14 Quy chế Vận hành GSM. Không chấp nhận lời giải trình do số liệu T-Box mâu thuẫn.")
            .messageToDriver("Quyết định xử phạt: Phạt 2.000.000 VNĐ (trừ ví ký quỹ) và tạm khóa tài khoản 14 ngày. Yêu cầu tham gia lớp đào tạo lại quy chế tuân thủ.")
            .build();
        c7.setDecision(dec7);

        fraudCaseRepository.saveAll(List.of(c1, c2, c3, c4, c5, c6, c7));
    }
}
