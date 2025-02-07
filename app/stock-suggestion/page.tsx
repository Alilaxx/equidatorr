"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function StockSuggestionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleGetSuggestions = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/suggest-stocks", {
        method: "GET",
      })
      const data = await response.json()
      if (response.ok) {
        router.push("/results")
      } else {
        console.error("Error getting stock suggestions:", data.error)
      }
    } catch (error) {
      console.error("Error fetching stock suggestions:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Get Stock Suggestions</h2>
          <p className="text-gray-600 text-center mb-6">
            Based on your RRR calculation, we'll suggest stocks that match your risk profile and investment goals.
          </p>
          <Button
            onClick={handleGetSuggestions}
            disabled={loading}
            className="w-full bg-black text-white hover:bg-gray-800"
          >
            {loading ? "Loading..." : "Get Stock Suggestions"}
          </Button>
        </div>
      </div>
    </div>
  )
}

