#!/usr/bin/env node

/**
 * Atelier Quality Gate PR Commenter
 * Zero-dependency GitHub Action script utilizing built-in Node 18 fetch
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function run() {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPOSITORY; // e.g. "owner/repo"
  const eventPath = process.env.GITHUB_EVENT_PATH;

  if (!token || !repo || !eventPath) {
    console.error('Missing required GitHub environment variables GITHUB_TOKEN, GITHUB_REPOSITORY, or GITHUB_EVENT_PATH');
    process.exit(1);
  }

  // Parse GitHub event payload
  const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
  const pullNumber = event.pull_request ? event.pull_request.number : null;

  if (!pullNumber) {
    console.log('Not a pull request event. Skipping.');
    process.exit(0);
  }

  console.log(`Auditing PR #${pullNumber} in repository ${repo}`);

  // Fetch changed files using git diff compared to the target branch (usually origin/main)
  let changedFiles = [];
  try {
    const targetBranch = event.pull_request.base.ref || 'main';
    execSync(`git fetch origin ${targetBranch}`);
    const diffOutput = execSync(`git diff --name-only origin/${targetBranch}...HEAD`, { encoding: 'utf8' });
    changedFiles = diffOutput
      .split('\n')
      .map(f => f.trim())
      .filter(f => f && fs.existsSync(f) && /\.(tsx|jsx|ts|js|css|html|vue|svelte|py|go)$/i.test(f));
  } catch (err) {
    console.error('Failed to get changed files via git diff:', err.message);
    process.exit(1);
  }

  if (changedFiles.length === 0) {
    console.log('No auditable files were modified in this PR.');
    process.exit(0);
  }

  console.log(`Changed files to audit:`, changedFiles);

  const comments = [];
  let totalViolations = 0;
  let summaryText = '### 🛡️ Atelier Quality Gate Report\n\n';

  for (const file of changedFiles) {
    try {
      // Execute the local CLI audit command with json formatter
      const outputRaw = execSync(`node bin/atelier.js audit "${file}" --format json`, { encoding: 'utf8' });
      const result = JSON.parse(outputRaw);

      if (result.results && result.results[0]) {
        const fileResult = result.results[0];
        if (fileResult.findings && fileResult.findings.length > 0) {
          fileResult.findings.forEach(finding => {
            totalViolations++;
            comments.push({
              path: file,
              line: finding.line || 1,
              body: `**[Atelier ${finding.ruleId}]** ${finding.severity.toUpperCase()}: ${finding.message}\n\n* **Concrete Fix**: \`${finding.concreteFix || 'Remediate manually'}\``
            });
          });
        }
      }
    } catch (err) {
      console.warn(`Failed to audit file ${file}:`, err.message);
    }
  }

  // Construct summary body
  if (totalViolations > 0) {
    summaryText += `❌ **Quality Gate Rejected**: Found **${totalViolations}** violation(s) across modified files.\n\nPlease address the inline findings to comply with the design system and backend security guidelines.`;
  } else {
    summaryText += `✅ **Quality Gate Passed**: 100% compliance! No spacing grid issues, plaintext credentials, or performance bottlenecks detected in modified files.`;
  }

  // Post review comment to GitHub API
  const url = `https://api.github.com/repos/${repo}/pulls/${pullNumber}/reviews`;
  const reviewBody = {
    event: totalViolations > 0 ? 'COMMENT' : 'APPROVE',
    body: summaryText,
    comments: comments.slice(0, 50) // Limit to 50 comments per review to avoid rate limiting
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `token ${token}`,
        'User-Agent': 'Atelier-Quality-Gate-Action'
      },
      body: JSON.stringify(reviewBody)
    });

    if (!res.ok) {
      const errorResponse = await res.text();
      throw new Error(`GitHub API returned status ${res.status}: ${errorResponse}`);
    }

    console.log(`Successfully posted PR review with ${comments.length} inline comments.`);
  } catch (err) {
    console.error('Failed to post review comment to GitHub:', err.message);
    process.exit(1);
  }

  if (totalViolations > 0) {
    process.exit(1); // Fail the check if there are violations
  }
}

run();
