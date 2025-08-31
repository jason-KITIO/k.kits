/**
 * Génère un SKU basé sur le nom du produit
 * @param name - Nom du produit
 * @returns SKU généré
 */
export function generateSku(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ç]/g, "c")
    .replace(/[ñ]/g, "n")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Génère un SKU unique en ajoutant un suffixe numérique si nécessaire
 * @param baseSku - SKU de base
 * @param existingSkus - Liste des SKUs existants
 * @returns SKU unique
 */
export function generateUniqueSku(
  baseSku: string,
  existingSkus: string[]
): string {
  let uniqueSku = baseSku;
  let counter = 1;

  while (existingSkus.includes(uniqueSku)) {
    uniqueSku = `${baseSku}-${counter}`;
    counter++;
  }

  return uniqueSku;
}
