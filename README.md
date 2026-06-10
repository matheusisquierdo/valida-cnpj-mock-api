# CNPJ Mock API — Receita Federal

API mock para validação de CNPJ, simulando a Receita Federal.

## Regras de negócio

| Condição | Resultado |
|---|---|
| CNPJ inválido (formato/dígitos) | `INVALIDO` — HTTP 400/422 |
| Último dígito **ímpar** | `INATIVO` — situação INAPTA |
| Termina com **...22** (penúltimo=2, último=2) | `ATIVO` — situação ATIVA |
| Demais CNPJs válidos | `ATIVO` — situação ATIVA |

## Endpoint

```
GET /api/validate?cnpj={CNPJ}
```

CNPJ pode ser enviado com ou sem formatação:
- `11.222.333/0001-81`
- `11222333000181`

## Exemplos de resposta

### CNPJ Ativo (termina em 22)
```json
{
  "cnpj": "11.222.333/0001-22",
  "status": "ATIVO",
  "situacao_cadastral": "ATIVA",
  "data_situacao": "2020-01-15",
  "razao_social": "EMPRESA MOCK ATIVA LTDA",
  "uf": "SP",
  "municipio": "SÃO PAULO",
  "mensagem": "CNPJ com situação ativa na Receita Federal."
}
```

### CNPJ Inativo (último dígito ímpar)
```json
{
  "cnpj": "11.222.333/0001-81",
  "status": "INATIVO",
  "situacao_cadastral": "INAPTA",
  "data_situacao": "2023-06-01",
  "razao_social": "EMPRESA MOCK INAPTA LTDA",
  "uf": "RJ",
  "municipio": "RIO DE JANEIRO",
  "mensagem": "CNPJ com situação inativa/inapta na Receita Federal."
}
```

### CNPJ Inválido
```json
{
  "cnpj": "00.000.000/0000-00",
  "status": "INVALIDO",
  "situacao_cadastral": null,
  "mensagem": "CNPJ inválido: dígitos verificadores incorretos."
}
```

## Deploy na Vercel (gratuito)

### Opção 1: Via GitHub (recomendado)
1. Crie um repositório no GitHub com esses arquivos
2. Acesse [vercel.com](https://vercel.com) → "New Project"
3. Importe seu repositório
4. Clique em **Deploy** — pronto! ✓

### Opção 2: Via CLI
```bash
npm i -g vercel
cd cnpj-mock-api
vercel
```

A Vercel detecta automaticamente a pasta `/api` e faz o deploy das serverless functions.

## Estrutura do projeto
```
cnpj-mock-api/
├── api/
│   └── validate.js    ← função serverless
├── package.json
└── README.md
```
