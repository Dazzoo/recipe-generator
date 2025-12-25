import { toast } from "@/hooks/useToast";

export function notifyError(title: string, description?: string): void {
  toast({
    variant: "destructive",
    title,
    description: description || title,
  });
}

export function notifySuccess(title: string, description?: string): void {
  toast({
    variant: "success",
    title,
    description: description || title,
  });
}

