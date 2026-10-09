/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * GSM Admin Portal - Data Pipeline Unit Test Suite
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pipelineApi, mockPipelineData } from '../services/pipelineService';

describe('GSM Data Pipeline Service Test Suite', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it('should return mock pipeline summary with all 4 Medallion stages when API is offline', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network offline'));

    const summary = await pipelineApi.getPipelineSummary();
    expect(summary).toBeDefined();
    expect(summary.totalVehicles).toBe(100000);
    expect(summary.stages).toHaveLength(4);

    const stageIds = summary.stages.map((s) => s.id);
    expect(stageIds).toContain('bronze');
    expect(stageIds).toContain('silver');
    expect(stageIds).toContain('gold');
    expect(stageIds).toContain('serving');
  });

  it('should return remote pipeline data if API call succeeds', async () => {
    const customSummary = {
      ...mockPipelineData,
      totalVehicles: 100000,
      scope: 'Hà Nội Pilot',
    };

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => customSummary,
    } as unknown as Response);

    const summary = await pipelineApi.getPipelineSummary();
    expect(summary.scope).toBe('Hà Nội Pilot');
  });

  it('should verify Bronze stage specifications and B-GATE checks', () => {
    const bronze = mockPipelineData.stages.find((s) => s.id === 'bronze');
    expect(bronze).toBeDefined();
    expect(bronze?.checks.length).toBeGreaterThanOrEqual(3);

    const checkIds = bronze?.checks.map((c) => c.id);
    expect(checkIds).toContain('b-gate-checksum');
    expect(checkIds).toContain('b-gate-contract');
    expect(checkIds).toContain('b-gate-physical-bounds');
  });

  it('should verify Silver stage specifications and ODO / Geofence checks', () => {
    const silver = mockPipelineData.stages.find((s) => s.id === 'silver');
    expect(silver).toBeDefined();

    const checkIds = silver?.checks.map((c) => c.id);
    expect(checkIds).toContain('silver-dedup');
    expect(checkIds).toContain('silver-geofence');
    expect(checkIds).toContain('silver-odo-monotonic');
  });

  it('should verify Gold stage specifications (48 ML dimensions and Graph connectivity)', () => {
    const gold = mockPipelineData.stages.find((s) => s.id === 'gold');
    expect(gold).toBeDefined();

    const featureMetric = gold?.metrics.find((m) => m.label.includes('Vector Đặc Trưng'));
    expect(featureMetric?.value).toContain('48');

    const graphMetric = gold?.metrics.find((m) => m.label.includes('Knowledge Graph'));
    expect(graphMetric?.value).toContain('10 Nút');
  });

  it('should successfully trigger manual pipeline recheck', async () => {
    const res = await pipelineApi.triggerRecheck();
    expect(res.success).toBe(true);
    expect(res.message).toBeDefined();
  });
});
