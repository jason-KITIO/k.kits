"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared";
import { SaleItemForm } from "@/components/sales/sale-item-form";
import { CustomerSelector } from "@/components/sales/customer-selector";
import { useNewSale } from "@/hooks/pages/use-new-sale";

export default function NewSalePage() {
  const {
    organizationId,
    storeId,
    saleData,
    setSaleData,
    customers,
    storeStock,
    totalAmount,
    addItem,
    removeItem,
    updateItem,
    handleSubmit,
    isCreating,
  } = useNewSale();

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Encaisser une Vente"
        description="Enregistrer les articles vendus et encaisser le paiement"
        backUrl={`/preferences/organizations/${organizationId}/stores/${storeId}`}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Détails de la transaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerSelector
              organizationId={organizationId}
              storeId={storeId}
              customers={customers}
              value={saleData.customerId}
              onChange={(value) => setSaleData(prev => ({ ...prev, customerId: value }))}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Articles à vendre
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SaleItemForm
              items={saleData.items}
              storeStock={storeStock}
              onUpdateItem={updateItem}
              onAddItem={addItem}
              onRemoveItem={removeItem}
            />
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl font-bold bg-green-50 p-3 rounded">
                <span>Le client paie :</span>
                <span className="text-green-700">{totalAmount.toLocaleString()} FCFA</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={isCreating || saleData.items.every(item => !item.productId)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {isCreating ? "Enregistrement..." : "💰 Encaisser la vente"}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}/sales`}>
                  Annuler
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}