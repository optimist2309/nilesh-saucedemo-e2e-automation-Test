# Azure DevOps CI/CD Pipeline Guide

## Overview

The Azure DevOps CI/CD pipeline automates the testing and reporting of the Playwright E2E test suite. The pipeline runs on every push to `main` and `develop` branches, and on pull requests.

## Pipeline Stages

### 1. **Build Stage**
   - **Purpose**: Install dependencies and setup the environment
   - **Steps**:
     - Install Node.js (version 18.x)
     - Cache npm packages for faster builds
     - Install npm dependencies
     - Install Playwright browsers with system dependencies
     - Install Chromium browser specifically

### 2. **Lint Stage**
   - **Purpose**: Validate TypeScript code quality
   - **Steps**:
     - Install Node.js
     - Install dependencies
     - Run TypeScript compilation check (`tsc --noEmit`)
     - Continues on error to not block the pipeline

### 3. **Test Stage**
   - **Purpose**: Execute all Playwright tests
   - **Steps**:
     - Install Node.js
     - Install dependencies
     - Install Playwright with dependencies
     - Run tests with HTML and JUnit reporters
     - **JUnit Report**: Published to Azure DevOps test results
     - **HTML Report**: Saved as build artifact for detailed analysis
     - **Test Results**: Published on failure as artifacts

### 4. **Report and Notify Stage**
   - **Purpose**: Generate and publish final test reports
   - **Steps**:
     - Copy reports to staging directory
     - Publish all test artifacts (HTML reports, screenshots, videos)
     - Make reports accessible through Azure DevOps

## Trigger Configuration

```yaml
trigger:
  - main
  - develop

pr:
  - main
  - develop
```

- **Pipeline runs automatically** on push to `main` and `develop` branches
- **Pipeline runs on pull requests** targeting `main` and `develop` branches

## Pool Configuration

```yaml
pool:
  vmImage: 'ubuntu-latest'
```

- Runs on Ubuntu Linux (lightweight, cost-effective)
- Can be changed to `windows-latest` or `macos-latest` if needed

## Variables

```yaml
variables:
  nodeVersion: '18.x'
  playwrightVersion: '1.48.1'
```

- Centralized Node.js and Playwright versions for easy maintenance

## Key Features

### 1. **Caching**
   - npm packages are cached to speed up subsequent runs
   - Reduces build time by 60-70%

### 2. **Dependency Management**
   - `--with-deps` flag installs system dependencies required by Playwright
   - Handles Chrome/Chromium library dependencies automatically

### 3. **Test Reporting**
   - **HTML Reports**: Detailed visual report of test results
   - **JUnit Reports**: Integration with Azure DevOps test results panel
   - **Artifacts**: Screenshots and videos from failed tests

### 4. **Conditional Execution**
   - Report stage runs regardless of test success/failure (`condition: always()`)
   - Failed test artifacts are published separately
   - Allows investigation of failures even if tests fail

### 5. **Environment Variable**
   - `CI: 'true'` tells Playwright we're running in CI mode
   - Enables automatic retries (2 retries on CI as per `playwright.config.ts`)

## Environment Variables in Pipeline

The following environment variables are automatically available:

- `CI=true`: Triggers CI-specific behavior in `playwright.config.ts`
- `System.DefaultWorkingDirectory`: Root of the repository
- `Build.ArtifactStagingDirectory`: Directory for staging artifacts

## Accessing Test Reports

### During Build
1. Go to your Azure DevOps project
2. Click **Pipelines** → Select your pipeline run
3. View **Test** tab for JUnit results
4. View **Published artifacts** → `playwright-html-report` for detailed HTML report

### After Build Completion
1. Download the `playwright-html-report` artifact
2. Extract and open `index.html` in a browser
3. View detailed results including:
   - Test execution times
   - Screenshots of failures
   - Video recordings (if videos enabled)
   - Traces for debugging

## playwright.config.ts Integration

The pipeline respects the following settings:

```typescript
forbidOnly: !!process.env.CI,        // Fails if only() is used
retries: process.env.CI ? 2 : 0,     // 2 retries on CI
workers: 1,                           // Single worker for stability
```

## Adding Custom Reporters

To add additional reporters, modify the pipeline:

```yaml
- script: npm test -- --reporter=html,junit,json
  displayName: 'Run tests with JSON report'
```

And update `playwright.config.ts`:

```typescript
reporter: [['html'], ['junit', { outputFile: 'junit.xml' }], ['json', { outputFile: 'test-results.json' }]],
```

## Modifying Branch Triggers

To add or modify branches:

```yaml
trigger:
  - main
  - develop
  - feature/*        # Add feature branches
  - release/*        # Add release branches
```

## Troubleshooting

### Browser Installation Fails
- Check system dependencies: `sudo apt-get install -y libgbm1 libxss1 libnss3`
- Or use `--with-deps` flag (already included in pipeline)

### Tests Timeout
- Increase `timeout` in `playwright.config.ts`
- Check if the website is accessible from the pipeline agent's network

### Tests Pass Locally but Fail in Pipeline
- Browser headless mode differences
- Network/firewall restrictions
- Environment variables not set

### Reports Not Generated
- Ensure test directory and spec files exist
- Check test results format matches expected schema
- Verify artifact paths are correct

## Performance Optimization

Current settings:
- **Workers**: 1 (serial execution for stability)
- **Retries**: 2 on CI (automatic retry on flaky tests)
- **Cache**: npm packages cached

To speed up further:
- Increase `workers` to 2-4 (if tests are stable)
- Use `ubuntu-latest` (faster than Windows agents)
- Enable npm cache warming

## Security Considerations

- No secrets are hardcoded in the pipeline
- Credentials should be managed through Azure DevOps **Secure files** or **Variable groups**
- Repository is public; ensure no sensitive data in test output

## Next Steps

1. **Create Azure DevOps Project**: Push this repository to Azure DevOps
2. **Create Pipeline**: 
   - Go to Pipelines → New Pipeline
   - Select your repository
   - Choose "Existing Azure Pipelines YAML file"
   - Select `azure-pipelines.yml`
3. **Configure Test Results**: View results in the Test tab
4. **Set Notifications**: Configure pipeline notifications for failures

## References

- [Azure Pipelines Documentation](https://learn.microsoft.com/en-us/azure/devops/pipelines/)
- [Playwright Testing Guide](https://playwright.dev/docs/intro)
- [JUnit Reporter for Playwright](https://playwright.dev/docs/test-reporters#junit-reporter)
