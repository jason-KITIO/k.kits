export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string;
  organizationId: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
  products?: unknown[];
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  parentId?: string;
}

export interface UpdateCategoryData extends Partial<CreateCategoryData> {
  active?: boolean;
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
}
