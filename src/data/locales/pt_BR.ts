export const pt_BR = {
	person: {
		firstNames: ["Miguel", "Laura", "Ana", "Pedro", "Sofia"],
		lastNames: ["Silva", "Santos", "Oliveira", "Souza", "Lima"],
	},
	internet: { emailDomains: ["exemplo.com", "email.com", "dev.br"] },
	address: {
		streetPrefixes: ["Rua", "Avenida", "Travessa"],
		streetNames: [
			"das Flores",
			"dos Pinheiros",
			"da Praia",
			"da Liberdade",
			"São Paulo",
			"Rio Branco",
		],
		streetSuffixes: [""],
		cities: [
			"São Paulo",
			"Rio de Janeiro",
			"Belo Horizonte",
			"Curitiba",
			"Porto Alegre",
		],
		states: [
			{ code: "SP", name: "São Paulo" },
			{ code: "RJ", name: "Rio de Janeiro" },
			{ code: "MG", name: "Minas Gerais" },
			{ code: "PR", name: "Paraná" },
			{ code: "RS", name: "Rio Grande do Sul" },
		],
		zipFormat: "#####-###",
		numberMin: 1,
		numberMax: 9999,
	},
	phone: {
		formats: ["(##) 9####-####", "+55 ## 9####-####"],
	},
	commerce: {
		categories: ["Eletrônicos", "Casa", "Vestuário", "Esportes", "Livros"],
		productNames: [
			"Fone de Ouvido Sem Fio",
			"Lâmpada Inteligente",
			"Tênis de Corrida",
			"Garrafa de Água",
			"Caderno",
		],
		currency: "BRL",
		priceMin: 5,
		priceMax: 1999,
	},
} as const;
