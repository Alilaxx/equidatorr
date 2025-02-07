"use client"

import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Button } from "@/components/ui/button"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface StockData {
  symbol: string
  name: string
  currentPrice: number
  predictedPrice: number
  recommendation: string
}

export default function ResultsPage() {
  const [stockData, setStockData] = useState<StockData[]>([])
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch("/api/stock-results")
        const data = await response.json()
        setStockData(data.stocks)
        if (data.stocks.length > 0) {
          setSelectedStock(data.stocks[0])
        }
      } catch (error) {
        console.error("Error fetching stock results:", error)
      }
    }

    fetchResults()
  }, [])

  const chartData = {
    labels: ["Current", "Predicted"],
    datasets: [
      {
        label: "Stock Price",
        data: selectedStock ? [selectedStock.currentPrice, selectedStock.predictedPrice] : [],
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${selectedStock?.symbol} - Current vs Predicted Price`,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Stock Analysis Results</h2>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Recommended Stocks:</h3>
            <div className="grid grid-cols-2 gap-4">
              {stockData.map((stock) => (
                <Button
                  key={stock.symbol}
                  onClick={() => setSelectedStock(stock)}
                  variant={selectedStock?.symbol === stock.symbol ? "default" : "outline"}
                  className="w-full"
                >
                  {stock.symbol}
                </Button>
              ))}
            </div>
          </div>
          {selectedStock && (
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {selectedStock.name} ({selectedStock.symbol})
              </h3>
              <p className="mb-2">Current Price: ${selectedStock.currentPrice.toFixed(2)}</p>
              <p className="mb-2">Predicted Price: ${selectedStock.predictedPrice.toFixed(2)}</p>
              <p className="mb-4">Recommendation: {selectedStock.recommendation}</p>
              <div className="h-64">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

