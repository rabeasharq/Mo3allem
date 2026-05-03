# Security Specification - Knight of the Dhad

## 1. Data Invariants
- A `Student` must belong to a valid `Grade` (7, 8, 9).
- `totalPoints` must be the sum of individual point categories (enforced via logic, but rules will check for non-negative).
- `PointLog` must reference an existing `Student`.
- Only `Admins` can award points or change `Sessions`.

## 2. The Dirty Dozen Payloads
1. **Self-Promotion**: Student trying to set their own points to 9999.
2. **Identity Spoofing**: User A trying to update User B's name.
3. **Ghost Team**: Creating a team with a fake ID.
4. **Negative Points**: Awarding -500 points to a rival.
5. **Session Hijack**: Non-admin ending a session.
6. **ID Poisoning**: Document ID with 2KB string.
7. **Type Mismatch**: Setting `points` to a string instead of an object.
8. **Level Skip**: Setting level to "Expert" with 0 points.
9. **Update Gap**: Changing `totalPoints` but not the individual skill points.
10. **Shadow Field**: Adding `isAwardedFreeMacbook: true` to a student record.
11. **PII Leak**: Unauthorized user listing all point logs.
12. **Time Travel**: Setting `updatedAt` to a future date manually.

## 3. Test Runner
(I will implement `firestore.rules.test.ts` to verify these).
