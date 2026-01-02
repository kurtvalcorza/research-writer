# Security Documentation

This document outlines the security measures implemented in the Research Writer Interface application.

## Security Features

### 1. Input Validation

#### API Routes
- **File Upload (`/api/upload`)**:
  - Maximum file size: 50MB
  - PDF file type validation using magic bytes
  - Filename sanitization
  - Duplicate file detection
  - Empty file rejection

- **Content API (`/api/content`)**:
  - Maximum content size: 10MB
  - Path length validation (max 500 characters)
  - Directory traversal protection
  - Write access restricted to `template/` directory only

- **Files API (`/api/files`)**:
  - Whitelisted directories: `corpus`, `outputs`, `prompts`, `template`
  - Protected files: `.gitkeep`, `.gitignore`
  - Path traversal prevention
  - Directory deletion prevention

- **Agent Execution (`/api/agent/run`)**:
  - Provider validation (gemini/claude only)
  - Boolean type validation for yoloMode
  - Path traversal protection with secure resolution
  - 10-minute execution timeout
  - Process cleanup on client disconnect

### 2. Path Traversal Protection

All file operations use secure path validation:
```typescript
function validateAndResolvePath(relativePath: string, allowedDir: string, projectRoot: string): string | null {
    const normalized = path.normalize(relativePath).replace(/^(\.\.[\/\\])+/, "");
    const resolvedPath = path.resolve(projectRoot, normalized);
    const allowedPath = path.resolve(projectRoot, allowedDir);

    if (!resolvedPath.startsWith(allowedPath + path.sep)) {
        return null;
    }

    return resolvedPath;
}
```

### 3. Command Injection Prevention

- **Removed `shell: true`** from `spawn()` calls
- Direct command execution without shell interpretation
- Whitelist of allowed AI providers
- No user input directly passed to command execution

### 4. Security Headers (via Middleware)

The following security headers are set on all responses:

- `Strict-Transport-Security`: HSTS with 1-year max-age
- `X-Frame-Options`: SAMEORIGIN (prevents clickjacking)
- `X-Content-Type-Options`: nosniff (prevents MIME sniffing)
- `X-XSS-Protection`: 1; mode=block
- `Referrer-Policy`: strict-origin-when-cross-origin
- `Permissions-Policy`: Restricts camera, microphone, geolocation
- `Content-Security-Policy`: Comprehensive CSP policy

### 5. Content Security Policy

```
default-src 'self';
script-src 'self' 'unsafe-eval' 'unsafe-inline';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: blob:;
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

### 6. File Type Validation

PDF validation using magic bytes:
```typescript
const PDF_SIGNATURE = [0x25, 0x50, 0x44, 0x46]; // %PDF
```

### 7. Process Management

- Automatic timeout after 10 minutes
- Graceful termination (SIGTERM → SIGKILL)
- Cleanup on client disconnect
- Error boundary handling

## Best Practices

### For Developers

1. **Always validate user input** at API boundaries
2. **Use TypeScript** for type safety
3. **Avoid `shell: true`** in child process operations
4. **Sanitize file paths** using `path.basename()` and resolution checks
5. **Implement proper error handling** with specific error messages
6. **Log security events** for audit purposes

### For Deployment

1. **Use HTTPS** in production
2. **Set environment variables** securely (never commit secrets)
3. **Enable rate limiting** on API routes
4. **Monitor logs** for suspicious activity
5. **Keep dependencies updated** regularly
6. **Use environment-based configuration**

## Security Audit Checklist

- [x] Input validation on all API routes
- [x] Path traversal protection
- [x] Command injection prevention
- [x] File type validation
- [x] Size limits enforced
- [x] Security headers configured
- [x] CSP policy implemented
- [x] Error handling without information leakage
- [x] TypeScript strict mode enabled
- [x] ESLint security rules configured

## Reporting Security Issues

If you discover a security vulnerability, please:

1. **Do not** open a public issue
2. Email the security team with details
3. Allow time for investigation and patch
4. Coordinate disclosure timing

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
