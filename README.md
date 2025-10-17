# Protocol Memory Integration Guide

Complete guide for integrating Protocol Memory public profiles into your website or application.

## Table of Contents

1. [JavaScript Library (Easiest)](#javascript-library)
2. [API Reference (Custom Integrations)](#api-reference)
3. [Examples](#examples)
4. [Configuration](#configuration)
5. [Troubleshooting](#troubleshooting)

---

## JavaScript Library

### Quick Start

**1. Include the library:**

```html
<!-- Via CDN (recommended) -->
<script src="https://cdn.jsdelivr.net/gh/phillipclapham/protocol-memory-integration@1.0.0/protocol-integration.js"></script>

<!-- Optional: Include CSS for default styling -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/phillipclapham/protocol-memory-integration@1.0.0/protocol-memory.css">
```

**2. Add HTML elements:**

```html
<!-- Current State -->
<section id="pm-current-state"></section>

<!-- About -->
<section id="pm-about"></section>

<!-- Active Notes (Seeds) -->
<section id="pm-projects"></section>

<!-- Expertise (Contexts) -->
<section id="pm-expertise"></section>

<!-- Last Updated Indicator -->
<div id="pm-last-updated"></div>
```

**3. Initialize:**

```html
<script>
  // Initialize with your Protocol Memory username
  const protocol = new ProtocolIntegration('your-username');
  protocol.init();
</script>
```

**That's it!** Your site now displays live data from your Protocol Memory profile.

---

### Configuration Options

```javascript
const protocol = new ProtocolIntegration('username', {
  apiUrl: 'https://urfuxifxphtqsrkuoifn.supabase.co/functions/v1/public-profile',
  anonKey: 'YOUR_SUPABASE_ANON_KEY',
  refreshInterval: 300000, // 5 minutes (milliseconds)
  debug: false,
  autoRefresh: true
});

protocol.init();
```

**Options**:
- `apiUrl` - API endpoint (default: Protocol Memory production URL)
- `anonKey` - Supabase anon key for authentication (default: Protocol Memory production key)
- `refreshInterval` - Auto-refresh interval in milliseconds (default: 5 min)
- `debug` - Enable console logging (default: false)
- `autoRefresh` - Enable automatic refresh (default: true)

---

### Methods

**`init()`** - Initialize and start auto-refresh:
```javascript
protocol.init();
```

**`refresh()`** - Manually refresh data:
```javascript
await protocol.refresh();
```

**`getData()`** - Get current cached data:
```javascript
const data = protocol.getData();
console.log(data.fields.current_state);
```

**`stopAutoRefresh()`** - Stop auto-refresh and clean up:
```javascript
protocol.stopAutoRefresh();
```

---

## API Reference

For custom integrations (server-side, mobile apps, other languages).

### Endpoint

```
GET https://urfuxifxphtqsrkuoifn.supabase.co/functions/v1/public-profile/{username}
```

### Headers

```
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
Content-Type: application/json
```

**Get your key**: The library uses Protocol Memory's public API with a built-in key. For custom integrations, you'll need your own Supabase project or contact support.

### Response

```json
{
  "username": "phill",
  "avatar_url": "https://www.gravatar.com/avatar/...",
  "fields": {
    "current_state": {
      "focus": "Session 22G.3 - Final Polish",
      "energy": "M",
      "energy_updated_at": "2025-10-17T14:30:00Z",
      "location": "home",
      "availability": "After 5pm"
    },
    "about": {
      "tagline": "building the missing layer between humans and ai",
      "philosophy": "First principles over patterns",
      "role": "Senior Solutions Architect",
      "bio": "Background in software architecture...",
      "current_work": "Protocol Memory - launching soon",
      "expertise": "Software architecture, AI integration"
    },
    "identity": {
      "name": "Phillip Clapham",
      "philosophy": "First principles over patterns",
      "role": "Senior Solutions Architect",
      "expertise": "Software architecture"
    }
  },
  "seeds": [
    {
      "text": "Session 22G.3 - Final Polish",
      "priority": "high",
      "status": "active",
      "type": "code",
      "description": "UI bug fixes + Gravatar + Distribution + API docs",
      "created_at": "2025-10-17T10:00:00Z"
    }
  ],
  "contexts": [
    {
      "name": "Code Review",
      "type": "command",
      "content": "Review code for security, performance, and maintainability...",
      "command_syntax": "[!code-review]"
    }
  ],
  "last_updated": "2025-10-17T14:30:00Z",
  "member_since": "2025-09-01"
}
```

---

## Examples

### JavaScript (Vanilla)

```javascript
async function fetchProfile(username) {
  const response = await fetch(
    `https://urfuxifxphtqsrkuoifn.supabase.co/functions/v1/public-profile/${username}`,
    {
      headers: {
        'Authorization': 'Bearer YOUR_SUPABASE_ANON_KEY',
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const profile = await response.json();
  console.log(profile.fields.current_state.focus);
  return profile;
}

fetchProfile('phill');
```

---

### Python

```python
import requests

def fetch_profile(username):
    url = f'https://urfuxifxphtqsrkuoifn.supabase.co/functions/v1/public-profile/{username}'
    headers = {
        'Authorization': 'Bearer YOUR_SUPABASE_ANON_KEY',
        'Content-Type': 'application/json'
    }

    response = requests.get(url, headers=headers)
    response.raise_for_status()

    profile = response.json()
    print(profile['fields']['current_state']['focus'])
    return profile

profile = fetch_profile('phill')
```

---

### Ruby

```ruby
require 'net/http'
require 'json'

def fetch_profile(username)
  uri = URI("https://urfuxifxphtqsrkuoifn.supabase.co/functions/v1/public-profile/#{username}")

  request = Net::HTTP::Get.new(uri)
  request['Authorization'] = 'Bearer YOUR_SUPABASE_ANON_KEY'
  request['Content-Type'] = 'application/json'

  response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
    http.request(request)
  end

  profile = JSON.parse(response.body)
  puts profile['fields']['current_state']['focus']
  profile
end

profile = fetch_profile('phill')
```

---

### PHP

```php
<?php
function fetchProfile($username) {
    $url = "https://urfuxifxphtqsrkuoifn.supabase.co/functions/v1/public-profile/{$username}";

    $options = [
        'http' => [
            'header' => "Authorization: Bearer YOUR_SUPABASE_ANON_KEY\r\n" .
                       "Content-Type: application/json\r\n"
        ]
    ];

    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);

    $profile = json_decode($response, true);
    echo $profile['fields']['current_state']['focus'];
    return $profile;
}

$profile = fetchProfile('phill');
?>
```

---

### cURL

```bash
curl -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
     -H "Content-Type: application/json" \
     https://urfuxifxphtqsrkuoifn.supabase.co/functions/v1/public-profile/phill
```

---

### Node.js (Fetch)

```javascript
const fetch = require('node-fetch');

async function fetchProfile(username) {
  const response = await fetch(
    `https://urfuxifxphtqsrkuoifn.supabase.co/functions/v1/public-profile/${username}`,
    {
      headers: {
        'Authorization': 'Bearer YOUR_SUPABASE_ANON_KEY',
        'Content-Type': 'application/json'
      }
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}

fetchProfile('phill').then(profile => {
  console.log('Focus:', profile.fields.current_state.focus);
  console.log('Energy:', profile.fields.current_state.energy);
});
```

---

### Go

```go
package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
)

type Profile struct {
    Username string `json:"username"`
    Fields   struct {
        CurrentState struct {
            Focus  string `json:"focus"`
            Energy string `json:"energy"`
        } `json:"current_state"`
    } `json:"fields"`
}

func fetchProfile(username string) (*Profile, error) {
    url := fmt.Sprintf("https://urfuxifxphtqsrkuoifn.supabase.co/functions/v1/public-profile/%s", username)

    req, err := http.NewRequest("GET", url, nil)
    if err != nil {
        return nil, err
    }

    req.Header.Set("Authorization", "Bearer YOUR_SUPABASE_ANON_KEY")
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        return nil, err
    }

    var profile Profile
    err = json.Unmarshal(body, &profile)
    if err != nil {
        return nil, err
    }

    return &profile, nil
}

func main() {
    profile, err := fetchProfile("phill")
    if err != nil {
        fmt.Println("Error:", err)
        return
    }

    fmt.Println("Focus:", profile.Fields.CurrentState.Focus)
}
```

---

## Configuration

### CORS

API supports CORS for browser-based requests from any origin.

### Rate Limiting

- **Anonymous**: 100 requests/hour per IP
- **Authenticated**: 1000 requests/hour per API key

### Caching

API responses cached for 5 minutes. Use `Cache-Control: no-cache` header to bypass.

---

## Troubleshooting

### "Authorization required" error

**Problem**: Missing or invalid API key

**Solution**:
1. Sign up at [Protocol Memory](https://protocolmemory.com)
2. The JavaScript library works out of the box - no API key needed
3. For custom integrations, contact support for API access

---

### "Profile not found" error

**Problem**: Username doesn't exist or profile not public

**Solution**:
1. Verify username is correct
2. Check profile is marked as public (Settings → Public Profile)
3. Confirm profile has public username set

---

### Stale data showing

**Problem**: Changes not reflected immediately

**Solution**:
- API responses cached for 5 minutes
- Wait up to 5 minutes for changes to propagate
- Or bypass cache: `fetch(url, { headers: { 'Cache-Control': 'no-cache' } })`

---

### CORS errors

**Problem**: Browser blocking cross-origin requests

**Solution**:
- API already supports CORS
- If using custom proxy, ensure CORS headers set
- Check browser console for specific error details

---

### Library not loading from CDN

**Problem**: `protocol-integration.js` returns 404

**Solution**:
1. Check CDN URL is correct (use versioned URL: `@1.0.0`)
2. Wait 5-10 minutes after release for jsdelivr to index
3. Try cache purge: `https://purge.jsdelivr.net/gh/phillipclapham/protocol-memory-integration@1.0.0/protocol-integration.js`

---

### Auto-refresh not working

**Problem**: Data not updating automatically

**Solution**:
1. Check `autoRefresh` option is `true` (default)
2. Check browser console for errors
3. Verify `refreshInterval` is set correctly
4. Check network tab for fetch requests

---

## Support

- **Documentation**: [Integration Guide](https://github.com/phillipclapham/protocol-memory-integration/blob/main/README.md)
- **Issues**: [GitHub Issues](https://github.com/phillipclapham/protocol-memory-integration/issues)
- **Library Hosting**: [LIBRARY_HOSTING.md](https://github.com/phillipclapham/protocol-memory-integration/blob/main/LIBRARY_HOSTING.md)

---

## License

MIT License - Free to use in personal and commercial projects.

---

**Powered by [Protocol Memory](https://protocolmemory.com)** - The missing layer between humans and AI.

**Version**: 1.0.0
**Last Updated**: October 17, 2025
