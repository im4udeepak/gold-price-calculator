"use client";
import React, { useState } from "react";

export default function Home() {
  // State definitions with types
  const [goldPrice, setGoldPrice] = useState<number | "">(""); // Price per gram of gold
  const [weight, setWeight] = useState<number | "">(""); // Weight of gold in grams
  const [makingChargeRate, setMakingChargeRate] = useState<number>(1); // Making charge percentage
  const [gstRate, setGstRate] = useState<number>(0); // GST percentage
  const [totalPrice, setTotalPrice] = useState<number>(0); // Final calculated price
  const [goldType, setGoldType] = useState<string>("24K"); // Type of gold
  const [errors, setErrors] = useState<{ goldPrice?: string; weight?: string }>({});

  // Function to validate form
  const validateForm = () => {
    const newErrors: { goldPrice?: string; weight?: string } = {};
    if (!goldPrice) newErrors.goldPrice = "Gold Price is required";
    if (goldPrice && goldPrice <= 0) newErrors.goldPrice = "Gold Price must be greater than 0";
    if (!weight) newErrors.weight = "Weight is required";
    if (weight && weight <= 0) newErrors.weight = "Weight must be greater than 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Function to calculate total price
  const calculateTotal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setErrors({});

    const goldTypeMultiplier =
      goldType === "24K"
        ? 1
        : goldType === "22K"
          ? 0.916
          : goldType === "21K"
            ? 0.875
            : goldType === "18K"
              ? 0.75
              : 1;
    const adjustedGoldPrice = (goldPrice as number) * goldTypeMultiplier;

    const goldCost = adjustedGoldPrice * (weight as number);
    const makingCharges = (makingChargeRate / 100) * goldCost;
    const subtotal = goldCost + makingCharges;
    const gst = (gstRate / 100) * subtotal;
    setTotalPrice(subtotal + gst);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="sm:text-2xl text-xl font-bold text-center mb-6 text-gray-800">
          Gold Price Calculator
        </h2>
        <form onSubmit={calculateTotal} className="space-y-4">
          {/* Gold Price Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gold Price per Gram (₹)
            </label>
            <input
              type="number"
              value={goldPrice}
              onChange={(e) => setGoldPrice(parseFloat(e.target.value) || "")}
              placeholder="Gold Price per Gram (₹)"
              className="w-full mt-1 text-black p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-gray-500 text-sm mt-1">Please enter the 24k gold price per gram.</p>
            {errors.goldPrice && (
              <p className="text-red-500 text-sm mt-1">{errors.goldPrice}</p>
            )}
          </div>

          {/* Gold Type Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gold Type (Karat)
            </label>
            <select
              value={goldType}
              onChange={(e) => setGoldType(e.target.value)}
              className="w-full text-black mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="24K">24K</option>
              <option value="22K">22K</option>
              <option value="21K">21K</option>
              <option value="18K">18K</option>
            </select>
          </div>

          {/* Weight Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Weight (grams)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || "")}
              placeholder="Weight (grams)"
              className="w-full text-black mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.weight && (
              <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
            )}
          </div>

          {/* Making Charges Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Making Charges (%)
            </label>
            <select
              value={makingChargeRate}
              onChange={(e) => setMakingChargeRate(parseFloat(e.target.value))}
              className="w-full text-black mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select Making Charges (%)
              </option>
              {Array.from({ length: 100 }, (_, i) => i + 1).map((value) => (
                <option key={value} value={value}>
                  {value}%
                </option>
              ))}
            </select>
          </div>

          {/* GST Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              GST (%)
            </label>
            <select
              value={gstRate}
              onChange={(e) => setGstRate(parseFloat(e.target.value))}
              className="w-full text-black mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                Select GST (%)
              </option>
              {Array.from({ length: 29 }, (_, i) => i).map((value) => (
                <option key={value} value={value}>
                  {value}%
                </option>
              ))}
            </select>
          </div>

          {/* Calculate Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Calculate Total
          </button>

          {/* Display Total Price */}
          {totalPrice > 0 && (
            <div className="text-center mt-4 text-lg font-bold text-green-600">
              Total Price: ₹{totalPrice.toFixed(2)}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
