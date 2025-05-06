import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertCircle } from "lucide-react"

interface DeleteTeamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  teamName?: string
}

export function DeleteTeamDialog({ open, onOpenChange, onConfirm, teamName = "this team" }: DeleteTeamDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <DialogTitle>Delete {teamName}?</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            This action cannot be undone. This will permanently delete {teamName} and all of its data including members, projects, and settings.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
          >
            Delete {teamName}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
