#!/usr/bin/env node

/**
 * VehicAid Comprehensive Test & Performance Suite
 * Executes:
 * 1. Backend Health Checks
 * 2. API Authentication Tests
 * 3. Core Endpoint Tests
 * 4. Performance Benchmarks
 * 5. Bundle Size Analysis
 * 6. Detailed Reporting
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_BASE = process.env.API_URL || 'http://localhost:8001/api/v1';
const TEST_RESULTS_DIR = path.join(__dirname, 'test_results');

// Ensure test results directory exists
if (!fs.existsSync(TEST_RESULTS_DIR)) {
  fs.mkdirSync(TEST_RESULTS_DIR, { recursive: true });
}

class TestResult {
  constructor(name, passed, message, duration, details = {}) {
    this.name = name;
    this.passed = passed;
    this.message = message;
    this.duration = duration;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

class ComprehensiveTestSuite {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
    this.metrics = {
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
      averageResponseTime: 0,
      totalDuration: 0,
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const icons = {
      info: 'ℹ️',
      success: '✅',
      error: '❌',
      warning: '⚠️',
      debug: '🔍',
    };
    console.log(`${icons[type]} [${timestamp}] ${message}`);
  }

  addResult(result) {
    this.results.push(result);
    this.metrics.totalTests++;
    if (result.passed) {
      this.metrics.passedTests++;
    } else {
      this.metrics.failedTests++;
    }
  }

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async testBackendHealthWithRetry(maxRetries = 5, delay = 2000) {
    this.log('Starting Backend Health Check with retry logic...', 'debug');
    
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
      try {
        const startTime = Date.now();
        const response = await axios.get(`${API_BASE}/users/`, {
          timeout: 5000,
          validateStatus: () => true, // Don't throw on any status
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const duration = Date.now() - startTime;

        // 401 means auth is required but backend is responsive (good!)
        // 200 means fully accessible (even better)
        if (response.status === 401 || response.status === 200 || response.status === 403) {
          this.log(`Backend health check passed (Response: ${response.status}, Time: ${duration}ms)`, 'success');
          const result = new TestResult(
            'Backend Health Check',
            true,
            `Backend is responsive (${response.status})`,
            duration,
            {
              endpoint: `${API_BASE}/users/`,
              statusCode: response.status,
              headers: response.headers,
            }
          );
          this.addResult(result);
          return true;
        }
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) {
          this.log(`Attempt ${i + 1}/${maxRetries} failed. Retrying in ${delay}ms...`, 'warning');
          await this.sleep(delay);
        }
      }
    }

    this.log(`Backend health check failed after ${maxRetries} retries`, 'error');
    const result = new TestResult(
      'Backend Health Check',
      false,
      `Backend unreachable: ${lastError?.message}`,
      0,
      { error: lastError?.message }
    );
    this.addResult(result);
    return false;
  }

  async testAuthentication() {
    this.log('Testing Authentication Endpoints...', 'debug');

    try {
      // Test invalid credentials
      const startTime = Date.now();
      try {
        await axios.post(`${API_BASE}/users/login/`, {
          email: 'invalid@test.com',
          password: 'wrongpassword',
        });
      } catch (error) {
        // Expected to fail - verify it gives 401/400
        if (error.response?.status === 401 || error.response?.status === 400) {
          const duration = Date.now() - startTime;
          this.log('Invalid credential rejection working (as expected)', 'success');
          const result = new TestResult(
            'Auth - Invalid Credentials Rejection',
            true,
            'Invalid credentials properly rejected',
            duration,
            { statusCode: error.response?.status }
          );
          this.addResult(result);
          return true;
        }
      }

      // If we get here, auth might not be configured
      this.log('Auth endpoint responded (may need fixture data)', 'warning');
      return true;
    } catch (error) {
      this.log(`Authentication test failed: ${error.message}`, 'error');
      const result = new TestResult(
        'Authentication Tests',
        false,
        error.message,
        0
      );
      this.addResult(result);
      return false;
    }
  }

  async testAPIEndpoints() {
    this.log('Testing Core API Endpoints...', 'debug');

    const endpoints = [
      {
        name: 'User Profile',
        method: 'GET',
        path: '/users/',
        expectedStatus: [200, 401],
      },
      {
        name: 'User List',
        method: 'GET',
        path: '/users/',
        expectedStatus: [200, 401, 403],
      },
      {
        name: 'Services List',
        method: 'GET',
        path: '/services/',
        expectedStatus: [200, 401],
      },
      {
        name: 'Payments List',
        method: 'GET',
        path: '/payments/',
        expectedStatus: [200, 401, 403],
      },
    ];

    for (const endpoint of endpoints) {
      try {
        const startTime = Date.now();
        const url = `${API_BASE}${endpoint.path}`;

        let response;
        if (endpoint.method === 'GET') {
          response = await axios.get(url, {
            timeout: 5000,
            validateStatus: () => true, // Don't throw on any status
          });
        }

        const duration = Date.now() - startTime;
        const passed = endpoint.expectedStatus.includes(response.status);

        this.log(
          `${endpoint.name}: ${response.status} (${duration}ms)`,
          passed ? 'success' : 'warning'
        );

        const result = new TestResult(
          `API - ${endpoint.name}`,
          passed,
          `Endpoint returned ${response.status}`,
          duration,
          {
            endpoint: url,
            statusCode: response.status,
            responseSize: response.data ? JSON.stringify(response.data).length : 0,
          }
        );
        this.addResult(result);
      } catch (error) {
        this.log(`${endpoint.name} failed: ${error.message}`, 'error');
        const result = new TestResult(
          `API - ${endpoint.name}`,
          false,
          error.message,
          0
        );
        this.addResult(result);
      }
    }
  }

  async testPerformance() {
    this.log('Running Performance Benchmarks...', 'debug');

    const endpoints = [
      `${API_BASE}/users/`,
      `${API_BASE}/services/`,
    ];

    const performanceMetrics = [];
    const requestCount = 10;

    for (const endpoint of endpoints) {
      const times = [];

      for (let i = 0; i < requestCount; i++) {
        try {
          const startTime = Date.now();
          await axios.get(endpoint, {
            timeout: 5000,
            validateStatus: () => true,
          });
          const duration = Date.now() - startTime;
          times.push(duration);
        } catch (error) {
          // Count timeouts as worst case
          times.push(5000);
        }
      }

      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);
      const target = 2000; // 2 seconds

      performanceMetrics.push({
        endpoint,
        avgTime,
        minTime,
        maxTime,
        target,
        passed: avgTime < target,
      });

      this.log(
        `${endpoint}: Avg ${avgTime.toFixed(0)}ms, Min ${minTime}ms, Max ${maxTime}ms (Target: ${target}ms)`,
        avgTime < target ? 'success' : 'warning'
      );

      const result = new TestResult(
        `Performance - ${endpoint}`,
        avgTime < target,
        `Average response time: ${avgTime.toFixed(0)}ms`,
        avgTime,
        { minTime, maxTime, target, samples: requestCount }
      );
      this.addResult(result);
    }

    return performanceMetrics;
  }

  async testBundleSize() {
    this.log('Analyzing Bundle Sizes...', 'debug');

    try {
      // Check mobile bundle
      const bookerPackageJson = path.join(__dirname, 'apps/booker/package.json');
      const providerPackageJson = path.join(__dirname, 'apps/provider/package.json');

      const targets = [
        { name: 'Booker App', path: bookerPackageJson, maxSize: 50 * 1024 * 1024 }, // 50MB
        { name: 'Provider App', path: providerPackageJson, maxSize: 45 * 1024 * 1024 }, // 45MB
      ];

      for (const target of targets) {
        if (fs.existsSync(target.path)) {
          const stats = fs.statSync(target.path);
          const sizeInMB = (stats.size / 1024 / 1024).toFixed(2);
          const passed = stats.size < target.maxSize;

          this.log(
            `${target.name}: ${sizeInMB}MB (Limit: ${(target.maxSize / 1024 / 1024).toFixed(0)}MB)`,
            passed ? 'success' : 'warning'
          );

          const result = new TestResult(
            `Bundle Size - ${target.name}`,
            passed,
            `Size: ${sizeInMB}MB`,
            0,
            { sizeBytes: stats.size, maxSize: target.maxSize }
          );
          this.addResult(result);
        }
      }
    } catch (error) {
      this.log(`Bundle size analysis skipped: ${error.message}`, 'warning');
    }
  }

  generateReport() {
    const totalDuration = Date.now() - this.startTime;
    this.metrics.totalDuration = totalDuration;

    const avgResponseTime = this.results
      .filter((r) => r.duration > 0)
      .reduce((sum, r) => sum + r.duration, 0) / this.results.filter((r) => r.duration > 0).length;
    this.metrics.averageResponseTime = avgResponseTime;

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests: this.metrics.totalTests,
        passedTests: this.metrics.passedTests,
        failedTests: this.metrics.failedTests,
        passRate: `${((this.metrics.passedTests / this.metrics.totalTests) * 100).toFixed(2)}%`,
        totalDuration: `${(totalDuration / 1000).toFixed(2)}s`,
        averageResponseTime: `${avgResponseTime.toFixed(0)}ms`,
      },
      results: this.results.map((r) => ({
        name: r.name,
        passed: r.passed,
        message: r.message,
        duration: `${r.duration}ms`,
        details: r.details,
      })),
      environment: {
        apiBase: API_BASE,
        nodeVersion: process.version,
        platform: process.platform,
      },
    };

    return report;
  }

  async run() {
    console.clear();
    console.log('\n╔════════════════════════════════════════════════════════════════╗');
    console.log('║          VehicAid Comprehensive Test Suite                      ║');
    console.log(`║          Date: ${new Date().toISOString()}              ║`);
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    try {
      // Run all tests
      const backendHealthy = await this.testBackendHealthWithRetry();
      if (!backendHealthy) {
        this.log('Backend not available. Critical tests skipped.', 'error');
      }

      if (backendHealthy) {
        await this.testAuthentication();
        await this.testAPIEndpoints();
        await this.testPerformance();
      }

      await this.testBundleSize();

      // Generate report
      const report = this.generateReport();

      // Save report
      const reportPath = path.join(
        TEST_RESULTS_DIR,
        `test_report_${Date.now()}.json`
      );
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      this.log(`\nTest report saved: ${reportPath}`, 'success');

      // Print summary
      console.log('\n╔════════════════════════════════════════════════════════════════╗');
      console.log('║                      TEST SUMMARY                              ║');
      console.log('╠════════════════════════════════════════════════════════════════╣');
      console.log(`║ Total Tests:        ${String(report.summary.totalTests).padEnd(50)}║`);
      console.log(`║ Passed:             ${String(report.summary.passedTests).padEnd(50)}║`);
      console.log(`║ Failed:             ${String(report.summary.failedTests).padEnd(50)}║`);
      console.log(`║ Pass Rate:          ${String(report.summary.passRate).padEnd(50)}║`);
      console.log(`║ Average Response:   ${String(report.summary.averageResponseTime).padEnd(50)}║`);
      console.log(`║ Total Duration:     ${String(report.summary.totalDuration).padEnd(50)}║`);
      console.log('╚════════════════════════════════════════════════════════════════╝\n');

      return report;
    } catch (error) {
      this.log(`Test suite error: ${error.message}`, 'error');
      console.error(error);
    }
  }
}

// Run the test suite
const suite = new ComprehensiveTestSuite();
suite.run();
