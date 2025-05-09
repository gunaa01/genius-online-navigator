# Unified Components

This directory contains unified components that combine functionality from multiple component implementations in the codebase.

## Purpose

The unified components in this directory serve as the single source of truth for component implementations that previously existed in multiple forms (e.g., basic and styled variants). This approach:

- Reduces code duplication
- Standardizes component interfaces
- Improves maintainability
- Preserves backward compatibility

## Directory Structure

```
unified/
├── content/       # Content-related components (ContentForm, ContentList)
├── messaging/     # Messaging components (MessageThread)
└── user/          # User-related components (UserProfileCard)
```

## Implementation Strategy

Each unified component:

1. Combines all functionality from its original implementations
2. Supports both basic and styled variants through props
3. Uses shadcn UI components as the base
4. Maintains backward compatibility with original component interfaces

Refer to the `COMPONENT_UNIFICATION_PLAN.md` document in the docs directory for detailed implementation guidelines.

## Usage

Existing code should continue to use the original component imports, which now re-export from these unified components with appropriate default props.

For new code, you can import directly from the unified components and use the `variant` prop to switch between basic and styled modes:

```tsx
import { UnifiedContentForm } from '@/components/unified/content/ContentForm';

// Basic variant
<UnifiedContentForm variant="basic" />

// Styled variant (default)
<UnifiedContentForm variant="styled" />
```