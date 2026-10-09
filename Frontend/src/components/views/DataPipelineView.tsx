/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GSM Big Data Lakehouse Pipeline Visualizer
 * Trực quan hóa đường ống dữ liệu Medallion Lakehouse (Bronze -> Silver -> Gold -> Serving)
 * Thiết kế tinh gọn, trực quan, dễ nhìn, đồng bộ hệ sinh thái Green SM Operations Portal
 */

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  RefreshCw, 
  Server, 
  Cpu, 
  Network, 
  ShieldAlert, 
  Clock, 
  HardDrive,
  FileCheck2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { 
  DataPipelineSummary, 
  PipelineStageId, 
  PipelineStageInfo,
  PipelineBatchItem 
} from '../../types';
import { mockPipelineData, pipelineApi } from '../../services/pipelineService';

interface DataPipelineViewProps {
  onNavigateToCases?: () => void;
  onShowToast?: (msg: string) => void;
}

export const DataPipelineView: React.FC<DataPipelineViewProps> = ({
  onNavigateToCases,
  onShowToast,
}) => {
  const [pipelineData, setPipelineData] = useState<DataPipelineSummary>(mockPipelineData);
  const [selectedStageId, setSelectedStageId] = useState<PipelineStageId>('overview');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeSimulationStep, setActiveSimulationStep] = useState<number>(0);

  // Fetch pipeline data
  useEffect(() => {
    let isMounted = true;
    pipelineApi.getPipelineSummary().then((data) => {
      if (isMounted) setPipelineData(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Run a smooth 4-step pipeline flow simulation
  const handleSimulatePipeline = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setActiveSimulationStep(1);
    onShowToast?.('Đang bắt đầu mô phỏng quy trình nạp chốt ca đêm 100.000 xe...');

    const timer1 = setTimeout(() => setActiveSimulationStep(2), 1200);
    const timer2 = setTimeout(() => setActiveSimulationStep(3), 2400);
    const timer3 = setTimeout(() => setActiveSimulationStep(4), 3600);
    const timer4 = setTimeout(() => {
      setIsSimulating(false);
      setActiveSimulationStep(0);
      onShowToast?.('Toàn tuyến hoàn tất: 100% dữ liệu đạt chuẩn Sign-off chất lượng!');
    }, 4800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  };

  const handleManualRecheck = async () => {
    const res = await pipelineApi.triggerRecheck();
    onShowToast?.(res.message);
  };

  // Find currently selected stage data
  const currentStage: PipelineStageInfo | undefined = pipelineData.stages.find(
    (s) => s.id === selectedStageId
  );

  return (
    <div className="flex-1 bg-white border border-slate-200/90 rounded-xl shadow-2xs overflow-hidden flex flex-col p-4 space-y-4">
      {/* 1. Header & Controls: Clean & uncluttered */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">
              Giám Sát Đường Ống Dữ Liệu Lớn (Medallion Lakehouse)
            </h2>
            <span className="text-[11px] font-bold text-[#209799] bg-[#E3F8F8] px-2 py-0.5 rounded-md border border-[#28BDBF]/30">
              100.000 Xe VinFast Hà Nội
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Chu kỳ chốt ca đêm 00:00 – 06:00 • Micro-batching Jitter 15–30 xe/s • Kiến trúc 3 Tầng Bronze - Silver - Gold
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleManualRecheck}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Kiểm tra lại toàn bộ chốt chặn dữ liệu"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            Kiểm Chuẩn Tự Động
          </button>

          <button
            onClick={handleSimulatePipeline}
            disabled={isSimulating}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs transition-all ${
              isSimulating
                ? 'bg-emerald-600 text-white opacity-90 cursor-not-allowed'
                : 'btn-gsm-primary'
            }`}
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                Đang Chạy Mô Phỏng...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Mô Phỏng Chạy Pipeline
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Pipeline Navigation Ribbon: 5 minimalist buttons showing flow */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-1.5 bg-[#f8f9ff] rounded-xl border border-slate-200/80">
        {/* Stage Button 0: Overview */}
        <button
          onClick={() => setSelectedStageId('overview')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            selectedStageId === 'overview'
              ? 'bg-white text-[#209799] shadow-2xs border border-[#28BDBF]/40'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Activity className="w-4 h-4 shrink-0 text-[#28BDBF]" />
          <div className="text-left truncate">
            <div className="font-bold text-slate-900">Toàn Cảnh Tuyến</div>
            <div className="text-[10px] text-slate-400">End-to-End Flow</div>
          </div>
        </button>

        {/* Stage Button 1: Bronze */}
        <button
          onClick={() => setSelectedStageId('bronze')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            selectedStageId === 'bronze'
              ? 'bg-white text-[#209799] shadow-2xs border border-[#28BDBF]/40'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Database className="w-4 h-4 shrink-0 text-amber-500" />
          <div className="text-left truncate">
            <div className="font-bold text-slate-900">1. Thu Nhận Bronze</div>
            <div className="text-[10px] text-slate-400">10.000 xe / Batch</div>
          </div>
        </button>

        {/* Stage Button 2: Silver */}
        <button
          onClick={() => setSelectedStageId('silver')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            selectedStageId === 'silver'
              ? 'bg-white text-[#209799] shadow-2xs border border-[#28BDBF]/40'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Layers className="w-4 h-4 shrink-0 text-sky-500" />
          <div className="text-left truncate">
            <div className="font-bold text-slate-900">2. Làm Sạch Silver</div>
            <div className="text-[10px] text-slate-400">Compaction 128-256MB</div>
          </div>
        </button>

        {/* Stage Button 3: Gold */}
        <button
          onClick={() => setSelectedStageId('gold')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            selectedStageId === 'gold'
              ? 'bg-white text-[#209799] shadow-2xs border border-[#28BDBF]/40'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0 text-purple-500" />
          <div className="text-left truncate">
            <div className="font-bold text-slate-900">3. Trí Tuệ Gold</div>
            <div className="text-[10px] text-slate-400">48 Vector & Graph</div>
          </div>
        </button>

        {/* Stage Button 4: Serving */}
        <button
          onClick={() => setSelectedStageId('serving')}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
            selectedStageId === 'serving'
              ? 'bg-white text-[#209799] shadow-2xs border border-[#28BDBF]/40'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <ShieldAlert className="w-4 h-4 shrink-0 text-emerald-600" />
          <div className="text-left truncate">
            <div className="font-bold text-slate-900">4. Bàn Thẩm Định</div>
            <div className="text-[10px] text-slate-400">Phát Hiện F1 - F6</div>
          </div>
        </button>
      </div>

      {/* 3. Main View Area: Depends on whether Overview or a Specific Stage is selected */}
      {selectedStageId === 'overview' ? (
        /* ================= OVERVIEW VIEW ================= */
        <div className="flex-1 flex flex-col space-y-4 min-h-0 overflow-y-auto pr-0.5">
          {/* A. 3 Essential Key Metric Cards (Clean, big, no clutter) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase mb-1">
                <span>Quy Mô Nạp Dữ Liệu</span>
                <Server className="w-4 h-4 text-[#28BDBF]" />
              </div>
              <div className="text-2xl font-black text-slate-900">100.000 Xe</div>
              <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 inline shrink-0" />
                100% xe chốt ca thành công (10 Batch Parquet)
              </p>
            </div>

            <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase mb-1">
                <span>Chất Lượng Làm Sạch Toàn Trình</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-emerald-600">99.98% Sạch</div>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                28.48 triệu pings khử trùng lặp & bảo toàn ODO
              </p>
            </div>

            <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80 hover:border-slate-300 transition-colors">
              <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase mb-1">
                <span>Đề Xuất Truy Thu Gian Lận</span>
                <ShieldAlert className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-2xl font-black text-slate-900">184.500.000 đ</div>
              <p className="text-[11px] text-rose-600 font-medium mt-1">
                Phát hiện 3.420 cuốc bất thường (F1 - F6)
              </p>
            </div>
          </div>

          {/* B. Visual Linear Flow: The 4 pipeline steps connected with arrows */}
          <div className="p-4 bg-white rounded-xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <span>Dòng Chảy Xử Lý Dữ Liệu (Medallion Flow Architecture)</span>
                {isSimulating && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold animate-pulse">
                    Mô phỏng bước {activeSimulationStep}/4
                  </span>
                )}
              </h3>
              <span className="text-xs text-slate-400">Nhấp vào một bước để xem chi tiết</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
              {/* Step 1: Bronze */}
              <div
                onClick={() => setSelectedStageId('bronze')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                  activeSimulationStep === 1
                    ? 'border-[#28BDBF] bg-[#E3F8F8]/40 ring-2 ring-[#28BDBF]/20'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                    L1 - BRONZE
                  </span>
                  <Database className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-sm font-bold text-slate-900 mb-1">Thu Nhận & Gating</div>
                <p className="text-xs text-slate-500 leading-relaxed mb-2">
                  Tiếp nhận 100k xe (15-30 xe/s), kiểm tra SHA-256 và cô lập lỗi sang Quarantine.
                </p>
                <div className="text-[11px] font-semibold text-[#209799] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Xem chi tiết <ChevronRight className="w-3 h-3" />
                </div>
              </div>

              {/* Step 2: Silver */}
              <div
                onClick={() => setSelectedStageId('silver')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                  activeSimulationStep === 2
                    ? 'border-[#28BDBF] bg-[#E3F8F8]/40 ring-2 ring-[#28BDBF]/20'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 text-sky-800">
                    L2 - SILVER
                  </span>
                  <Layers className="w-4 h-4 text-sky-600" />
                </div>
                <div className="text-sm font-bold text-slate-900 mb-1">Làm Sạch & Đối Soát</div>
                <p className="text-xs text-slate-500 leading-relaxed mb-2">
                  Khử trùng lặp, geofence Hà Nội, ODO enforcer và compac file Parquet 128-256MB.
                </p>
                <div className="text-[11px] font-semibold text-[#209799] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Xem chi tiết <ChevronRight className="w-3 h-3" />
                </div>
              </div>

              {/* Step 3: Gold */}
              <div
                onClick={() => setSelectedStageId('gold')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                  activeSimulationStep === 3
                    ? 'border-[#28BDBF] bg-[#E3F8F8]/40 ring-2 ring-[#28BDBF]/20'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800">
                    L3 - GOLD
                  </span>
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-sm font-bold text-slate-900 mb-1">ML Store & Graph</div>
                <p className="text-xs text-slate-500 leading-relaxed mb-2">
                  Trích xuất 48 vector đặc trưng và mô hình đồ thị tri thức 10 Nút / 15 Cạnh.
                </p>
                <div className="text-[11px] font-semibold text-[#209799] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Xem chi tiết <ChevronRight className="w-3 h-3" />
                </div>
              </div>

              {/* Step 4: Serving */}
              <div
                onClick={() => setSelectedStageId('serving')}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                  activeSimulationStep === 4
                    ? 'border-[#28BDBF] bg-[#E3F8F8]/40 ring-2 ring-[#28BDBF]/20'
                    : 'border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    L4 - SERVING
                  </span>
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-sm font-bold text-slate-900 mb-1">Bàn Thẩm Định</div>
                <p className="text-xs text-slate-500 leading-relaxed mb-2">
                  Tự động chuyển hồ sơ nghi vấn sang Hàng đợi kiểm soát để thẩm định giải trình.
                </p>
                <div className="text-[11px] font-semibold text-[#209799] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Xem chi tiết <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>

          {/* C. Bottom Quick Card: Seamless bridge to Operations Desk */}
          <div className="p-3.5 bg-gradient-to-r from-[#E3F8F8] to-[#f0fbfb] rounded-xl border border-[#28BDBF]/30 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#28BDBF]/40 flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldAlert className="w-5 h-5 text-[#209799]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Đồng Bộ Dữ Liệu Với Bàn Thẩm Định Giải Trình Gian Lận GSM
                </h4>
                <p className="text-[11px] text-slate-600">
                  Dữ liệu viễn thông từ tầng Gold đã sẵn sàng. Có 42 hồ sơ đang chờ kiểm soát viên thẩm định.
                </p>
              </div>
            </div>

            {onNavigateToCases && (
              <button
                onClick={onNavigateToCases}
                className="btn-gsm-primary px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                Chuyển Đến Bàn Thẩm Định <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      ) : currentStage ? (
        /* ================= SPECIFIC STAGE VIEW ================= */
        <div className="flex-1 flex flex-col space-y-4 min-h-0 overflow-y-auto pr-0.5">
          {/* A. 3 Metric Cards for Selected Stage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {currentStage.metrics.map((m, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-200/80">
                <div className="text-xs text-slate-500 font-bold uppercase mb-1">{m.label}</div>
                <div
                  className={`text-2xl font-black ${
                    m.isPositive === false ? 'text-rose-600' : 'text-slate-900'
                  }`}
                >
                  {m.value}
                </div>
                {m.subtext && (
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    {m.changeText ? `${m.changeText} • ` : ''}
                    {m.subtext}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* B. Specific Visual Highlights for the Selected Stage */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Left box: Quality Gates / Checklist (Assertions) */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-[#209799]" />
                    Chốt Chặn Kiểm Chuẩn (QA/QC Assertions)
                  </h3>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Tất cả Đạt Chuẩn
                  </span>
                </div>
                <div className="space-y-2 mt-2">
                  {currentStage.checks.map((chk) => (
                    <div
                      key={chk.id}
                      className="p-2 rounded-lg bg-slate-50/70 border border-slate-100 flex items-start justify-between gap-2 text-xs"
                    >
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-slate-900">{chk.title}</div>
                          <div className="text-[11px] text-slate-500">{chk.rule}</div>
                        </div>
                      </div>
                      {chk.sampleValue && (
                        <span className="text-[10px] font-mono font-medium text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200 shrink-0">
                          {chk.sampleValue}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                Thực thi bởi Agent 06 (QA/QC Gatekeeper) trước khi bàn giao
              </div>
            </div>

            {/* Right box: Operational Highlights & Batches */}
            <div className="p-3.5 bg-white rounded-xl border border-slate-200/80 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-[#209799]" />
                    Thông Số Kỹ Thuật & Vận Hành
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Khung giờ: {currentStage.duration}
                  </span>
                </div>

                <ul className="space-y-2 text-xs text-slate-600 mt-2">
                  {currentStage.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#28BDBF] mt-1.5 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>

                {/* If Bronze: show micro-batch list */}
                {selectedStageId === 'bronze' && currentStage.batches && (
                  <div className="mt-3 pt-2 border-t border-slate-100">
                    <div className="text-[11px] font-bold text-slate-700 uppercase mb-1.5">
                      Danh Sách Micro-Batches Gần Nhất
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {currentStage.batches.map((b) => (
                        <div
                          key={b.batchId}
                          className="p-1.5 bg-slate-50 rounded border border-slate-200/60 text-[10px] flex items-center justify-between"
                        >
                          <span className="font-bold text-slate-800">{b.batchId}</span>
                          <span className="text-slate-500">{b.fileSizeBytes}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* If Serving: link button to Cases */}
                {selectedStageId === 'serving' && onNavigateToCases && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={onNavigateToCases}
                      className="w-full btn-gsm-primary py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Mở Bàn Thẩm Định Hồ Sơ Gian Lận <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-3 text-[11px] text-slate-400">
                Trạng thái: <span className="text-emerald-600 font-bold">{currentStage.statusLabel}</span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
