# Protocol Memory Library Hosting & Distribution

**Status**: v1.0.0 Released ✅
**Date**: October 17, 2025
**Distribution**: jsdelivr CDN via GitHub Releases
**Public Repo**: [protocol-memory-integration](https://github.com/phillipclapham/protocol-memory-integration)

---

## Overview

The protocol-integration.js library is distributed via **jsdelivr CDN** using GitHub releases from the public [protocol-memory-integration](https://github.com/phillipclapham/protocol-memory-integration) repository. This provides free, reliable CDN hosting with automatic versioning and caching.

---

## For Users

### CDN URL (Recommended)

**Latest version** (auto-updates):

```html
<script src="https://cdn.jsdelivr.net/gh/phillipclapham/protocol-memory-integration@latest/protocol-integration.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/phillipclapham/protocol-memory-integration@latest/protocol-memory.css">
```

**Specific version** (production - no auto-updates):

```html
<script src="https://cdn.jsdelivr.net/gh/phillipclapham/protocol-memory-integration@1.0.0/protocol-integration.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/phillipclapham/protocol-memory-integration@1.0.0/protocol-memory.css">
```

### Self-Hosted

Download from [GitHub Releases](https://github.com/phillipclapham/protocol-memory-integration/releases):

1. Download `protocol-integration.js` and `protocol-memory.css`
2. Place in your project directory
3. Include with relative paths

### API Access

**Public API Key** (for custom integrations):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyZnV4aWZ4cGh0cXNya3VvaWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwNTY5NzUsImV4cCI6MjA3MzYzMjk3NX0.i_OioOUbgn6BN-38-ps26siSY4_iRH6Ac3boAHywPng
```

**Location**: Also available in the web app at **Settings → API** (coming in Session 22I)

**Usage**:
- JavaScript library includes this key by default (no manual configuration needed)
- For custom integrations (Python, Ruby, PHP, etc.), use this key in the `Authorization` header
- See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for examples in 7 languages

---

## For Maintainers

**Note**: This private repo is the source. Releases are published to the public [protocol-memory-integration](https://github.com/phillipclapham/protocol-memory-integration) repo.

### Creating a New Release

**1. Develop in this repo** (protocol-memory):

```bash
cd /Users/phillipclapham/Documents/protocol-memory
# Make changes to js/protocol-integration.js and css/protocol-memory.css
git add js/protocol-integration.js css/protocol-memory.css
git commit -m "Feature: XYZ"
git push origin main
```

**2. Sync to public repo**:

```bash
cd /Users/phillipclapham/Documents/protocol-memory-integration
cp ../protocol-memory/js/protocol-integration.js .
cp ../protocol-memory/css/protocol-memory.css .
git add protocol-integration.js protocol-memory.css
git commit -m "Release v1.0.1 - XYZ improvements"
git push origin main
```

**3. Create git tag** (in public repo):

```bash
git tag -a v1.0.1 -m "Protocol Memory Integration v1.0.1

Features:
- XYZ improvements
- Bug fixes

Library: protocol-integration.js
CSS: protocol-memory.css
"

git push origin v1.0.1
```

**4. Create GitHub Release** (in public repo):

```bash
gh release create v1.0.1 \
  protocol-integration.js \
  protocol-memory.css \
  LIBRARY_HOSTING.md \
  README.md \
  --title "Protocol Memory Integration v1.0.1" \
  --notes "**Protocol Memory Site Integration Library**

## What's New in v1.0.1

### Features
- XYZ improvements
- Bug fixes

### Usage
\`\`\`html
<script src=\"https://cdn.jsdelivr.net/gh/phillipclapham/protocol-memory-integration@1.0.1/protocol-integration.js\"></script>
<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/gh/phillipclapham/protocol-memory-integration@1.0.1/protocol-memory.css\">

<script>
  const integration = new ProtocolIntegration('your-username');
  integration.init();
</script>
\`\`\`

### Documentation
- [Integration Guide](https://github.com/phillipclapham/protocol-memory-integration/blob/main/README.md)
- [Library Hosting](https://github.com/phillipclapham/protocol-memory-integration/blob/main/LIBRARY_HOSTING.md)
"
```

**5. Verify CDN availability** (wait ~5 minutes for jsdelivr to index):

```bash
curl -I https://cdn.jsdelivr.net/gh/phillipclapham/protocol-memory-integration@1.0.1/protocol-integration.js
# Should return 200 OK
```

---

## jsdelivr CDN Details

### Cache Purging

jsdelivr caches files for 7 days. For immediate updates:

```bash
# Purge specific file
curl https://purge.jsdelivr.net/gh/phillipclapham/protocol-memory-integration@latest/protocol-integration.js

# Purge all files for a version
curl https://purge.jsdelivr.net/gh/phillipclapham/protocol-memory-integration@1.0.0/*
```

### URL Patterns

```
https://cdn.jsdelivr.net/gh/{user}/{repo}@{version}/{file}
```

**Examples**:

- `@latest` - Latest release
- `@1.0.0` - Specific version
- `@1.0` - Latest patch in 1.0.x
- `@1` - Latest minor in 1.x.x

---

## Versioning Strategy

Follow **Semantic Versioning** (semver):

### MAJOR (X.0.0)

Breaking changes to API or behavior:

- Renamed classes or methods
- Removed functionality
- Changed default behavior

### MINOR (x.Y.0)

New features (backward compatible):

- New methods or options
- New CSS classes
- Enhanced functionality

### PATCH (x.y.Z)

Bug fixes (backward compatible):

- Fixed bugs
- Performance improvements
- Documentation updates

### Current Version: 1.0.0

**Next versions**:

- **1.0.1**: Bug fixes only
- **1.1.0**: New features (e.g., dark mode toggle)
- **2.0.0**: Breaking changes (e.g., renamed classes)

---

## Files Included in Release

### Required Files

1. **js/protocol-integration.js** (720 lines)
   - ProtocolIntegration class
   - GravatarHelper class
   - Modal system
   - Auto-refresh logic

2. **css/protocol-memory.css** (1,370 lines)
   - Complete design system
   - Avatar styles
   - Modal styles
   - Responsive breakpoints

3. **LIBRARY_HOSTING.md** (330 lines)
   - Distribution strategy
   - Release commands
   - Versioning guide
   - Troubleshooting

4. **INTEGRATION_GUIDE.md** (620 lines)
   - Comprehensive usage documentation
   - API reference
   - Examples for 7 languages
   - Configuration & troubleshooting

---

## Release Checklist

Before creating a release:

- [ ] All changes committed and pushed to main
- [ ] Library tested in phill-site showcase
- [ ] Version number updated (if using package.json)
- [ ] Git tag created with descriptive message
- [ ] GitHub release created with both files attached
- [ ] Release notes written (What's New + Usage)
- [ ] CDN URLs tested (wait 5 min after release)
- [ ] Documentation updated (if API changed)

---

## Troubleshooting

### CDN 404 Error

**Problem**: `https://cdn.jsdelivr.net/gh/.../protocol-integration.js` returns 404

**Solutions**:

1. Wait 5-10 minutes for jsdelivr to index new release
2. Check release exists: `gh release list`
3. Check files attached to release: `gh release view v1.0.0`
4. Verify tag pushed: `git ls-remote --tags origin`
5. Try cache purge URL (see above)

### Old Version Served

**Problem**: CDN serving outdated file even after new release

**Solutions**:

1. Use versioned URL instead of `@latest`
2. Purge jsdelivr cache (see above)
3. Add cache-busting query: `?v=1.0.0`

### GitHub Release Not Found

**Problem**: `gh release create` fails with "not found"

**Solutions**:

1. Check GitHub CLI authenticated: `gh auth status`
2. Verify repo name correct: `gh repo view`
3. Check files exist: `ls js/protocol-integration.js`

---

## Current Architecture: Separate Public Repo ✅

**Status**: Implemented

The library is distributed from a separate public repo ([protocol-memory-integration](https://github.com/phillipclapham/protocol-memory-integration)) while this repo (protocol-memory) remains private.

### Benefits

- **Privacy**: Main project code stays private
- **CDN Access**: jsdelivr works with public repo
- **Clean Separation**: Library-only repo for users
- **Simple Sync**: Copy 2 files when releasing

### Repository Structure

**Private repo** (protocol-memory):
- Full project source code
- Development happens here
- Contains: `js/protocol-integration.js`, `css/protocol-memory.css`

**Public repo** ([protocol-memory-integration](https://github.com/phillipclapham/protocol-memory-integration)):
- Distribution only
- Files in root: `protocol-integration.js`, `protocol-memory.css`
- Public releases with CDN access

---

## Support

**Issues**: [GitHub Issues](https://github.com/phillipclapham/protocol-memory/issues)
**Docs**: [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)
**Email**: <support@protocolmemory.com>

---

**Last Updated**: October 17, 2025
**Current Version**: 1.0.0
**Status**: Ready for initial release
