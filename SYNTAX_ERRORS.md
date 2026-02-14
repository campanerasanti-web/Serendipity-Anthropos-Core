# Syntax Errors to Fix

## Files with Parse Errors

### 1. AbundanceReportGenerator.ts

**Lines affected:** 43-50

**Errors detected:**
- Line 43: `'>' expected`
- Line 43: `';' expected`
- Line 46-50: Multiple parse errors with JSX/TypeScript syntax

**Current content (lines 42-50):**
```typescript
}
};
<Button 
  onClick={generateAbundanceReport}
  className="relative group overflow-hidden bg-slate-900 border border-primary/20 hover:border-primary transition-all h-16 w-full"
>
  <div className="absolute left-4 h-3 w-3 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse" />
  <span className="ml-4 font-display font-bold uppercase tracking-widest text-[11px]">
    Generar Espejo de Abundancia (PDF)
  </span>
</Button>
```

**Issue:** JSX code appears to be at the root level of the file, not inside a component or function. This is invalid TypeScript syntax.

**Action needed:** Review and fix TypeScript/JSX syntax in this file. The JSX code should be properly wrapped within a React component function.

---

### 2. scripts/activate-prara-pipeline.mjs

**Line affected:** 344

**Error:** `Unexpected token`

**Current content (line 344):**
```javascript
console.log('⏭️  NEXT STEP: Activate campaign in CRM (Pipedrive/HubSpot)\n');
```

**Issue:** The error may be related to special characters or string formatting in this line or surrounding lines.

**Action needed:** Review and fix JavaScript syntax at line 344 and surrounding context.

---

## Impact

These syntax errors prevent:
- CodeQL from analyzing these files completely
- Test workflows from running successfully
- Proper TypeScript/JavaScript compilation

## Next Steps

1. Review each file
2. Fix the syntax errors
3. Run `npm run lint` and `npm run type-check` locally
4. Commit the fixes

## Notes

- These errors were identified during GitHub's CodeQL analysis
- The files should be reviewed carefully to ensure the fixes don't break functionality
- Consider adding these files to linting checks to prevent future syntax errors
