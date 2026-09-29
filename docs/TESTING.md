# Testing

## Verification log

Commands were run from the repository root on 2026-09-16.

- `npm run lint`: passed with 0 errors; 4 advisory `@next/next/no-img-element` warnings for remote demo avatars.
- `npm run typecheck`: passed.
- `npm test`: passed, 1 file and 3 tests.
- `npm run build`: passed; all 8 product routes compiled and prerendered.

Non-blocking notices: Next.js reports four remote demo-avatar `<img>` optimization warnings and that the `middleware` filename convention is moving to `proxy` in a future release.

## Focused coverage
- Caption hashtag and mention parsing.
- Video file validation for type and size limits.
- Daily challenge post uniqueness in the demo repository.
