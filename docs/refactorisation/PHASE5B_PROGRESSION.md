# 🚀 PHASE 5B - PAGES MOYENNES (100-300 lignes)

## 📊 OBJECTIF
Refactoriser 12 pages moyennes pour éliminer **~1,500 lignes de code**.

---

## 📋 PAGES À REFACTORISER

| # | Page | Lignes | Priorité | Statut |
|---|------|--------|----------|--------|
| 1 | Suppliers | 250 | Haute | ⏳ |
| 2 | Warehouses | 200 | Haute | ⏳ |
| 3 | Customers New | 180 | Haute | ⏳ |
| 4 | Categories | 150 | Moyenne | ⏳ |
| 5 | Settings | 150 | Moyenne | ⏳ |
| 6 | Legal Privacy | 120 | Basse | ⏳ |
| 7 | Legal Terms | 130 | Basse | ⏳ |
| 8 | Error 400 | 45 | Basse | ⏳ |
| 9 | Error 401 | 45 | Basse | ⏳ |
| 10 | Error 403 | 48 | Basse | ⏳ |
| 11 | Error 500 | 45 | Basse | ⏳ |
| 12 | Error 503 | 45 | Basse | ⏳ |

**Total estimé** : ~1,408 lignes

---

## 🎯 STRATÉGIE

### Groupe 1 : Pages avec DataTable (Suppliers, Warehouses, Categories)
- Réutiliser le pattern Products/Users
- Créer colonnes + Stats + Actions
- **Gain estimé** : -600 lignes

### Groupe 2 : Pages de formulaires (Customers New)
- Réutiliser le pattern Organization Form
- **Gain estimé** : -150 lignes

### Groupe 3 : Pages de configuration (Settings)
- Tabs + composants existants
- **Gain estimé** : -120 lignes

### Groupe 4 : Pages légales (Privacy, Terms)
- Template réutilisable + contenu
- **Gain estimé** : -200 lignes

### Groupe 5 : Pages d'erreur (5 pages)
- Template unique + variantes
- **Gain estimé** : -180 lignes

---

**Dernière mise à jour** : Démarrage...
