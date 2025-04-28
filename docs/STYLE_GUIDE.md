# Component Style Guide

## Buttons

### Interactive States
- **Hover**:
  - Primary/Destructive: 90% opacity
  - Outline/Ghost: Background color change
- **Active**: 95% scale transform
- **Focus**: Ring outline (accessibility)
- **Disabled**: 50% opacity

### Variants
| Variant | Styles |
|---------|--------|
| Default | `bg-primary text-primary-foreground` |
| Destructive | `bg-destructive text-destructive-foreground` |
| Outline | `border border-input bg-transparent` |
| Ghost | `hover:bg-accent hover:text-accent-foreground` |

### Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' | 'default' | Visual style variant |
| size | 'default' \| 'sm' \| 'lg' | 'default' | Controls dimensions |
| disabled | boolean | false | Disables interaction |

### Validation Rules
| Prop | Rules |
|------|-------|
| variant | Must match existing variants |
| size | Must match existing sizes |

### Accessibility
- WCAG AA contrast compliant
- Keyboard navigable
- Proper ARIA attributes

### Zod Schemas
```ts
// Button props validation
const buttonPropsSchema = z.object({
  variant: z.enum(['default', 'destructive', 'outline', 'secondary', 'ghost'], {
    errorMap: () => ({ message: 'Invalid button variant' })
  }),
  size: z.enum(['default', 'sm', 'lg']).optional(),
  disabled: z.boolean().optional()
});
```

```tsx
/**
 * Primary UI component for user interaction
 * @param variant - Visual style variant
 * @param size - Controls button dimensions
 * @param disabled - Whether button is interactive
 * @param children - Button content
 * @returns JSX.Element
 */
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
  disabled?: boolean
  children: React.ReactNode
}

// Example usage
<Button variant="default">Submit</Button>
<Button variant="destructive">Delete</Button>
```

## Input Fields

### States
- **Focus**: Ring outline
- **Error**: Red border + message
- **Disabled**: Grayed out

### Variants
| Variant | Styles |
|---------|--------|
| Default | `border rounded-md px-3 py-2` |
| Large | `px-4 py-3 text-lg` |

### Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| type | string | 'text' | HTML input type |
| value | string | - | Controlled value |
| onChange | function | - | Change handler |
| placeholder | string | - | Placeholder text |
| disabled | boolean | false | Disables interaction |

### Validation Rules
| Prop | Rules |
|------|-------|
| type | Must be valid HTML5 input type |
| value | Required for controlled components |
| onChange | Required for controlled components |

### Zod Schemas
```ts
// Example form validation
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(8, 'Password must contain at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
});
```

```tsx
/**
 * Form input component
 * @param type - HTML input type
 * @param value - Controlled value
 * @param onChange - Change handler
 * @param placeholder - Input placeholder text
 * @param disabled - Whether input is interactive
 * @returns JSX.Element
 */
interface InputProps {
  type: React.HTMLInputTypeAttribute
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
  disabled?: boolean
}

// Controlled input example
<Input 
  type="email" 
  value={email} 
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Enter email"
/>
```

## Form Validation

### Basic Usage
```tsx
import { Form } from "@/components/ui/form";
import { schemas } from "@/lib/validation";

function LoginForm() {
  const onSubmit = (data) => {
    // Handle valid data
  };

  return (
    <Form onSubmit={onSubmit} schema={schemas.login()}>
      <FormField name="email">
        <Input placeholder="Email" />
      </FormField>
      <FormField name="password">
        <Input type="password" placeholder="Password" />
      </FormField>
      <Button type="submit">Login</Button>
    </Form>
  );
}
```

### Error Handling
```tsx
<FormField name="email">
  {({ field, fieldState }) => (
    <div>
      <Input {...field} placeholder="Email" />
      {fieldState.error && (
        <p className="text-sm text-destructive">
          {fieldState.error.message}
        </p>
      )}
    </div>
  )}
</FormField>
```

### Advanced Patterns

**Async Validation**
```tsx
const asyncEmailCheck = z.string().email().refine(
  async (email) => {
    const available = await checkEmailAvailability(email);
    return available;
  },
  { message: 'Email already in use' }
);

// Usage
<FormField name="email">
  <Input placeholder="Email" />
</FormField>
```

**Custom Validation**
```tsx
const passwordMatchSchema = z.object({
  password: schemas.password(),
  confirm: z.string()
}).refine(
  (data) => data.password === data.confirm,
  {
    message: "Passwords don't match",
    path: ["confirm"]
  }
);
```

**Multi-Step Forms**
```tsx
// Step 1 schema
const personalSchema = z.object({ name: z.string() });
// Step 2 schema  
const contactSchema = z.object({ email: schemas.email() });

// Combine for final submission
const fullSchema = personalSchema.merge(contactSchema);
```

## API Integration

### Form Submission
```tsx
async function onSubmit(data) {
  try {
    const response = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errors = await response.json();
      // Set form errors from API response
      Object.entries(errors).forEach(([path, message]) => {
        methods.setError(path, { message });
      });
      return;
    }
    
    // Handle success
  } catch (error) {
    // Handle network errors
  }
}
```

### Error Handling
```tsx
// API error response format
{
  "errors": {
    "email": "Already in use",
    "password": "Too weak"
  }
}

// Zod schema for error responses
const errorSchema = z.object({
  errors: z.record(z.string())
});
```

### Loading States
```tsx
const [isSubmitting, setIsSubmitting] = useState(false);

async function onSubmit(data) {
  setIsSubmitting(true);
  try {
    await submitData(data);
  } finally {
    setIsSubmitting(false);
  }
}

<Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? 'Sending...' : 'Submit'}
</Button>
```

## Cards

### Structure
- Base: `rounded-lg border bg-card shadow-sm`
- Header: `px-6 py-4 border-b`
- Content: `p-6`

### Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Card content |
| className | string | - | Additional classes |

```tsx
/**
 * Container for grouped content
 * @param children - Card content sections
 * @param className - Additional Tailwind classes
 * @returns JSX.Element
 */
interface CardProps {
  children: React.ReactNode
  className?: string
}

<Card>
  <CardHeader>Title</CardHeader>
  <CardContent>
    <p>Content goes here</p>
  </CardContent>
</Card>
```

## Navigation

### Requirements
- Mobile-responsive
- Accessible keyboard nav
- Active state highlighting

### Breakpoints
| Screen | Behavior |
|--------|----------|
| <768px | Hamburger menu |
| ≥768px | Horizontal nav |

### Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| children | ReactNode | - | Nav items |
| orientation | 'horizontal' \| 'vertical' | 'horizontal' | Layout direction |

### Nav Item Props
| Name | Type | Default | Description |
|------|------|---------|-------------|
| href | string | - | Target route |
| children | ReactNode | - | Link content |
| active | boolean | false | Active state |

### Validation Rules
| Prop | Rules |
|------|-------|
| href | Must be valid URL path |
| active | Should match current route |

### Zod Schemas
```ts
// Route validation
const navItemSchema = z.object({
  href: z.string().min(1, 'Navigation path is required')
    .startsWith('/', 'Path must start with /')
    .regex(/^[\w\-/]+$/, 'Only letters, numbers, hyphens and slashes allowed'),
  active: z.boolean().optional()
});
```

```tsx
/**
 * Navigation component
 * @param children - Navigation items
 * @param orientation - Layout direction
 * @returns JSX.Element
 */
interface NavigationProps {
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
}

/**
 * Navigation link item
 * @param href - Target route
 * @param children - Link content
 * @param active - Whether item represents current route
 * @returns JSX.Element
 */
interface NavItemProps {
  href: string
  children: React.ReactNode
  active?: boolean
}

<Navigation>
  <NavItem href="/">Home</NavItem>
  <NavItem href="/about">About</NavItem>
</Navigation>
