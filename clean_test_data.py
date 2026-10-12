"""Script lam sach du lieu TEST trong co so du lieu gsm_simulator.

NGUYEN TAC AN TOAN:
1. KHONG BAO GIO CHAM VAO KHO DU LIEU THUC TE (Data Warehouse):
   - public_frauds (4,349+ ban ghi du lieu gian lan ML)
   - trips (117,307+ chuyen di thuc te)
   - driver_statistic_daily, driver_income_daily, kpi_driver_platform_calculator_gbq
   - company_policies, operators
2. CHI LOC VA XOA BAN GHI CO DAU HIEU TEST TREN CAC BANG COMPLIANCE DESK:
   - Case ID: 'CASE-%', 'TEST-%', '%TEST%', '%FAILSAFE%', 'GL-8842', 'GL-8843'
   - Driver ID: 'DRV-FAILSAFE-%', 'DRV-TEST-%', 'TX-%', '%FAILSAFE%', 'DRV-%'
   - Cac ban ghi audit, quyet dinh, giai trinh, telematics phu thuoc case test
   - Notifications lien quan den case test (giu lai notif-1)
"""

import sys
import psycopg2

try:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

DB_CONFIG = {
    "host": "127.0.0.1",
    "port": 5433,
    "dbname": "gsm_simulator",
    "user": "gsm_admin",
    "password": "gsm_password_2026",
}

# SQL Filter de xac dinh cac Case Test
TEST_CASE_FILTER = """(
    id LIKE 'CASE-%' 
    OR id LIKE 'TEST-%' 
    OR id LIKE '%TEST%' 
    OR id LIKE '%FAILSAFE%' 
    OR id LIKE 'GL-%'
    OR driver_id LIKE '%FAILSAFE%' 
    OR driver_id LIKE 'DRV-%' 
    OR driver_id LIKE 'TX-%'
    OR driver_id LIKE '%TEST%'
)"""

TEST_CASE_ID_SUBQUERY = f"SELECT id FROM fraud_cases WHERE {TEST_CASE_FILTER}"

TEST_DRIVER_FILTER = """(
    id LIKE '%FAILSAFE%' 
    OR id LIKE 'DRV-%' 
    OR id LIKE 'TX-%' 
    OR id LIKE '%TEST%'
    OR name LIKE 'Tài xế DRV-%'
    OR name LIKE '%Test%'
)"""

def clean_database():
    print("=" * 65)
    print("BAT DAU DON DEP DU LIEU KIEM THU (GSM COMPLIANCE DESK)")
    print("Bao toan 100% du lieu thuc te: public_frauds, trips, policies, operators")
    print("=" * 65)
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        conn.autocommit = True
        cur = conn.cursor()

        # 1. Xoa case_audit_logs thuoc ve test cases
        cur.execute(f"""
            DELETE FROM case_audit_logs 
            WHERE case_id LIKE 'CASE-%' 
               OR case_id LIKE 'TEST-%' 
               OR case_id LIKE '%TEST%' 
               OR case_id LIKE '%FAILSAFE%'
               OR case_id LIKE 'GL-%'
               OR case_id IN ({TEST_CASE_ID_SUBQUERY});
        """)
        print(f"[OK] Da xoa {cur.rowcount} ban ghi case_audit_logs (test)")

        # 2. Xoa case_decisions thuoc ve test cases
        cur.execute(f"""
            DELETE FROM case_decisions 
            WHERE case_id LIKE 'CASE-%' 
               OR case_id LIKE 'TEST-%' 
               OR case_id LIKE '%TEST%' 
               OR case_id LIKE '%FAILSAFE%'
               OR case_id LIKE 'GL-%'
               OR case_id IN ({TEST_CASE_ID_SUBQUERY});
        """)
        print(f"[OK] Da xoa {cur.rowcount} ban ghi case_decisions (test)")

        # 3. Xoa explanation_attachments thuoc ve test cases
        cur.execute(f"""
            DELETE FROM explanation_attachments 
            WHERE explanation_id IN (
                SELECT id FROM driver_explanations 
                WHERE case_id LIKE 'CASE-%' 
                   OR case_id LIKE 'TEST-%' 
                   OR case_id LIKE '%TEST%' 
                   OR case_id LIKE '%FAILSAFE%'
                   OR case_id LIKE 'GL-%'
                   OR case_id IN ({TEST_CASE_ID_SUBQUERY})
            );
        """)
        print(f"[OK] Da xoa {cur.rowcount} ban ghi explanation_attachments (test)")

        # 4. Xoa driver_explanations thuoc ve test cases
        cur.execute(f"""
            DELETE FROM driver_explanations 
            WHERE case_id LIKE 'CASE-%' 
               OR case_id LIKE 'TEST-%' 
               OR case_id LIKE '%TEST%' 
               OR case_id LIKE '%FAILSAFE%'
               OR case_id LIKE 'GL-%'
               OR case_id IN ({TEST_CASE_ID_SUBQUERY});
        """)
        print(f"[OK] Da xoa {cur.rowcount} ban ghi driver_explanations (test)")

        # 5. Xoa telematics_logs thuoc ve test cases
        cur.execute(f"""
            DELETE FROM telematics_logs 
            WHERE case_id LIKE 'CASE-%' 
               OR case_id LIKE 'TEST-%' 
               OR case_id LIKE '%TEST%' 
               OR case_id LIKE '%FAILSAFE%'
               OR case_id LIKE 'GL-%'
               OR case_id IN ({TEST_CASE_ID_SUBQUERY});
        """)
        print(f"[OK] Da xoa {cur.rowcount} ban ghi telematics_logs (test)")

        # 6. Xoa notifications test (giu lai thong bao he thong chuan notif-1)
        cur.execute(f"""
            DELETE FROM notifications 
            WHERE id != 'notif-1' 
              AND (
                  case_id LIKE 'CASE-%' 
                  OR case_id LIKE 'TEST-%' 
                  OR case_id LIKE '%TEST%' 
                  OR case_id LIKE '%FAILSAFE%'
                  OR case_id LIKE 'GL-%'
                  OR case_id IN ({TEST_CASE_ID_SUBQUERY})
                  OR case_id IS NULL
              );
        """)
        print(f"[OK] Da xoa {cur.rowcount} ban ghi notifications (test)")

        # 7. Xoa danh sach fraud_cases thuoc ve test
        cur.execute(f"DELETE FROM fraud_cases WHERE {TEST_CASE_FILTER};")
        print(f"[OK] Da xoa {cur.rowcount} ban ghi fraud_cases (test)")

        # 8. Xoa cac tai xe test
        cur.execute(f"DELETE FROM drivers WHERE {TEST_DRIVER_FILTER};")
        print(f"[OK] Da xoa {cur.rowcount} ban ghi drivers (test)")

        cur.close()
        conn.close()
        print("=" * 65)
        print("HOAN TAT: Da lam sach toan bo du lieu test, bao toan du lieu thuc te!")
        print("=" * 65)
        return True
    except Exception as e:
        print(f"[LOI] Khong the lam sach du lieu: {e}")
        return False

if __name__ == "__main__":
    success = clean_database()
    sys.exit(0 if success else 1)

