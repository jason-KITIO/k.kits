import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SupplierSelectorProps {
  value: string;
  onChange: (value: string) => void;
  suppliers?: Array<{ id: string; name: string }>;
  isLoading: boolean;
}

export function SupplierSelector({ value, onChange, suppliers, isLoading }: SupplierSelectorProps) {
  return (
    <FormItem>
      <FormLabel>Fournisseur</FormLabel>
      <Select onValueChange={onChange} defaultValue={value}>
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner un fournisseur" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {isLoading ? (
            <SelectItem value="" disabled>Chargement...</SelectItem>
          ) : suppliers && suppliers.length > 0 ? (
            suppliers.map((supplier) => (
              <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
            ))
          ) : (
            <SelectItem value="" disabled>Aucun fournisseur disponible</SelectItem>
          )}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  );
}
