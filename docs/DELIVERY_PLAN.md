# Daily Dare delivery plan

Status: proposed sequence, 2026-09-30. This adopts the eight stages supplied by the product owner. It does not claim that implementation or release gates have passed. Accountable owners are provisional roles until named people are assigned.

The [audit backlog](audit/2026-09-30-backlog.md) remains the item-level source of evidence. The [rules draft](PRODUCT_RULES.md) defines proposed acceptance behavior; it needs agreement before dependent implementation. Existing product/setup documents describe older behavior and do not override this proposed plan.

| Stage | Current position | Work and audit references | One owner | Evidence required to exit |
|---|---|---|---|---|
| 1. Audit the current app | Partial: local audit recorded; live backend and visual checks outstanding | Complete A02/A30; replace proposed role owners with named people. Keep all 36 items and their evidence current. | QA lead | Shared backlog with one confirmed owner per item; screen interaction evidence and deployed database/Auth/Storage inspection. Untested areas explicitly retained until verified. |
| 2. Agree on the rules | Draft available; not agreed | Resolve R1–R9 in PRODUCT_RULES.md: deadlines, enrollment, travel, misses, retries, outages, friendship and privacy. | Product lead | Versioned, agreed rules with expected outcomes; test cases tied to each rule. |
| 3. Accounts and database | Partial | A05–A07/A12/A13–A16/A19/A30/A36: verified accounts, recovery/sign-out, sessions, forward migrations, RLS, persistent records, two-way friendships. Close direct post-write bypass before connecting writes. | Backend lead | Two real staging accounts retain data after sign-out/reload and on another device. Direct API/RPC/Storage tests prove each cannot read or mutate the other's protected data. Third unrelated account used for sharing tests. |
| 4. Complete the daily loop | Partial: local SQL tests pass | A03/A08–A11/A35: stable assignment, photo proof, atomic completion and streak, duplicate/retry handling, error recovery and persistent feed. | Backend lead | Staging flow survives refresh/device switch; simultaneous retries create one completion; failed uploads do not count. Exact-midnight, DST, enrollment, missed-day and outage-rule tests pass. |
| 5. Media and private sharing | Partial; processing and access lifecycle missing | A04/A09/A10/A18/A19: photos first, decode/validate, resize, strip metadata, private originals/derivatives, recoverable upload sessions, authorization on every retrieval and revocation. | Media lead | Unrelated and revoked accounts cannot fetch any original, thumbnail or derivative, including previously issued access paths. Validate EXIF removal, size/type rejection, interrupted upload and orphan cleanup. Video processing is a separate milestone, not required for photo beta. |
| 6. Safety and operations | Mostly missing | A18/A32 plus moderation console, suspension, challenge withdrawal, operator audit log, monitoring, backup and restore. Hide withdrawn dares and prevent new submissions. | Operations lead | Handle a report, suspend a test account, withdraw an unsafe dare, export/delete a test account, and restore a backup into isolated staging. Include media recovery, permission verification and measured recovery time. |
| 7. Notifications and beta | Partial | A20/A22–A25/A31/A35: frequent scheduling, bounded retries, delivery/backlog alerts, support process and invite-only access. Do not require notifications for completion. | Platform lead | Invite-only testers complete with permission denied and notifications disabled. Induced provider/worker failures alert an operator and recover without duplicate completion or expired notices. Run mobile/browser regression and record beta issues. |
| 8. Premium and billing | Partial prototype; deferred | A27–A29: select one persistent paid benefit, then purchase lifecycle, server entitlement enforcement, cancellation/restore, refunds, renewal failures and webhook reconciliation. | Billing lead | Store sandbox purchases grant access; expiry/refund removes it; cancellation retains access through paid-through date; restore/device switch works. Duplicate/out-of-order events cannot grant incorrect access. |

## Dependencies and scope

Proceed in stage order for acceptance. Implementation can overlap only when agreed rules and interfaces permit it. Keep Stage 3's write-policy fix ahead of live social mutations. Stage 4's upload path must use Stage 5's privacy contract from the start; completing the daily loop is not permission to ship unprocessed or publicly accessible proof.

Photo-only invite beta is the target. Video processing, public discovery, DMs, music mixing and expanded Plus features are separate scope decisions. Hide unsupported production controls instead of presenting demo changes as persisted outcomes. Existing local demo behavior can remain clearly labeled.

Stage 6 must pass before the beta opens. Stage 8 follows evidence that the free daily loop works reliably; do not implement paid streak forgiveness by default. Suggested first paid benefit: a private personal archive/export, subject to product agreement and a server-enforced entitlement.

## Evidence checklist for every gate

Record the commit/environment, date, test account aliases (no credentials), exact steps, expected and observed outcome, test output or screenshots, one accountable owner, and remaining issues. Run security tests through direct APIs as well as screens. HTTP 200 and local SQL fixtures alone cannot close a live integration gate.

Required access for remaining verification: authorized staging Supabase project, test-account email/SMS delivery, a working browser/device, deployed scheduler and later store sandbox configuration. Secrets belong in the environment, not these documents.

## Implementation started — 2026-09-30

Stage 3's first independent fix is migration `004_protect_post_writes.sql`, with authenticated-role database regression tests. It closes direct post insert/update bypasses locally while retaining validated RPC completion and owner deletion. Validation: 34 tests pass, typecheck passes, lint has one existing image warning. Apply 004 after 001–003 in staging and inspect deployed policies before closing A12. No deployed migration was run. Product-rule-dependent changes remain pending agreement.
