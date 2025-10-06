import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CustomerFormFields({ form }: { form: any }) {
  return (
    <>
      <FormField control={form.control} name="name" render={({ field }) => (
        <FormItem>
          <FormLabel>Nom complet *</FormLabel>
          <FormControl><Input placeholder="Ex: Jean Dupont" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="type" render={({ field }) => (
        <FormItem>
          <FormLabel>Type de client *</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
            <SelectContent>
              <SelectItem value="INDIVIDUAL">Particulier</SelectItem>
              <SelectItem value="COMPANY">Entreprise</SelectItem>
              <SelectItem value="VIP">VIP</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="email" render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl><Input type="email" placeholder="Ex: jean.dupont@email.com" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="phone" render={({ field }) => (
        <FormItem>
          <FormLabel>Téléphone</FormLabel>
          <FormControl><Input placeholder="Ex: +237 698 765 432" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
      <FormField control={form.control} name="address" render={({ field }) => (
        <FormItem>
          <FormLabel>Adresse</FormLabel>
          <FormControl><Input placeholder="Ex: 123 Rue de la Paix, Paris" {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )} />
    </>
  );
}
