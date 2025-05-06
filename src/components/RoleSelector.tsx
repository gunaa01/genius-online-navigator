import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { RoleBadge } from "@/components/RoleBadge"
import { Check, ChevronDown, UserCog } from "lucide-react"

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'developer', label: 'Developer' },
  { value: 'designer', label: 'Designer' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'member', label: 'Member' },
]

interface RoleSelectorProps {
  currentRole: string
  onRoleChange: (role: string) => void
  disabled?: boolean
  align?: 'start' | 'center' | 'end'
}

export function RoleSelector({ 
  currentRole, 
  onRoleChange, 
  disabled = false, 
  align = 'end' 
}: RoleSelectorProps) {
  const [open, setOpen] = useState(false)

  const handleRoleChange = (role: string) => {
    onRoleChange(role)
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
          disabled={disabled}
        >
          <RoleBadge role={currentRole} className="text-xs" />
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-48">
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          Change role to
        </div>
        {roles.map((role) => (
          <DropdownMenuItem
            key={role.value}
            onClick={() => handleRoleChange(role.value)}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <RoleBadge role={role.value} />
            </div>
            {currentRole === role.value && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
