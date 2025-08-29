# k.kits

Application de gestion d’inventaire et de stock pour organisations, développée avec Next.js, Prisma, et TypeScript.

## 🚀 Fonctionnalités principales

- Authentification par email et téléphone
- Gestion des organisations, employés, rôles et permissions
- Suivi des produits, alertes de stock, inventaires, mouvements et transferts
- Gestion des fournisseurs, entrepôts, commandes d’achat
- Génération de rapports et tableaux de bord
- API RESTful documentée (OpenAPI)

## 🛠️ Technologies utilisées

- Next.js
- TypeScript
- Prisma
- PostgreSQL
- Jest (tests)
- Redis
- Twilio (SMS)

## 📁 Architecture des fichiers

L’application est organisée comme suit :

```
├── app/                # Frontend et routes API
│   ├── api/            # Endpoints API REST (auth, organization, products, etc.)
│   ├── globals.css     # Styles globaux
│   ├── layout.tsx      # Layout principal
│   └── page.tsx        # Page d’accueil
├── prisma/             # Schéma et migrations Prisma
├── public/             # Fichiers statiques (images, icônes)
├── src/
│   ├── helper/         # Fonctions utilitaires
│   ├── lib/            # Accès DB, email, SMS, etc.
│   └── template/       # Templates email/SMS
├── __tests__/          # Tests unitaires
├── package.json        # Dépendances et scripts
├── tsconfig.json       # Configuration TypeScript
├── jest.config.js      # Configuration des tests
├── openapi.json        # Documentation API
```

Pour le détail complet, voir l’arborescence :

```
eslint.config.mjs
jest.config.js
next-env.d.ts
next.config.ts
openapi.json
package.json
pnpm-lock.yaml
postcss.config.mjs
README.md
test-prisma-connection.ts
tsconfig.json
__tests__/
app/
	favicon.ico
	globals.css
	layout.tsx
	page.tsx
	api/
		auth/
			email/
				login/
					route.ts
					send-verification/
					verify/
				register/
					route.ts
				verify/
					route.ts
			me/
				route.ts
			phone/
				login/
					route.ts
					verify/
				send-verification/
					route.ts
				verify/
					route.ts
			session/
				route.ts
		docs/
			route.ts
		organization/
			route.ts
			[organizationId]/
				categories/
					route.ts
					[categoryId]/
					tree/
				dashboard/
					low-stock/
					stock-overview/
					stock-value/
				employee-stock/
					route.ts
					[userId]/
					adjust/
				invitations/
					accept/
					send/
				products/
					route.ts
					[productId]/
					barcode/
					low-stock/
					search/
				purchase-orders/
					route.ts
					[purchaseOrdersId]/
				quick/
					stock-in/
					stock-out/
					...
				reports/
				roles/
				stock-alerts/
				stock-inventories/
				stock-movements/
				stock-transfers/
				suppliers/
				warehouse-stock/
				warehouses/
		api-docs/
			page.tsx
prisma/
	schema.prisma
	migrations/
		migration_lock.toml
		... (dossiers de migration)
public/
	file.svg
	globe.svg
	next.svg
	vercel.svg
	window.svg
src/
	helper/
		check-organization.ts
		verify-location-ownership.ts
	lib/
		db.ts
		email.ts
		prisma.ts
		redis.ts
		sms.ts
		swagger.ts
		twilio.ts
	template/
		email-magic-link.ts
		invitation.html
		otp-verification-sms.html
		otp-verification.html
		sms-template.ts
		welcome-email.html
```

## ▶️ Démarrage rapide

```bash
pnpm install
pnpm dev
```

Ouvre [http://localhost:3000](http://localhost:3000) pour voir l’application.

## 📚 Documentation & Ressources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [OpenAPI](openapi.json)
- [Déploiement sur Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

---

_Projet open source, contributions bienvenues !_
