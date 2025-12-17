import { useEffect, useState } from 'react'

export interface PortfolioAsset {
  symbol: string
  amount: number
  value?: number
}

export interface Portfolio {
  assets: PortfolioAsset[]
  totalValue: number
}

const STORAGE_KEY = 'arc_portfolio'

export function usePortfolio() {
  const [portfolio, setPortfolio] = useState<Portfolio>({ assets: [], totalValue: 0 })

  // Load portfolio from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setPortfolio(JSON.parse(saved))
      } catch (err) {
        console.error('Failed to load portfolio:', err)
      }
    }
  }, [])

  const savePortfolio = (newPortfolio: Portfolio) => {
    setPortfolio(newPortfolio)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPortfolio))
  }

  const addAsset = (asset: PortfolioAsset) => {
    const updated = { ...portfolio }
    const existing = updated.assets.findIndex(a => a.symbol === asset.symbol)
    
    if (existing >= 0) {
      updated.assets[existing].amount += asset.amount
    } else {
      updated.assets.push(asset)
    }
    
    updated.totalValue = updated.assets.reduce((sum, a) => sum + (a.value || 0), 0)
    savePortfolio(updated)
  }

  const removeAsset = (symbol: string) => {
    const updated = { ...portfolio }
    updated.assets = updated.assets.filter(a => a.symbol !== symbol)
    updated.totalValue = updated.assets.reduce((sum, a) => sum + (a.value || 0), 0)
    savePortfolio(updated)
  }

  const clearPortfolio = () => {
    savePortfolio({ assets: [], totalValue: 0 })
  }

  return { portfolio, addAsset, removeAsset, clearPortfolio, savePortfolio }
}
