"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Expense {
  category: string;
  amount: number;
  percentage: number;
}

interface ExpensesByCategoryProps {
  expenses: Expense[];
}

export function ExpensesByCategory({ expenses }: ExpensesByCategoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Répartition des Dépenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {expenses.map((expense, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-medium">{expense.category}</p>
                  <p className="text-sm text-muted-foreground">{expense.percentage.toFixed(1)}% du total</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{expense.amount.toLocaleString()} €</p>
              </div>
              <div className="w-24">
                <Progress value={expense.percentage} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
