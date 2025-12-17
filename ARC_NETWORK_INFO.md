# Arc Network - Informações Técnicas

## Status da Arc Network
- ✅ **Ativa e Operacional**
- Rede EVM-compatível
- Suporte a HTTP e WebSocket
- Ambientes: Testnet e Mainnet

## Node Providers Disponíveis

### 1. **Alchemy**
- **Descrição:** Developer platform providing scalable access to EVM networks with enhanced APIs, monitoring, and debugging tools
- **Recursos:** APIs avançadas, monitoring, debugging
- **Website:** https://www.alchemy.com/

### 2. **Blockdaemon**
- **Descrição:** Institutional-grade node provider offering secure and compliant infrastructure for Arc and other EVM chains
- **Recursos:** Infraestrutura segura, compliance
- **Website:** https://blockdaemon.com/

### 3. **dRPC**
- **Descrição:** Decentralized RPC aggregator providing high-speed, load-balanced access to Arc nodes through a multi-provider architecture
- **Recursos:** Load-balanced, decentralized, multi-provider
- **Website:** https://drpc.org/

### 4. **QuickNode**
- **Descrição:** High-performance blockchain infrastructure offering global endpoints and APIs for developers
- **Recursos:** Global endpoints, high-performance, APIs
- **Website:** https://www.quicknode.com/

## RPC Endpoints

### Public RPC (Arc Network)
```
https://rpc.arc.network/
```

### Testnet RPC
- Disponível através dos provedores acima
- Suporte a WebSocket para real-time updates

## Dados Disponíveis via RPC

### Wallet Data
- ✅ Saldos de ETH/tokens (balanceOf)
- ✅ Histórico de transações (getLogs, getTransactionReceipt)
- ✅ Nonce e gas price
- ✅ Código de contrato
- ✅ Storage data

### On-Chain Data
- ✅ Block data (getBlock)
- ✅ Transaction data (getTransaction)
- ✅ Gas prices (gasPrice)
- ✅ Network stats (chainId, networkVersion)

### Advanced Data
- ✅ Event logs (getLogs)
- ✅ Contract state (call)
- ✅ Account balance (getBalance)
- ✅ Pending transactions (mempool)

## Integração Recomendada

### Para Wallet Connection
- **Wagmi** - Já instalado ✅
- **Ethers.js** - Já instalado ✅
- **MetaMask/Reown** - Suportado

### Para Dados Avançados
- **Alchemy SDK** - Para dados enriquecidos
- **The Graph** - Para queries complexas
- **Blockscout API** - Para explorer data

## Chain ID Arc Network
```
ChainId: 42161 (Arbitrum One)
// ou
ChainId: específico da Arc (verificar)
```

## Endpoints Modernos Suportados

1. **eth_getBalance** - Saldo de wallet
2. **eth_call** - Chamar função de contrato
3. **eth_getLogs** - Buscar eventos
4. **eth_getTransactionByHash** - Dados de transação
5. **eth_gasPrice** - Preço de gas
6. **eth_blockNumber** - Número do bloco atual
7. **eth_getBlockByNumber** - Dados do bloco
8. **eth_sendTransaction** - Enviar transação
9. **eth_estimateGas** - Estimar gas
10. **eth_getCode** - Código de contrato

## Status de Integração
- [ ] Verificar chain ID correto da Arc
- [ ] Adicionar Arc Network ao wagmi config
- [ ] Implementar hooks para wallet data
- [ ] Criar componente WalletDetails
- [ ] Integrar no Dashboard
