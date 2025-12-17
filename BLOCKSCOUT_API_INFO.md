# Blockscout API - Documentação

## Base URLs
- **Ethereum:** https://eth.blockscout.com/api/v2
- **Arbitrum One:** https://blockscout.com/arbitrum/one/api/v2
- **API Docs:** https://instance-name/api-docs (ex: https://eth.blockscout.com/api-docs)

## Principais Endpoints

### 1. Informações de Endereço
```
GET /addresses/{address}
GET /addresses/{address}/coin_balance_history
GET /addresses/{address}/token_balances
GET /addresses/{address}/tokens
```

### 2. Transações
```
GET /transactions
GET /transactions/{tx_hash}
GET /addresses/{address}/transactions
GET /blocks/{block_number}/transactions
```

### 3. Tokens
```
GET /tokens
GET /tokens/{address_hash}
GET /tokens/{address_hash}/holders
GET /tokens/{address_hash}/transfers
```

### 4. Blocos
```
GET /blocks
GET /blocks/{block_number}
GET /blocks/{block_number}/transactions
```

### 5. NFTs
```
GET /nft
GET /nft/{address_hash}
GET /nft/{address_hash}/instances
```

## Parâmetros Comuns

- **Paginação:** Usa keyset pagination com `next_page_params`
- **Items por página:** Default 50, máximo 100
- **Filtros:** block_number, index, items_count, etc

## Exemplo de Requisição

```javascript
// Buscar transações de um endereço
fetch('https://blockscout.com/arbitrum/one/api/v2/addresses/0x1234.../transactions')
  .then(r => r.json())
  .then(data => console.log(data))

// Response contém:
// - items: array de transações
// - next_page_params: parâmetros para próxima página
```

## Autenticação
- **Sem autenticação necessária** para endpoints públicos
- Rate limiting: Verificar documentação específica da instância

## Tipos de Dados Retornados

### Transaction Object
```json
{
  "hash": "0x...",
  "from": { "hash": "0x...", "name": null },
  "to": { "hash": "0x...", "name": null },
  "value": "1000000000000000000",
  "gas_used": "21000",
  "gas_price": "50000000000",
  "block_number": 12345678,
  "timestamp": "2025-12-16T21:00:00Z",
  "status": "ok",
  "type": "transaction"
}
```

### Address Object
```json
{
  "hash": "0x...",
  "coin_balance": "1000000000000000000",
  "transaction_count": 42,
  "token_balances": [
    {
      "token": { "address": "0x...", "symbol": "USDC", "decimals": 6 },
      "value": "1000000000"
    }
  ]
}
```

## Integração no Projeto

### Para Arc Network (Arbitrum One)
```
Base URL: https://blockscout.com/arbitrum/one/api/v2
```

### Endpoints Necessários
1. **GET /addresses/{address}** - Saldo e info da wallet
2. **GET /addresses/{address}/transactions** - Histórico de transações
3. **GET /addresses/{address}/token_balances** - Saldos de tokens
4. **GET /nft** - NFTs da wallet (se disponível)

## Limitações
- Sem autenticação pode ter rate limiting
- Alguns dados podem estar atrasados (5-10 segundos)
- NFTs podem não estar completamente indexados em todas as chains

## Alternativas
- **The Graph:** GraphQL queries para dados mais complexos
- **Alchemy API:** Dados enriquecidos com autenticação
- **Moralis API:** NFTs e dados de portfolio
