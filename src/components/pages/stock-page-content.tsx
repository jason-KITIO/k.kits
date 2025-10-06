"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Clock } from "lucide-react";
import Link from "next/link";
import { PageHeader, LoadingSkeleton, ErrorDisplay } from "@/components/shared";
import { StockTable, StockStats, StockAdjustmentDialog } from "@/components/stock";
import { useStockPage } from "@/hooks/pages/use-stock-page";

export function StockPageContent() {
  const {
    organizationId,
    storeId,
    stocks,
    isLoading,
    error,
    selectedStock,
    setSelectedStock,
    handleAdjustment,
    isAdjusting,
  } = useStockPage();

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <LoadingSkeleton type="stats" columns={4} />
        <LoadingSkeleton type="table" rows={5} columns={7} />
      </div>
    );
  }

  if (error) return <ErrorDisplay message={error.message} />;

  const actions = (
    <>
      <Button asChild>
        <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}/employee-stock`}>
          <Package className="h-4 w-4 mr-2" />
          Mon Stock
        </Link>
      </Button>
      <Button asChild variant="outline">
        <Link href={`/preferences/organizations/${organizationId}/stores/${storeId}/stock-requests`}>
          <Clock className="h-4 w-4 mr-2" />
          Requêtes
        </Link>
      </Button>
    </>
  );

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Stock"
        description="État des stocks et ajustements"
        actions={actions}
      />

      <StockStats stocks={stocks || []} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            État des stocks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <StockTable
            data={stocks || []}
            onAdjust={(stock) => setSelectedStock(stock)}
          />
        </CardContent>
      </Card>

      {selectedStock && (
        <StockAdjustmentDialog
          stock={selectedStock}
          onSubmit={handleAdjustment}
          isLoading={isAdjusting}
        />
      )}
    </div>
  );
}