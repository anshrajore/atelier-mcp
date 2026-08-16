import { GenerateFixInput, GenerateFixResult } from '../types.js';

export function handleGenerateFix(input: GenerateFixInput): GenerateFixResult {
  let fixedCode = input.code;
  const resolvedRules: string[] = [];

  for (const finding of input.findings) {
    if (finding.diff && finding.location?.snippet) {
      const oldLine = finding.location.snippet;
      const diffLines = finding.diff.split('\n');
      const addLine = diffLines.find(l => l.startsWith('+ '))?.slice(2);
      if (addLine && fixedCode.includes(oldLine)) {
        fixedCode = fixedCode.replace(oldLine, addLine);
        resolvedRules.push(finding.ruleId);
      }
    }
  }

  // Generate unified diff
  const diff = generateSimpleDiff(input.code, fixedCode);

  return {
    originalCode: input.code,
    fixedCode,
    diff,
    resolvedRules,
  };
}

function generateSimpleDiff(original: string, modified: string): string {
  const origLines = original.split('\n');
  const modLines = modified.split('\n');
  const diffLines: string[] = [];

  let maxLen = Math.max(origLines.length, modLines.length);
  for (let i = 0; i < maxLen; i++) {
    const o = origLines[i];
    const m = modLines[i];
    if (o !== m) {
      if (o !== undefined) diffLines.push(`- ${o}`);
      if (m !== undefined) diffLines.push(`+ ${m}`);
    }
  }

  return diffLines.join('\n');
}
