# Protocol Memory Library Hosting & Distribution

**Status**: Ready for v1.0.0 release
**Date**: October 17, 2025
**Distribution**: jsdelivr CDN via GitHub Releases

---

## Overview

The protocol-integration.js library is distributed via **jsdelivr CDN** using GitHub releases. This provides free, reliable CDN hosting with automatic versioning and caching.

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

---

## For Maintainers

### Creating a New Release

**1. Sync from main repo** (protocol-memory):

```bash
cd /Users/phillipclapham/Documents/protocol-memory-integration
cp ../protocol-memory/js/protocol-integration.js .
cp ../protocol-memory/css/protocol-memory.css .
```

**2. Commit all changes**:

```bash
git add protocol-integration.js protocol-memory.css
git commit -m "Release v1.0.0 - Gravatar integration + UI polish"
git push origin main
```

**3. Create git tag**:

```bash
git tag -a v1.0.0 -m "Protocol Memory Integration v1.0.0

Features:
- Gravatar avatar integration
- Profile picture support (server-side + client-side fallback)
- UI bug fixes (zoom icons, Instagram icon, label text)
- Enhanced avatar styles with hover effects

Library: protocol-integration.js (720 lines)
CSS: protocol-memory.css (1,370 lines)
"

git push origin v1.0.0
```

**4. Create GitHub Release**:

```bash
gh release create v1.0.0 \
  protocol-integration.js \
  protocol-memory.css \
  LIBRARY_HOSTING.md \
  README.md \
  --title "Protocol Memory Integration v1.0.0" \
  --notes "**Protocol Memory Site Integration Library**

## What's New in v1.0.0

### Features
- **Gravatar Integration**: Professional profile avatars for public profiles
- **GravatarHelper Class**: Easy avatar URL generation from email
- **Enhanced About Section**: Avatar display with fallback
- **UI Polish**: Fixed zoom icons, Instagram cutoff, label text sizing

### Usage
\`\`\`html
<script src=\"https://cdn.jsdelivr.net/gh/phillipclapham/protocol-memory-integration@1.0.0/protocol-integration.js\"></script>
<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/gh/phillipclapham/protocol-memory-integration@1.0.0/protocol-memory.css\">

<script>
  const integration = new ProtocolIntegration('your-username');
  integration.init();
</script>
\`\`\`

### Files
- **protocol-integration.js**: Main library (720 lines)
- **protocol-memory.css**: Styling (1,370 lines)
- **LIBRARY_HOSTING.md**: Distribution & versioning guide
- **README.md**: Complete integration guide (was INTEGRATION_GUIDE.md)

### Documentation
- [Integration Guide](https://github.com/phillipclapham/protocol-memory-integration/blob/main/README.md)
- [Library Hosting](https://github.com/phillipclapham/protocol-memory-integration/blob/main/LIBRARY_HOSTING.md)
"
```

**5. Verify CDN availability** (wait ~5 minutes for jsdelivr to index):

```bash
curl -I https://cdn.jsdelivr.net/gh/phillipclapham/protocol-memory-integration@1.0.0/protocol-integration.js
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

1. **protocol-integration.js** (720 lines)
   - ProtocolIntegration class
   - GravatarHelper class
   - Modal system
   - Auto-refresh logic

2. **protocol-memory.css** (1,370 lines)
   - Complete design system
   - Avatar styles
   - Modal styles
   - Responsive breakpoints

3. **LIBRARY_HOSTING.md** (330 lines)
   - Distribution strategy
   - Release commands
   - Versioning guide
   - Troubleshooting

4. **README.md** (620 lines)
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

## Alternative: Separate Public Repo

If main protocol-memory repo must stay fully private:

### Create Public Library Repo

```bash
# Create new public repo
mkdir protocol-memory-integration
cd protocol-memory-integration
git init

# Copy library files
cp ../protocol-memory/js/protocol-integration.js .
cp ../protocol-memory/css/protocol-memory.css .
cp ../protocol-memory/INTEGRATION_GUIDE.md README.md

# Initial commit
git add .
git commit -m "Initial release v1.0.0"

# Push to GitHub (create repo first via gh or web)
git remote add origin https://github.com/phillipclapham/protocol-memory-integration.git
git push -u origin main

# Tag version
git tag v1.0.0
git push origin v1.0.0

# Create release
gh release create v1.0.0 \
  protocol-integration.js \
  protocol-memory.css \
  --title "Protocol Memory Integration v1.0.0" \
  --notes "Initial public release"
```

**CDN URLs** (separate repo):

```
https://cdn.jsdelivr.net/gh/phillipclapham/protocol-memory-integration@1.0.0/protocol-integration.js
https://cdn.jsdelivr.net/gh/phillipclapham/protocol-memory-integration@1.0.0/protocol-memory.css
```

---

## Support

**Issues**: [GitHub Issues](https://github.com/phillipclapham/protocol-memory-integration/issues)
**Docs**: [README.md](README.md)
**Source**: [Protocol Memory](https://github.com/phillipclapham/protocol-memory)

---

**Last Updated**: October 17, 2025
**Current Version**: 1.0.0
**Status**: Ready for initial release
