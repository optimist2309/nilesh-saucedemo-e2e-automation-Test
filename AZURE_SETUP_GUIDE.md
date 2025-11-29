# Azure DevOps Pipeline Setup Instructions

## Quick Start

### Step 1: Create Azure DevOps Project
1. Go to [dev.azure.com](https://dev.azure.com)
2. Create a new project or select existing one
3. Clone this repository into Azure DevOps (or link your GitHub repo)

### Step 2: Create a Pipeline

#### Option A: From GitHub (Recommended)
1. Go to **Pipelines** → **New Pipeline**
2. Select **GitHub** as source
3. Authenticate and select your repository: `nilesh9822688817/nilesh-saucedemo-e2e-automation`
4. Choose **Existing Azure Pipelines YAML file**
5. Select **Branch**: `main`, **Path**: `azure-pipelines.yml`
6. Click **Continue** and then **Save and run**

#### Option B: From Azure DevOps Repo
1. Push repository to Azure DevOps Git
2. Go to **Pipelines** → **New Pipeline**
3. Select **Azure Repos Git**
4. Select your repository
5. Choose **Existing Azure Pipelines YAML file**
6. Select `azure-pipelines.yml`
7. Click **Continue** and **Save and run**

### Step 3: Monitor Pipeline Execution

After saving, the pipeline will:
1. **Build Stage**: Install dependencies (2-3 minutes)
2. **Lint Stage**: Check TypeScript syntax (1-2 minutes)
3. **Test Stage**: Run Playwright tests (5-15 minutes depending on test count)
4. **Report Stage**: Generate reports and artifacts (1-2 minutes)

## Accessing Test Results

### View Test Results in Portal
1. Go to your pipeline run
2. Click **Tests** tab to see JUnit results
3. Failed tests are highlighted with error messages

### Download Playwright HTML Report
1. Go to pipeline run → **Summary** tab
2. Scroll to **Published artifacts**
3. Download `playwright-html-report`
4. Extract and open `index.html` in browser

## Common Configurations

### Run Tests on Specific Browsers

Modify `playwright.config.ts`:

```typescript
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },
],
```

Then update pipeline to install all browsers:

```yaml
- script: npx playwright install --with-deps chromium firefox webkit
  displayName: 'Install all Playwright browsers'
```

### Run Specific Test Suite

Modify test script in pipeline:

```yaml
- script: npm test -- tests/specs/positive.spec.ts
  displayName: 'Run positive tests only'
```

Or for specific test pattern:

```yaml
- script: npm test -- --grep "TC-001|TC-002"
  displayName: 'Run specific tests'
```

### Parallel Test Execution

In `playwright.config.ts`:

```typescript
workers: process.env.CI ? 4 : 1,  // 4 workers on CI
fullyParallel: true,               // Enable parallel mode
```

**Note**: May cause flakiness; ensure tests are independent.

### Extended Timeout for Slow Networks

In `playwright.config.ts`:

```typescript
timeout: process.env.CI ? 120000 : 60000,  // 120s on CI, 60s locally
```

Or in pipeline:

```yaml
env:
  CI: 'true'
  TEST_TIMEOUT: '120000'
```

## Notifications and Alerts

### Email Notifications on Failure

1. Go to pipeline → **More options** (⋯) → **Pipeline settings**
2. Click **Notifications**
3. Add notification rule:
   - **Event**: Build failed
   - **Recipients**: Your email/team
   - **Trigger**: On any build failure

### Slack Integration

1. Create Slack app integration in Azure DevOps
2. Go to **Project settings** → **Service connections**
3. Create **Slack** connection
4. In pipeline, add:

```yaml
- task: PublishBuildArtifacts@1
  displayName: 'Notify Slack'
  condition: failed()
```

## Debugging Pipeline Issues

### Check Build Logs

1. Open pipeline run
2. Click on failed stage/job
3. View detailed logs for each task
4. Search for error messages

### Common Issues and Solutions

| Issue | Solution |
|-------|----------|
| Browser installation fails | Ensure `--with-deps` flag is used |
| Tests timeout | Increase timeout in config or pipeline |
| Out of memory | Reduce workers, run in smaller batches |
| Permission denied | Check Azure DevOps permissions for repo |
| Tests pass locally but fail in CI | Check environment variables, network access |

### Re-run Failed Tests

1. Open pipeline run
2. Click **Rerun failed jobs** button
3. Only failed jobs will re-execute

### View Test Artifacts

1. Pipeline run → **Summary** tab
2. Under **Artifacts**, download:
   - `playwright-html-report`: Detailed test report
   - `test-results`: Screenshots and videos
   - `test-artifacts`: All combined artifacts

## Advanced Configuration

### Conditional Test Execution

Run tests only when source files change:

```yaml
trigger:
  branches:
    include:
      - main
  paths:
    include:
      - tests/**
      - playwright.config.ts
      - package.json
```

### Manual Test Trigger

Add option to run pipeline manually:

```yaml
trigger: none  # Disable automatic trigger

schedules:
  - cron: '0 2 * * MON-FRI'  # Run at 2 AM on weekdays
    displayName: 'Nightly test run'
    branches:
      include:
        - main
```

### Multi-Stage Approval

Add approval before running tests:

```yaml
stages:
  - stage: Approval
    displayName: 'Require Approval'
    jobs:
      - job: waitForValidation
        displayName: 'Wait for approval'
        pool: server
        timeoutInMinutes: 1440  # 24 hours
```

## Maintenance

### Update Playwright Version

1. Update `package.json`:
   ```json
   "@playwright/test": "^1.50.0"
   ```

2. Update `azure-pipelines.yml`:
   ```yaml
   playwrightVersion: '1.50.0'
   ```

3. Commit and push changes

### Clean Up Old Artifacts

Azure DevOps automatically manages artifact storage. To free space:
1. Go to **Project settings** → **Retention policies**
2. Set retention for failed builds (default: 30 days)

## Cost Optimization

- Use `ubuntu-latest` (cheaper than Windows agents)
- Enable npm caching (reduces download time)
- Use 1 worker for serial execution (reduces resource usage)
- Schedule nightly runs instead of on every commit

## Next Steps

1. ✅ Commit `azure-pipelines.yml` to repository
2. ✅ Create pipeline in Azure DevOps
3. ✅ Run initial pipeline to verify setup
4. ✅ Configure notifications
5. ✅ Schedule regular test runs
6. ✅ Integrate with code review process

## Support

For issues or questions:
- Check [Azure Pipelines Docs](https://learn.microsoft.com/en-us/azure/devops/pipelines/)
- Review `AZURE_DEVOPS_PIPELINE.md` for detailed configuration
- Check pipeline logs for specific error messages
