/**
 * Application configuration constants
 * Centralized location for all configurable values
 */

/**
 * File upload and content size limits
 */
export const FILE_LIMITS = {
  /** Maximum file upload size in bytes (50MB) */
  MAX_UPLOAD_SIZE: 50 * 1024 * 1024,

  /** Maximum content size for reading/writing files in bytes (10MB) */
  MAX_CONTENT_SIZE: 10 * 1024 * 1024,

  /** Maximum path length for security validation */
  MAX_PATH_LENGTH: 500,
} as const;

/**
 * Agent execution configuration
 */
export const AGENT_CONFIG = {
  /** Maximum execution time for agent runs in milliseconds (10 minutes) */
  MAX_EXECUTION_TIME: 10 * 60 * 1000,

  /** Timeout for system check operations in milliseconds (10 seconds) */
  SYSTEM_CHECK_TIMEOUT: 10 * 1000,
} as const;

/**
 * Allowed directories for file operations
 */
export const ALLOWED_DIRECTORIES = {
  /** Directories allowed for content read/write operations */
  CONTENT_DIRS: ["quick-start", "settings", "outputs"] as const,

  /** All directories accessible via file API */
  FILE_DIRS: ["corpus", "outputs", "prompts", "settings"] as const,
} as const;
