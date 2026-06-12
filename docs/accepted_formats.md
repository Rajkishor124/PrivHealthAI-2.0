# Accepted Indian Phone Number Formats

PrivHealthAI requires user registration and authentication via an Indian mobile phone number.
To ensure the best user experience while maintaining enterprise-grade security and robust database constraints, the application supports multiple user input representations for a mobile number while strictly normalizing them into the **E.164 standard format** `+91[6-9]\d{9}` for storage and uniqueness checks.

## Supported Input Examples

The following formats represent the same mobile number (`9334456119`). They are all accepted by the system during registration and login, and will be securely resolved to the same user account:

1. **10-Digit local:**
   `9334456119`
2. **0-prefixed:**
   `09334456119`
3. **91-prefixed (without +):**
   `919334456119`
4. **E.164 standard (with +91):**
   `+919334456119`
5. **Formatted with spaces, hyphens, or brackets:**
   - `91-9334456119`
   - `+91 93344 56119`
   - `91 93344 56119`
   - `(0) 93344-56119`

### How It Works

**1. Frontend Real-Time Validation**
When typing in the registration or login inputs, the application's logic parses the text. It strips spacing and punctuation `( ) -` and strictly checks if the remaining string corresponds to an Indian dialling structure (must start with 6, 7, 8, or 9 after any valid prefix). If the format is invalid (e.g. `12345` or starts with `5`), a validation error appears immediately beneath the input field.

**2. Backend Normalization**
Before interacting with the database, the `PhoneNumberUtil.normalizeIndianPhone` utility strips all formatting and applies prefix mapping to coerce the number strictly to `+919334456119`.

**3. Database Unique Constraint**
The resulting standard format is saved in the `phone_number` column. This guarantees that different variations of the same Indian phone number cannot be used to register multiple accounts.

## UI Display Rule
Whenever a user's phone number is displayed across the interface (in Profiles, Navbars, Admin tools), it uses the standard display utility `formatIndianPhone` to render clearly as:
`+91 93344 56119`
