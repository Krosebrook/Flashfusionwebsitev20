#!/usr/bin/env node
/**
 * Production Readiness Audit Tool
 * 
 * Audits software readiness across 10 critical categories for:
 * - Employee/Internal Use
 * - Public Beta
 * - Production-Grade Launch
 * 
 * Usage: node production-readiness-audit.js [options]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  repoPath: process.cwd(),
  deploymentUrl: process.env.DEPLOYMENT_URL || null,
  intendedAudience: process.env.INTENDED_AUDIENCE || 'Unknown',
  handlesPII: process.env.HANDLES_PII === 'true',
  handlesPayments: process.env.HANDLES_PAYMENTS === 'true',
  handlesSecrets: process.env.HANDLES_SECRETS === 'true'
};

// Readiness score thresholds
const READINESS_THRESHOLDS = {
  PRODUCTION_READY: 48,
  PUBLIC_BETA_READY: 43,
  EMPLOYEE_PILOT_READY: 36,
  DEV_PREVIEW: 26,
  PROTOTYPE: 0
};

// Scoring results
const scores = {
  identityAccess: { score: 0, max: 5, findings: [] },
  secretsConfig: { score: 0, max: 5, findings: [] },
  dataSafety: { score: 0, max: 5, findings: [] },
  reliability: { score: 0, max: 5, findings: [] },
  observability: { score: 0, max: 5, findings: [] },
  cicd: { score: 0, max: 5, findings: [] },
  security: { score: 0, max: 5, findings: [] },
  testing: { score: 0, max: 5, findings: [] },
  performance: { score: 0, max: 5, findings: [] },
  documentation: { score: 0, max: 5, findings: [] }
};

const criticalBlockers = [];
const publicLaunchBlockers = [];
const improvements = [];

// Utility functions
function escapeShellArg(arg) {
  // Escape shell argument to prevent command injection
  return "'" + arg.replace(/'/g, "'\\''") + "'";
}

function fileExists(filePath) {
  try {
    return fs.existsSync(path.join(config.repoPath, filePath));
  } catch {
    return false;
  }
}

function readFile(filePath) {
  try {
    return fs.readFileSync(path.join(config.repoPath, filePath), 'utf8');
  } catch {
    return null;
  }
}

function findFiles(pattern, directory = '.') {
  try {
    // Use git ls-files to only search tracked files, excluding node_modules, dist, etc.
    // Pattern needs shell escaping but we pass it as a single argument
    const result = execSync(
      `git ls-files ${directory}`,
      { cwd: config.repoPath, encoding: 'utf8' }
    );
    const files = result.trim().split('\n').filter(f => f);
    // Filter files using JavaScript regex instead of grep for better control
    const regex = new RegExp(pattern);
    return files.filter(f => regex.test(f)).slice(0, 100);
  } catch {
    return [];
  }
}

function searchInFiles(pattern, filePattern = '*') {
  try {
    // Use git grep with extended regex support
    // Pass pattern and filePattern as separate arguments to avoid shell interpretation issues
    const result = execSync(
      `git grep -E '${pattern.replace(/'/g, "'\\''")}' -- '${filePattern.replace(/'/g, "'\\''")}' 2>/dev/null | head -50`,
      { cwd: config.repoPath, encoding: 'utf8' }
    );
    return result.trim().split('\n').filter(line => line);
  } catch {
    return [];
  }
}

function checkGitSecrets() {
  try {
    // Check for potential secrets in git log
    const patterns = ['password', 'secret', 'api_key', 'private_key'];
    for (const pattern of patterns) {
      const escapedPattern = escapeShellArg(pattern);
      const result = execSync(
        `git log --all --oneline -S ${escapedPattern} 2>/dev/null | head -5`,
        { cwd: config.repoPath, encoding: 'utf8' }
      );
      if (result.trim().length > 0) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
}

// Category 1: Identity & Access Control
function auditIdentityAccess() {
  const category = scores.identityAccess;
  let score = 0;
  
  // Check for authentication implementation
  const authFiles = [
    ...findFiles('*auth*.ts'),
    ...findFiles('*auth*.tsx'),
    ...findFiles('*auth*.js')
  ];
  
  if (authFiles.length > 0) {
    score += 1;
    category.findings.push('✓ Authentication files found');
    
    // Check for auth system implementation
    const authContent = authFiles.map(f => readFile(f)).join('\n');
    if (authContent && (
      authContent.includes('login') || 
      authContent.includes('authenticate') ||
      authContent.includes('signIn')
    )) {
      score += 1;
      category.findings.push('✓ Authentication logic implemented');
    } else {
      category.findings.push('✗ Authentication logic unclear or incomplete');
    }
  } else {
    category.findings.push('✗ CRITICAL: No authentication system found');
    criticalBlockers.push('No authentication system - users cannot be identified or protected');
  }
  
  // Check for RBAC
  const rbacPatterns = searchInFiles('role|permission|authorization', '*.ts*');
  if (rbacPatterns.length > 5) {
    score += 1;
    category.findings.push('✓ Role-based access control patterns found');
  } else {
    category.findings.push('✗ No RBAC implementation detected');
    publicLaunchBlockers.push('Missing role-based access control');
  }
  
  // Check for hardcoded credentials - look for actual assignments with values
  const credentialPatterns = [
    ...searchInFiles('password\\s*=\\s*["\']', '*.ts*'),
    ...searchInFiles('api_key\\s*=\\s*["\']', '*.ts*'),
    ...searchInFiles('secret\\s*=\\s*["\']', '*.ts*'),
    ...searchInFiles('API_KEY\\s*=\\s*["\']', '*.ts*'),
    ...searchInFiles('SECRET\\s*=\\s*["\']', '*.ts*')
  ];
  
  if (credentialPatterns.length > 0) {
    category.findings.push('✗ CRITICAL: Potential hardcoded credentials found');
    criticalBlockers.push('Hardcoded credentials detected in source code');
  } else {
    score += 1;
    category.findings.push('✓ No obvious hardcoded credentials');
  }
  
  // Check for least privilege
  const envVarUsage = searchInFiles('process\\.env', '*.ts*');
  if (envVarUsage.length > 0) {
    score += 0.5;
    category.findings.push('⚠ Environment variable usage found (partial credit for config management)');
  } else {
    category.findings.push('✗ No environment-based configuration detected');
  }
  
  category.score = Math.min(score, category.max);
}

// Category 2: Secrets & Configuration Hygiene
function auditSecretsConfig() {
  const category = scores.secretsConfig;
  let score = 0;
  
  // Check for .env file handling
  const hasEnvExample = fileExists('.env.example') || fileExists('.env.template');
  const hasEnvInGitignore = readFile('.gitignore')?.includes('.env');
  
  if (hasEnvExample) {
    score += 1;
    category.findings.push('✓ Environment variable template found');
  } else {
    category.findings.push('✗ No .env.example or .env.template found');
    improvements.push('Create .env.example to document required environment variables');
  }
  
  if (hasEnvInGitignore) {
    score += 1;
    category.findings.push('✓ .env files excluded from git');
  } else {
    category.findings.push('✗ CRITICAL: .env files may not be gitignored');
    criticalBlockers.push('.env files not properly gitignored - secrets may be committed');
  }
  
  // Check if secrets are committed
  const hasEnvFile = fileExists('.env');
  if (hasEnvFile) {
    category.findings.push('✗ WARNING: .env file exists in working directory');
  }
  
  const secretsInGit = checkGitSecrets();
  if (secretsInGit) {
    category.findings.push('✗ CRITICAL: Potential secrets found in git history');
    criticalBlockers.push('Secrets detected in git history - requires remediation');
    score -= 1;
  } else {
    score += 1;
    category.findings.push('✓ No obvious secrets in git history');
  }
  
  // Check for configuration documentation
  const configDocs = [
    fileExists('SETUP.md'),
    fileExists('CONFIGURATION.md'),
    fileExists('README.md') && readFile('README.md')?.includes('environment')
  ];
  
  if (configDocs.some(exists => exists)) {
    score += 1;
    category.findings.push('✓ Configuration documentation exists');
  } else {
    category.findings.push('✗ No configuration documentation found');
    improvements.push('Document all required environment variables and configuration');
  }
  
  // Check for secret rotation capability
  const hasSecretsManager = searchInFiles('secrets-manager|vault|aws-secrets', '*.ts*');
  if (hasSecretsManager.length > 0) {
    score += 1;
    category.findings.push('✓ Secrets manager integration detected');
  } else {
    category.findings.push('✗ No secrets manager integration - rotation difficult');
    publicLaunchBlockers.push('No automated secrets rotation capability');
  }
  
  category.score = Math.min(Math.max(score, 0), category.max);
}

// Category 3: Data Safety & Privacy
function auditDataSafety() {
  const category = scores.dataSafety;
  let score = 0;
  
  // Check data storage implementation
  const databaseFiles = [
    ...findFiles('*database*', '.'),
    ...findFiles('*prisma*', '.'),
    ...findFiles('*supabase*', '.')
  ];
  
  if (databaseFiles.length > 0) {
    score += 1;
    category.findings.push('✓ Database configuration found');
    
    // Check for encryption
    const encryptionRefs = searchInFiles('encrypt|cipher|crypto', '*.ts*');
    if (encryptionRefs.length > 0) {
      score += 1;
      category.findings.push('✓ Encryption references found');
    } else {
      category.findings.push('✗ No encryption implementation detected');
      if (config.handlesPII) {
        criticalBlockers.push('No data encryption detected while handling PII');
      }
    }
  } else {
    category.findings.push('⚠ UNVERIFIED: Data storage location unclear');
  }
  
  // Check for backup strategy
  const backupDocs = searchInFiles('backup|restore|disaster recovery', '*.md');
  if (backupDocs.length > 0) {
    score += 1;
    category.findings.push('✓ Backup strategy documented');
  } else {
    category.findings.push('✗ No backup strategy documented');
    publicLaunchBlockers.push('No documented backup and recovery strategy');
  }
  
  // Check for data retention policy
  const retentionRefs = searchInFiles('retention|delete.*data|gdpr', '*.md');
  if (retentionRefs.length > 0) {
    score += 1;
    category.findings.push('✓ Data retention considerations found');
  } else {
    category.findings.push('✗ No data retention policy defined');
    if (config.handlesPII) {
      publicLaunchBlockers.push('No data retention policy for PII');
    }
  }
  
  // PII handling check
  if (config.handlesPII) {
    const piiRefs = searchInFiles('pii|personal.*data|privacy', '*.ts*');
    if (piiRefs.length > 0) {
      score += 0.5;
      category.findings.push('⚠ PII handling code detected - needs manual review');
    } else {
      category.findings.push('✗ CRITICAL: Handles PII but no privacy controls detected');
      criticalBlockers.push('PII handling without proper privacy controls');
    }
  }
  
  category.score = Math.min(score, category.max);
}

// Category 4: Reliability & Error Handling
function auditReliability() {
  const category = scores.reliability;
  let score = 0;
  
  // Check for error handling
  const errorHandling = [
    ...searchInFiles('try.*catch', '*.ts*'),
    ...searchInFiles('catch.*error', '*.ts*')
  ];
  
  if (errorHandling.length > 10) {
    score += 1;
    category.findings.push('✓ Error handling implementation found');
  } else if (errorHandling.length > 0) {
    score += 0.5;
    category.findings.push('⚠ Limited error handling detected');
  } else {
    category.findings.push('✗ CRITICAL: No error handling found');
    criticalBlockers.push('No error handling - application will crash on errors');
  }
  
  // Check for timeouts
  const timeoutRefs = searchInFiles('timeout|setTimeout', '*.ts*');
  if (timeoutRefs.length > 5) {
    score += 1;
    category.findings.push('✓ Timeout handling implemented');
  } else {
    category.findings.push('✗ No timeout handling - requests may hang indefinitely');
    improvements.push('Add timeout handling for all external requests');
  }
  
  // Check for retry logic
  const retryRefs = searchInFiles('retry|retries', '*.ts*');
  if (retryRefs.length > 0) {
    score += 1;
    category.findings.push('✓ Retry logic detected');
  } else {
    category.findings.push('✗ No retry logic - failures not handled gracefully');
    improvements.push('Implement retry logic for transient failures');
  }
  
  // Check for circuit breakers or fail-safe logic
  const circuitBreakerRefs = searchInFiles('circuit.*breaker|fallback|failsafe', '*.ts*');
  if (circuitBreakerRefs.length > 0) {
    score += 2;
    category.findings.push('✓ Advanced resilience patterns detected');
  } else {
    category.findings.push('✗ No circuit breaker or fail-safe patterns');
    publicLaunchBlockers.push('No fail-safe mechanisms for production resilience');
  }
  
  category.score = Math.min(score, category.max);
}

// Category 5: Observability & Monitoring
function auditObservability() {
  const category = scores.observability;
  let score = 0;
  
  // Check for logging
  const loggingRefs = [
    ...searchInFiles('console\\.log|logger|winston|pino', '*.ts*'),
    ...searchInFiles('log\\(|info\\(|error\\(', '*.ts*')
  ];
  
  if (loggingRefs.length > 20) {
    score += 1;
    category.findings.push('✓ Logging implementation found');
  } else if (loggingRefs.length > 0) {
    score += 0.5;
    category.findings.push('⚠ Limited logging detected');
  } else {
    category.findings.push('✗ CRITICAL: No logging implementation');
    criticalBlockers.push('No logging - impossible to debug production issues');
  }
  
  // Check for structured logging
  const structuredLogging = searchInFiles('JSON\\.stringify.*log|structured.*log', '*.ts*');
  if (structuredLogging.length > 0) {
    score += 1;
    category.findings.push('✓ Structured logging detected');
  } else {
    category.findings.push('✗ No structured logging - difficult to query logs');
    improvements.push('Implement structured logging for better observability');
  }
  
  // Check for error tracking
  const errorTracking = searchInFiles('sentry|bugsnag|rollbar|error.*tracking', '*.ts*');
  if (errorTracking.length > 0) {
    score += 1;
    category.findings.push('✓ Error tracking service integrated');
  } else {
    category.findings.push('✗ No error tracking service');
    publicLaunchBlockers.push('No error tracking - cannot monitor production errors');
  }
  
  // Check for metrics
  const metricsRefs = searchInFiles('metrics|prometheus|datadog|cloudwatch', '*.ts*');
  if (metricsRefs.length > 0) {
    score += 1;
    category.findings.push('✓ Metrics collection detected');
  } else {
    category.findings.push('✗ No metrics collection');
    publicLaunchBlockers.push('No metrics - cannot monitor performance');
  }
  
  // Check for alerts
  const alertDocs = searchInFiles('alert|pagerduty|opsgenie|oncall', '*.md');
  if (alertDocs.length > 0) {
    score += 1;
    category.findings.push('✓ Alerting strategy documented');
  } else {
    category.findings.push('✗ No alerting strategy');
    publicLaunchBlockers.push('No alerting - team unaware of production issues');
  }
  
  category.score = Math.min(score, category.max);
}

// Category 6: CI/CD & Deployment Safety
function auditCICD() {
  const category = scores.cicd;
  let score = 0;
  
  // Check for CI configuration
  const ciConfigs = [
    fileExists('.github/workflows'),
    fileExists('.gitlab-ci.yml'),
    fileExists('.circleci/config.yml'),
    fileExists('Jenkinsfile')
  ];
  
  if (ciConfigs.some(exists => exists)) {
    score += 1;
    category.findings.push('✓ CI/CD configuration found');
    
    // Check if tests run in CI
    const workflowFiles = findFiles('*.yml', '.github/workflows');
    const workflowContent = workflowFiles.map(f => readFile(f)).join('\n');
    
    if (workflowContent && workflowContent.includes('test')) {
      score += 1;
      category.findings.push('✓ Tests run in CI pipeline');
    } else {
      category.findings.push('✗ Tests not executed in CI');
      improvements.push('Add test execution to CI pipeline');
    }
    
    if (workflowContent && (workflowContent.includes('lint') || workflowContent.includes('eslint'))) {
      score += 1;
      category.findings.push('✓ Linting in CI pipeline');
    } else {
      category.findings.push('✗ No linting in CI');
      improvements.push('Add linting to CI pipeline');
    }
    
    if (workflowContent && workflowContent.includes('build')) {
      score += 1;
      category.findings.push('✓ Build verification in CI');
    } else {
      category.findings.push('✗ No build verification in CI');
    }
  } else {
    category.findings.push('✗ CRITICAL: No CI/CD pipeline found');
    criticalBlockers.push('No CI/CD pipeline - no automated quality checks');
  }
  
  // Check for rollback strategy
  const deploymentDocs = readFile('DEPLOYMENT.md') || readFile('README.md');
  if (deploymentDocs && (deploymentDocs.includes('rollback') || deploymentDocs.includes('revert'))) {
    score += 1;
    category.findings.push('✓ Rollback strategy documented');
  } else {
    category.findings.push('✗ No rollback strategy documented');
    publicLaunchBlockers.push('No documented rollback procedure');
  }
  
  category.score = Math.min(score, category.max);
}

// Category 7: Security Hardening
function auditSecurity() {
  const category = scores.security;
  let score = 0;
  
  // Check for input validation
  const validationRefs = [
    ...searchInFiles('validate|validation|zod|joi|yup', '*.ts*'),
    ...searchInFiles('sanitize|escape|xss', '*.ts*')
  ];
  
  if (validationRefs.length > 10) {
    score += 1;
    category.findings.push('✓ Input validation implementation found');
  } else if (validationRefs.length > 0) {
    score += 0.5;
    category.findings.push('⚠ Limited input validation detected');
  } else {
    category.findings.push('✗ CRITICAL: No input validation detected');
    criticalBlockers.push('No input validation - vulnerable to injection attacks');
  }
  
  // Check for rate limiting
  const rateLimitRefs = searchInFiles('rate.*limit|throttle', '*.ts*');
  if (rateLimitRefs.length > 0) {
    score += 1;
    category.findings.push('✓ Rate limiting detected');
  } else {
    category.findings.push('✗ No rate limiting - vulnerable to abuse');
    publicLaunchBlockers.push('No rate limiting - vulnerable to DoS attacks');
  }
  
  // Check for CORS configuration
  const corsRefs = searchInFiles('cors', '*.ts*');
  if (corsRefs.length > 0) {
    score += 1;
    category.findings.push('✓ CORS configuration found');
  } else {
    category.findings.push('⚠ No CORS configuration detected');
  }
  
  // Check for CSP headers
  const cspRefs = searchInFiles('content.*security.*policy|csp', '*.ts*');
  if (cspRefs.length > 0) {
    score += 1;
    category.findings.push('✓ Content Security Policy detected');
  } else {
    category.findings.push('✗ No CSP headers - vulnerable to XSS');
    publicLaunchBlockers.push('No Content Security Policy configured');
  }
  
  // Check for dependency scanning
  const securityChecks = [
    fileExists('package-lock.json') || fileExists('yarn.lock') || fileExists('pnpm-lock.yaml'),
    searchInFiles('audit|snyk|dependabot', '.github/**/*.yml').length > 0 || 
    searchInFiles('audit|snyk|dependabot', '.github/**/*.yaml').length > 0
  ];
  
  if (securityChecks[1]) {
    score += 1;
    category.findings.push('✓ Dependency scanning enabled');
  } else if (securityChecks[0]) {
    score += 0.5;
    category.findings.push('⚠ Lock file present but no automated scanning');
    improvements.push('Enable Dependabot or similar for dependency scanning');
  } else {
    category.findings.push('✗ No dependency management or scanning');
  }
  
  category.score = Math.min(score, category.max);
}

// Category 8: Testing Coverage
function auditTesting() {
  const category = scores.testing;
  let score = 0;
  
  // Check for test files
  const testFiles = [
    ...findFiles('*.test.ts*', '.'),
    ...findFiles('*.spec.ts*', '.'),
    ...findFiles('*.test.js*', '.')
  ];
  
  if (testFiles.length > 20) {
    score += 2;
    category.findings.push(`✓ Strong test coverage (${testFiles.length} test files)`);
  } else if (testFiles.length > 5) {
    score += 1;
    category.findings.push(`⚠ Moderate test coverage (${testFiles.length} test files)`);
  } else if (testFiles.length > 0) {
    score += 0.5;
    category.findings.push(`⚠ Limited test coverage (${testFiles.length} test files)`);
  } else {
    category.findings.push('✗ CRITICAL: No tests found');
    criticalBlockers.push('No tests - no confidence in code quality');
  }
  
  // Check for different test types
  const integrationTests = searchInFiles('integration.*test|e2e', '*.test.*');
  if (integrationTests.length > 0) {
    score += 1;
    category.findings.push('✓ Integration tests detected');
  } else {
    category.findings.push('✗ No integration tests');
    improvements.push('Add integration tests for critical user flows');
  }
  
  // Check for test coverage reporting
  const packageJson = readFile('package.json');
  if (packageJson && packageJson.includes('coverage')) {
    score += 1;
    category.findings.push('✓ Test coverage reporting configured');
  } else {
    category.findings.push('✗ No test coverage reporting');
    improvements.push('Configure test coverage reporting');
  }
  
  // Check for smoke tests
  const smokeTests = searchInFiles('smoke.*test|health.*check', '*.*');
  if (smokeTests.length > 0) {
    score += 1;
    category.findings.push('✓ Smoke/health check tests found');
  } else {
    category.findings.push('✗ No smoke tests for deployment validation');
    publicLaunchBlockers.push('No smoke tests to validate deployments');
  }
  
  category.score = Math.min(score, category.max);
}

// Category 9: Performance & Cost Controls
function auditPerformance() {
  const category = scores.performance;
  let score = 0;
  
  // Check for rate limiting (already checked in security but relevant here)
  const rateLimitRefs = searchInFiles('rate.*limit|throttle', '*.ts*');
  if (rateLimitRefs.length > 0) {
    score += 1;
    category.findings.push('✓ API rate limits implemented');
  } else {
    category.findings.push('✗ No API rate limits - uncontrolled costs');
    improvements.push('Implement rate limiting to control costs');
  }
  
  // Check for resource limits
  const resourceLimits = searchInFiles('max.*connections|pool.*size|memory.*limit', '*.ts*');
  if (resourceLimits.length > 0) {
    score += 1;
    category.findings.push('✓ Resource limits configured');
  } else {
    category.findings.push('✗ No resource limits - risk of resource exhaustion');
  }
  
  // Check for caching
  const cachingRefs = searchInFiles('cache|redis|memcache', '*.ts*');
  if (cachingRefs.length > 0) {
    score += 1;
    category.findings.push('✓ Caching implementation detected');
  } else {
    category.findings.push('✗ No caching - poor performance and high costs');
    improvements.push('Implement caching for frequently accessed data');
  }
  
  // Check for performance budgets
  const perfBudgets = searchInFiles('performance.*budget|lighthouse', '*.md');
  if (perfBudgets.length > 0) {
    score += 1;
    category.findings.push('✓ Performance budgets defined');
  } else {
    category.findings.push('✗ No performance budgets');
  }
  
  // Check for monitoring
  const perfMonitoring = searchInFiles('performance.*monitoring|apm|new.*relic', '*.ts*');
  if (perfMonitoring.length > 0) {
    score += 1;
    category.findings.push('✓ Performance monitoring configured');
  } else {
    category.findings.push('✗ No performance monitoring');
    publicLaunchBlockers.push('No performance monitoring for production');
  }
  
  category.score = Math.min(score, category.max);
}

// Category 10: Documentation & Operational Readiness
function auditDocumentation() {
  const category = scores.documentation;
  let score = 0;
  
  // Check for README
  const readme = readFile('README.md');
  if (readme && readme.length > 200) {
    score += 1;
    category.findings.push('✓ README exists and has content');
    
    // Check for setup instructions
    if (readme.includes('install') || readme.includes('setup')) {
      score += 1;
      category.findings.push('✓ Setup instructions in README');
    } else {
      category.findings.push('✗ No setup instructions in README');
    }
  } else {
    category.findings.push('✗ README missing or insufficient');
    improvements.push('Create comprehensive README with setup instructions');
  }
  
  // Check for operational documentation
  const operationalDocs = [
    fileExists('RUNBOOK.md'),
    fileExists('OPERATIONS.md'),
    fileExists('DEPLOYMENT.md')
  ];
  
  if (operationalDocs.filter(exists => exists).length >= 2) {
    score += 2;
    category.findings.push('✓ Comprehensive operational documentation');
  } else if (operationalDocs.some(exists => exists)) {
    score += 1;
    category.findings.push('⚠ Some operational documentation exists');
  } else {
    category.findings.push('✗ No operational documentation');
    publicLaunchBlockers.push('No runbook or operational procedures');
  }
  
  // Check for incident procedures
  const incidentDocs = searchInFiles('incident|oncall|escalation', '*.md');
  if (incidentDocs.length > 0) {
    score += 1;
    category.findings.push('✓ Incident procedures documented');
  } else {
    category.findings.push('✗ No incident response procedures');
    publicLaunchBlockers.push('No incident response procedures');
  }
  
  category.score = Math.min(score, category.max);
}

// Runtime checks
async function performRuntimeChecks() {
  if (!config.deploymentUrl) {
    return {
      status: 'SKIPPED',
      findings: ['No deployment URL provided - runtime checks skipped']
    };
  }
  
  const findings = [];
  
  try {
    // Validate and escape deployment URL
    if (!config.deploymentUrl || typeof config.deploymentUrl !== 'string') {
      return {
        status: 'SKIPPED',
        findings: ['No deployment URL provided - runtime checks skipped']
      };
    }
    
    // Basic URL validation
    try {
      new URL(config.deploymentUrl);
    } catch {
      return {
        status: 'FAILED',
        findings: ['Invalid deployment URL provided']
      };
    }
    
    const escapedUrl = escapeShellArg(config.deploymentUrl);
    
    // Use curl since fetch might not be available
    const result = execSync(
      `curl -s -o /dev/null -w "%{http_code}|%{time_total}" -L -m 10 ${escapedUrl}`,
      { encoding: 'utf8' }
    );
    
    const [statusCode, curlTime] = result.trim().split('|');
    const responseTime = Math.round(parseFloat(curlTime) * 1000);
    
    findings.push(`HTTP Status: ${statusCode}`);
    findings.push(`Response Time: ${responseTime}ms`);
    
    if (statusCode === '200') {
      findings.push('✓ Site is accessible');
    } else if (statusCode.startsWith('3')) {
      findings.push('⚠ Site redirects');
    } else if (statusCode.startsWith('4')) {
      findings.push('✗ Client error (4xx)');
    } else if (statusCode.startsWith('5')) {
      findings.push('✗ Server error (5xx)');
    } else {
      findings.push('✗ Unexpected status code');
    }
    
    if (responseTime > 3000) {
      findings.push('✗ SLOW: Response time > 3s');
    } else if (responseTime > 1000) {
      findings.push('⚠ Response time > 1s');
    } else {
      findings.push('✓ Good response time');
    }
    
    // Check headers
    const headers = execSync(
      `curl -s -I -L -m 10 ${escapedUrl}`,
      { encoding: 'utf8' }
    );
    
    if (headers.includes('x-frame-options') || headers.includes('X-Frame-Options')) {
      findings.push('✓ X-Frame-Options header present');
    } else {
      findings.push('✗ Missing X-Frame-Options header');
    }
    
    if (headers.includes('strict-transport-security') || headers.includes('Strict-Transport-Security')) {
      findings.push('✓ HSTS header present');
    } else {
      findings.push('✗ Missing HSTS header');
    }
    
    if (headers.includes('content-security-policy') || headers.includes('Content-Security-Policy')) {
      findings.push('✓ CSP header present');
    } else {
      findings.push('✗ Missing CSP header');
    }
    
    return {
      status: 'COMPLETED',
      findings
    };
  } catch (error) {
    return {
      status: 'FAILED',
      findings: [
        'Runtime checks failed',
        `Error: ${error.message}`
      ]
    };
  }
}

// Calculate readiness level
function calculateReadinessLevel(totalScore) {
  if (totalScore >= READINESS_THRESHOLDS.PRODUCTION_READY) return 'Production Ready';
  if (totalScore >= READINESS_THRESHOLDS.PUBLIC_BETA_READY) return 'Public Beta Ready';
  if (totalScore >= READINESS_THRESHOLDS.EMPLOYEE_PILOT_READY) return 'Employee Pilot Ready (with conditions)';
  if (totalScore >= READINESS_THRESHOLDS.DEV_PREVIEW) return 'Dev Preview';
  return 'Prototype';
}

// Generate report
function generateReport(runtimeResults) {
  const totalScore = Object.values(scores).reduce((sum, cat) => sum + cat.score, 0);
  const maxScore = Object.values(scores).reduce((sum, cat) => sum + cat.max, 0);
  const readinessLevel = calculateReadinessLevel(totalScore);
  
  console.log('\n' + '='.repeat(80));
  console.log('PRODUCTION READINESS AUDIT REPORT');
  console.log('='.repeat(80));
  console.log(`\nRepository: ${config.repoPath}`);
  console.log(`Deployment URL: ${config.deploymentUrl || 'Not provided'}`);
  console.log(`Intended Audience: ${config.intendedAudience}`);
  console.log(`Handles PII: ${config.handlesPII ? 'YES' : 'NO'}`);
  console.log(`Handles Payments: ${config.handlesPayments ? 'YES' : 'NO'}`);
  console.log(`Handles Secrets: ${config.handlesSecrets ? 'YES' : 'NO'}`);
  console.log(`Audit Date: ${new Date().toISOString()}`);
  
  // SECTION A - Scorecard Table
  console.log('\n' + '='.repeat(80));
  console.log('SECTION A — SCORECARD TABLE');
  console.log('='.repeat(80));
  console.log('\n┌─────────────────────────────────────────────┬───────┬─────────┐');
  console.log('│ Category                                    │ Score │ Max     │');
  console.log('├─────────────────────────────────────────────┼───────┼─────────┤');
  
  const categories = [
    ['1. Identity & Access Control', scores.identityAccess],
    ['2. Secrets & Configuration Hygiene', scores.secretsConfig],
    ['3. Data Safety & Privacy', scores.dataSafety],
    ['4. Reliability & Error Handling', scores.reliability],
    ['5. Observability & Monitoring', scores.observability],
    ['6. CI/CD & Deployment Safety', scores.cicd],
    ['7. Security Hardening', scores.security],
    ['8. Testing Coverage', scores.testing],
    ['9. Performance & Cost Controls', scores.performance],
    ['10. Documentation & Operational Readiness', scores.documentation]
  ];
  
  categories.forEach(([name, cat]) => {
    const scorePadded = cat.score.toFixed(1).padStart(5);
    const maxPadded = cat.max.toString().padStart(7);
    const namePadded = name.padEnd(43);
    console.log(`│ ${namePadded} │ ${scorePadded} │ ${maxPadded} │`);
  });
  
  console.log('├─────────────────────────────────────────────┼───────┼─────────┤');
  console.log(`│ ${'TOTAL SCORE'.padEnd(43)} │ ${totalScore.toFixed(1).padStart(5)} │ ${maxScore.toString().padStart(7)} │`);
  console.log('└─────────────────────────────────────────────┴───────┴─────────┘');
  
  // SECTION B - Detailed Findings
  console.log('\n' + '='.repeat(80));
  console.log('SECTION B — DETAILED FINDINGS');
  console.log('='.repeat(80));
  
  categories.forEach(([name, cat]) => {
    console.log(`\n${name} [${cat.score.toFixed(1)}/${cat.max}]`);
    console.log('-'.repeat(80));
    cat.findings.forEach(finding => console.log(`  ${finding}`));
  });
  
  // Runtime Checks
  if (runtimeResults) {
    console.log('\n' + '-'.repeat(80));
    console.log('RUNTIME CHECKS');
    console.log('-'.repeat(80));
    console.log(`Status: ${runtimeResults.status}`);
    runtimeResults.findings.forEach(finding => console.log(`  ${finding}`));
  }
  
  // SECTION C - Blockers
  console.log('\n' + '='.repeat(80));
  console.log('SECTION C — BLOCKERS');
  console.log('='.repeat(80));
  
  console.log('\nCRITICAL BLOCKERS (Must fix before employee use):');
  console.log('-'.repeat(80));
  if (criticalBlockers.length === 0) {
    console.log('  ✓ None identified');
  } else {
    criticalBlockers.forEach((blocker, i) => {
      console.log(`  ${i + 1}. ${blocker}`);
    });
  }
  
  console.log('\nPUBLIC LAUNCH BLOCKERS (Must fix before public release):');
  console.log('-'.repeat(80));
  if (publicLaunchBlockers.length === 0) {
    console.log('  ✓ None identified');
  } else {
    publicLaunchBlockers.forEach((blocker, i) => {
      console.log(`  ${i + 1}. ${blocker}`);
    });
  }
  
  // SECTION D - Readiness Verdict
  console.log('\n' + '='.repeat(80));
  console.log('SECTION D — READINESS VERDICT');
  console.log('='.repeat(80));
  console.log(`\nTotal Score: ${totalScore.toFixed(1)}/${maxScore}`);
  console.log(`Readiness Level: ${readinessLevel}`);
  console.log('\nScore Interpretation:');
  console.log('  0-25  → Prototype');
  console.log('  26-35 → Dev Preview');
  console.log('  36-42 → Employee Pilot Ready (with conditions)');
  console.log('  43-47 → Public Beta Ready');
  console.log('  48-50 → Production Ready');
  
  // SECTION E - Immediate Action Plan
  console.log('\n' + '='.repeat(80));
  console.log('SECTION E — IMMEDIATE ACTION PLAN');
  console.log('='.repeat(80));
  console.log('\nTop 5 Highest-Leverage Improvements (prioritized by impact):');
  console.log('-'.repeat(80));
  
  // Select top 5 improvements
  const topImprovements = improvements.slice(0, 5);
  if (topImprovements.length === 0) {
    console.log('  ✓ System is in good shape - focus on addressing blockers');
  } else {
    topImprovements.forEach((improvement, i) => {
      console.log(`  ${i + 1}. ${improvement}`);
    });
  }
  
  // PHASE 4 - Executive Summary
  console.log('\n' + '='.repeat(80));
  console.log('EXECUTIVE SUMMARY');
  console.log('='.repeat(80));
  
  const safeForEmployees = criticalBlockers.length === 0 && totalScore >= 36;
  const safeForCustomers = criticalBlockers.length === 0 && publicLaunchBlockers.length === 0 && totalScore >= 43;
  
  console.log('\n📊 Is this safe for employees?');
  console.log(`   ${safeForEmployees ? '✓ YES' : '✗ NO'} - ${
    safeForEmployees 
      ? 'Ready for internal pilot with monitoring' 
      : 'Critical issues must be addressed first'
  }`);
  
  console.log('\n👥 Is this safe for customers?');
  console.log(`   ${safeForCustomers ? '✓ YES' : '✗ NO'} - ${
    safeForCustomers 
      ? 'Ready for public beta with proper monitoring' 
      : 'Multiple production blockers must be resolved'
  }`);
  
  console.log('\n⚠️  What would break first under real usage?');
  if (scores.reliability.score < 3) {
    console.log('   → Application crashes due to poor error handling');
  } else if (scores.performance.score < 3) {
    console.log('   → Performance degradation and potential outages');
  } else if (scores.observability.score < 3) {
    console.log('   → Unable to diagnose issues - flying blind');
  } else {
    console.log('   → System should handle moderate load with monitoring');
  }
  
  console.log('\n🔒 What would scare a security review?');
  const securityConcerns = [];
  if (scores.identityAccess.score < 3) securityConcerns.push('Weak authentication');
  if (scores.secretsConfig.score < 3) securityConcerns.push('Secrets management issues');
  if (scores.security.score < 3) securityConcerns.push('Missing security hardening');
  if (config.handlesPII && scores.dataSafety.score < 4) securityConcerns.push('Inadequate PII protection');
  
  if (securityConcerns.length === 0) {
    console.log('   → Security posture is reasonable with some improvements needed');
  } else {
    console.log('   → ' + securityConcerns.join(', '));
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('END OF AUDIT REPORT');
  console.log('='.repeat(80) + '\n');
}

// Main execution
async function main() {
  console.log('Starting Production Readiness Audit...\n');
  
  console.log('PHASE 1 — REPOSITORY & DEPLOYMENT AUDIT');
  console.log('Analyzing repository structure and configuration...\n');
  
  auditIdentityAccess();
  auditSecretsConfig();
  auditDataSafety();
  auditReliability();
  auditObservability();
  auditCICD();
  auditSecurity();
  auditTesting();
  auditPerformance();
  auditDocumentation();
  
  console.log('PHASE 2 — RUNTIME CHECKS');
  const runtimeResults = await performRuntimeChecks();
  
  console.log('\nPHASE 3 — READINESS CLASSIFICATION');
  console.log('Calculating overall readiness score...\n');
  
  console.log('PHASE 4 — GENERATING COMPREHENSIVE REPORT');
  generateReport(runtimeResults);
}

// Run audit
main().catch(error => {
  console.error('Audit failed with error:', error);
  process.exit(1);
});
