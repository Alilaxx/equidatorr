"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function RRRCalculatorPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    monthlyIncome: "",
    existingLoans: "",
    monthlyExpenses: "",
    goal: "",
    expectedReturn: "",
    minimumReturn: "",
    principalCapital: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/calculate-rrr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (response.ok) {
        router.push("/stock-suggestion")
      } else {
        console.error("Error calculating RRR:", data.error)
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">RRR Calculator</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {Object.entries(formData).map(([key, value]) => (
              <div key={key}>
                <Label htmlFor={key} className="block text-sm font-medium text-gray-700 mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
                </Label>
                <Input
                  type={
                    key === "age" || key.includes("Income") || key.includes("Expenses") || key.includes("Capital")
                      ? "number"
                      : "text"
                  }
                  name={key}
                  id={key}
                  value={value}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            ))}
            <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
              Calculate RRR
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

