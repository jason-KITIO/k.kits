import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CategoryForm } from "./category-form";
import {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
} from "@/types/category";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: Category;
  categories?: Category[];
  onSubmit: (data: CreateCategoryData | UpdateCategoryData) => void;
  isLoading?: boolean;
}

export function CategoryModal({
  isOpen,
  onClose,
  category,
  categories,
  onSubmit,
  isLoading,
}: CategoryModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {category ? "Modifier la catégorie" : "Nouvelle catégorie"}
          </DialogTitle>
        </DialogHeader>
        <CategoryForm
          category={category}
          categories={categories}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
}
