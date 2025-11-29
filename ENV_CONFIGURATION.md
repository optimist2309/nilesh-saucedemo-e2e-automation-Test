# Environment Configuration Guide

## Overview

This project uses environment variables to manage configuration across different environments (local development, CI/CD pipeline). The configuration is managed through `.env` files and is automatically loaded by `playwright.config.ts`.

## Files

### `.env.example` (Committed to Git)
- Template file with all available configuration options
- Contains default values and descriptions
- Use this as reference for all available settings

### `.env` (Local Development - NOT committed)
- Local development configuration
- Override `.env.example` values for your local setup
- Automatically loaded when running tests locally

### `.env.ci` (CI/CD Pipeline - Can be committed)
- Azure DevOps CI/CD pipeline configuration
- Optimized for headless execution on CI agents
- Committed to repository for pipeline consistency

## Quick Start

### 1. Local Development Setup

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your local settings
# Most defaults work fine; customize as needed
```

### 2. Running Tests Locally

```bash
# Uses .env configuration
npm test

# Run in headed mode (uses HEADLESS=false from .env)
npm run test:headed

# Run in debug mode
npm run test:debug

# View test report
npm run test:report
```

### 3. CI/CD Pipeline

The pipeline automatically:
- Loads `.env.ci` before running tests
- Sets `CI=true` environment variable
- Runs with optimized CI settings (headless, extended timeouts, etc.)

## Environment Variables

### Test Configuration

| Variable | Default | Type | Description |
|----------|---------|------|-------------|
| `BASE_URL` | `https://www.saucedemo.com` | string | Application URL to test |
| `HEADLESS` | `true` | boolean | Run browser in headless mode |
| `WORKERS` | `1` | number | Parallel test workers (1-4) |
| `TEST_TIMEOUT` | `60000` | number | Test timeout in ms |
| `NAVIGATION_TIMEOUT` | `30000` | number | Navigation timeout in ms |
| `ACTION_TIMEOUT` | `10000` | number | Action timeout in ms |
| `SLOW_MO` | `0` | number | Slow motion delay in ms |

### Browser Configuration

| Variable | Default | Type | Description |
|----------|---------|------|-------------|
| `BROWSER` | `chromium` | string | Browser type (chromium/firefox/webkit) |
| `TRACE_MODE` | `on-first-retry` | string | Trace recording mode |
| `SCREENSHOT_MODE` | `only-on-failure` | string | Screenshot capture mode |
| `VIDEO_MODE` | `retain-on-failure` | string | Video recording mode |
| `VIDEO_SIZE` | `1280x720` | string | Video resolution |
| `LOCALE` | `en-US` | string | Browser locale |
| `TIMEZONE` | `America/New_York` | string | Browser timezone |
| `IGNORE_HTTPS_ERRORS` | `false` | boolean | Ignore HTTPS certificate errors |

### Reporting Configuration

| Variable | Default | Type | Description |
|----------|---------|------|-------------|
| `REPORT_DIR` | `playwright-report` | string | HTML report output directory |
| `TEST_RESULTS_DIR` | `test-results` | string | Test results directory |
| `JUNIT_REPORT` | `true` | boolean | Generate JUnit report |
| `JUNIT_REPORT_FILE` | `junit.xml` | string | JUnit report filename |

### CI/CD Configuration

| Variable | Default (Local) | Default (CI) | Type | Description |
|----------|-----------------|-------------|------|-------------|
| `CI` | `false` | `true` | boolean | Running in CI mode |
| `ENVIRONMENT` | `local` | `ci` | string | Environment identifier |
| `RETRIES_LOCAL` | `0` | - | number | Local test retries |
| `RETRIES_CI` | `2` | `2` | number | CI test retries |
| `HEADLESS` | `false` | `true` | boolean | Headless mode |
| `TEST_TIMEOUT` | `60000` | `120000` | number | Extended for CI |

### Test Data Configuration

| Variable | Default | Type | Description |
|----------|---------|------|-------------|
| `TEST_USERNAME` | `standard_user` | string | Valid test username |
| `TEST_PASSWORD` | `secret_sauce` | string | Valid test password |
| `INVALID_USERNAME` | `invalid_user` | string | Invalid username for testing |
| `INVALID_PASSWORD` | `wrong_password` | string | Invalid password for testing |
| `LOCKED_OUT_USER` | `locked_out_user` | string | Locked out user account |

## Examples

### Example 1: Local Development with Headed Browser

`.env`:
```env
HEADLESS=false
SLOW_MO=1000
DEBUG=true
VERBOSE=true
```

Run: `npm run test:headed`

### Example 2: CI/CD with Extended Timeouts

`.env.ci`:
```env
CI=true
TEST_TIMEOUT=120000
NAVIGATION_TIMEOUT=45000
ACTION_TIMEOUT=15000
HEADLESS=true
```

### Example 3: Run Specific Tests Only

`.env`:
```env
TEST_PATTERN=TC-001|TC-002
```

### Example 4: Mobile Device Emulation

`.env`:
```env
DEVICE=iPhone 12
LOCALE=en-GB
TIMEZONE=Europe/London
```

## How Environment Variables Are Loaded

### Local Development

1. Copy `.env.example` to `.env` (or it exists)
2. Run: `npm test`
3. `playwright.config.ts` automatically loads `.env`
4. Variables are used for Playwright configuration

### CI/CD Pipeline

1. `azure-pipelines.yml` copies `.env.ci` to `.env`
2. Pipeline runs tests
3. `playwright.config.ts` loads `.env` (which is now `.env.ci`)
4. CI-specific settings applied

### Fallback Behavior

If a variable is not set:
1. Check `.env` file
2. Check system environment variables
3. Use default value from code

Example in `playwright.config.ts`:
```typescript
const getEnv = (key: string, defaultValue: string): string => {
  return process.env[key] ?? defaultValue;
};
```

## Modifying Configuration

### For Local Testing

1. Edit `.env`:
   ```bash
   nano .env  # or use your editor
   ```

2. Set desired values:
   ```env
   HEADLESS=false
   WORKERS=2
   ```

3. Run tests:
   ```bash
   npm test
   ```

### For CI/CD Pipeline

1. Edit `.env.ci`:
   ```bash
   git pull
   nano .env.ci
   ```

2. Commit changes:
   ```bash
   git add .env.ci
   git commit -m "Update CI environment configuration"
   git push origin main
   ```

3. Next pipeline run uses new values

## Security Considerations

### DO NOT Commit `.env` File

- Contains sensitive test credentials
- `.gitignore` prevents accidental commits
- Each developer maintains their own `.env`

### Use Secrets for CI/CD

For sensitive data in CI/CD:

1. Use Azure DevOps **Variable groups**:
   ```yaml
   variables:
     - group: 'SauceDemoSecrets'
   ```

2. Or use **Secret files**:
   ```yaml
   - task: DownloadSecureFile@1
     inputs:
       secureFile: '.env.ci'
   ```

3. Never hardcode credentials in pipeline YAML

### Example: Using Azure DevOps Secrets

In `azure-pipelines.yml`:
```yaml
variables:
  - group: 'test-credentials'  # Contains TEST_USERNAME, TEST_PASSWORD

env:
  TEST_USERNAME: $(TEST_USERNAME)
  TEST_PASSWORD: $(TEST_PASSWORD)
```

## Troubleshooting

### Issue: Variables not loading

**Solution**:
```bash
# Verify .env exists
ls -la .env

# Check .env content
cat .env

# Verify playwright.config.ts loads dotenv
npm test -- --reporter list
```

### Issue: Wrong timeout in tests

**Solution**:
```bash
# Check environment variable
echo $TEST_TIMEOUT

# Verify in .env file
grep TEST_TIMEOUT .env

# Update and retry
npm test
```

### Issue: CI tests run in headed mode

**Solution**:
- Edit `.env.ci`
- Set `HEADLESS=true`
- Ensure `azure-pipelines.yml` copies `.env.ci`
- Push and re-run pipeline

## Reference

### Configuration Priority

1. System environment variable (highest)
2. Variable from `.env` file
3. Default value in code (lowest)

### Files Location

```
project-root/
├── .env.example      # Template (committed)
├── .env              # Local dev (NOT committed)
├── .env.ci           # CI/CD (committed)
├── playwright.config.ts  # Loads .env files
└── azure-pipelines.yml   # Copies .env.ci
```

### Key Implementation

`playwright.config.ts`:
```typescript
// Load .env based on CI mode
const envFile = process.env.CI ? '.env.ci' : '.env';
require('dotenv').config({ path: path.resolve(__dirname, envFile) });

// Use variables with fallback
const getEnv = (key, defaultValue) => process.env[key] ?? defaultValue;
```
