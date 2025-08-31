"use client";

import { useCategoryTree } from "@/hooks/use-categories";
import { CategoryTree as CategoryTreeType } from "@/types/category";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface CategoryTreeProps {
  organizationId: string;
  onCategorySelect?: (category: CategoryTreeType) => void;
}

export function CategoryTree({
  organizationId,
  onCategorySelect,
}: CategoryTreeProps) {
  const { data: tree = [], isLoading } = useCategoryTree(organizationId);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (categoryId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedNodes(newExpanded);
  };

  const renderTreeNode = (category: CategoryTreeType, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedNodes.has(category.id);

    return (
      <div key={category.id} className={`ml-${level * 4}`}>
        <Collapsible
          open={isExpanded}
          onOpenChange={() => toggleNode(category.id)}
        >
          <Card className="mb-1">
            <CardContent className="p-2">
              <div className="flex items-center space-x-2">
                {hasChildren && (
                  <CollapsibleTrigger className="p-1">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </CollapsibleTrigger>
                )}
                {!hasChildren && <div className="w-6" />}

                <div
                  className="flex items-center space-x-2 flex-1 cursor-pointer hover:bg-muted/50 p-1 rounded"
                  onClick={() => onCategorySelect?.(category)}
                >
                  {category.icon && <span>{category.icon}</span>}
                  {category.color && (
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: category.color }}
                    />
                  )}
                  <span className="text-sm font-medium">{category.name}</span>
                  {category.products && (
                    <span className="text-xs text-muted-foreground">
                      ({category.products.length})
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {hasChildren && (
            <CollapsibleContent>
              <div className="ml-4">
                {category.children.map((child) =>
                  renderTreeNode(child, level + 1)
                )}
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      </div>
    );
  };

  if (isLoading) {
    return <div className="p-4">Chargement de l&apos;arbre des catégories...</div>;
  }

  return (
    <div className="space-y-1">
      {tree.length === 0 ? (
        <div className="p-4 text-center text-muted-foreground">
          Aucune catégorie disponible
        </div>
      ) : (
        tree.map((category) => renderTreeNode(category))
      )}
    </div>
  );
}
