import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/category";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteCategoryModal({
  isOpen,
  onClose,
  category,
  onConfirm,
  isLoading,
}: DeleteCategoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Supprimer la catégorie</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir supprimer la catégorie &quot;{category?.name}&quot; ?
            Cette action est irréversible et supprimera également toutes les
            sous-catégories.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Suppression..." : "Supprimer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
