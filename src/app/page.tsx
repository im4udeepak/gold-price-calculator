"use client";
import React, { useCallback, useEffect, useState } from "react";



export default function Home() {
  // State definitions with types
  const [currentGoldPrice, setCurrentGoldPrice] = useState<number | null>(null);
  const [language, setLanguage] = useState<"en" | "hi">("en"); // State for language selection
  const [otherPrice, setOtherPrice] = useState<number>(0); // Price per gram of gold
  const [goldPrice, setGoldPrice] = useState<number | "">(""); // Price per gram of gold
  const [weight, setWeight] = useState<number | "">(""); // Weight of gold in grams
  const [makingChargeRate, setMakingChargeRate] = useState<number>(1); // Making charge percentage
  const [gstRate, setGstRate] = useState<number>(0); // GST percentage
  // const [totalPrice, setTotalPrice] = useState<number>(0); // Final calculated price
  const [goldType, setGoldType] = useState<string>("24K"); // Type of gold
  const [errors, setErrors] = useState<{ goldPrice?: string; weight?: string }>({});
  const [breakdown, setBreakdown] = useState<{
    goldCost: number;
    makingCharges: number;
    gst: number;
    otherPrice: number;
    total: number;
  } | null>(null); // For detailed breakdown

  const translations = {
    en: {
      title: "Gold Price Calculator",
      goldPriceLabel: "Gold Price per Gram (₹)",
      goldPricePlaceholder: "Gold Price per Gram (₹)",
      goldPriceNote: `The current gold price is set to ₹{price} per gram by default. You can update it to your preferred price if needed.`,
      goldPriceNoteExtra: "Please enter the 24k gold price per gram.",
      goldTypeLabel: "Gold Type (Karat)",
      weightLabel: "Weight (grams)",
      weightPlaceholder: "Weight (grams)",
      makingChargesLabel: "Making Charges (%)",
      gstLabel: "GST (%)",
      otherPriceLabel: "Other Price (₹) (Optional)",
      otherPricePlaceholder: "Other Price (₹) (Optional)",
      calculateButton: "Calculate Total",
      resetButton: "Reset",
      priceBreakdownTitle: "Price Breakdown:",
      goldCost: "Gold Price",
      makingCharges: "Making Charges",
      gst: "GST",
      otherPrice: "Other Price",
      totalPrice: "Total Price",
      errors: {
        goldPriceRequired: "Gold Price is required",
        goldPricePositive: "Gold Price must be greater than 0",
        weightRequired: "Weight is required",
        weightPositive: "Weight must be greater than 0",
      },
      choose: "Select",
    },
    hi: {
      title: "सोने की कीमत कैलकुलेटर",
      goldPriceLabel: "प्रति ग्राम सोने की कीमत (₹)",
      goldPricePlaceholder: "प्रति ग्राम सोने की कीमत (₹)",
      goldPriceNote: `वर्तमान में प्रति ग्राम सोने की कीमत ₹{price} है। आप इसे अपनी पसंदीदा कीमत पर अपडेट कर सकते हैं।`,
      goldPriceNoteExtra: "कृपया 24K सोने की प्रति ग्राम कीमत दर्ज करें।",
      goldTypeLabel: "सोने का प्रकार (कैरेट)",
      weightLabel: "वजन (ग्राम)",
      weightPlaceholder: "वजन (ग्राम)",
      makingChargesLabel: "मेकिंग चार्ज (%)",
      gstLabel: "जीएसटी (%)",
      otherPriceLabel: "अन्य कीमत (₹) (वैकल्पिक)",
      otherPricePlaceholder: "अन्य कीमत (₹) (वैकल्पिक)",
      calculateButton: "कुल गणना करें",
      resetButton: "रीसेट करें",
      priceBreakdownTitle: "मूल्य विवरण:",
      goldCost: "सोने की कीमत",
      makingCharges: "मेकिंग चार्ज",
      gst: "जीएसटी",
      otherPrice: "अन्य कीमत",
      totalPrice: "कुल कीमत",
      errors: {
        goldPriceRequired: "सोने की कीमत आवश्यक है",
        goldPricePositive: "सोने की कीमत 0 से अधिक होनी चाहिए",
        weightRequired: "वजन आवश्यक है",
        weightPositive: "वजन 0 से अधिक होना चाहिए",
      },
      choose: "चुने",
    },
  };
  // Function to validate form
  const t = translations[language];

  const validateForm = () => {
    const newErrors: { goldPrice?: string; weight?: string } = {};
    if (!goldPrice) newErrors.goldPrice = t.errors.goldPriceRequired;
    if (goldPrice && goldPrice <= 0) newErrors.goldPrice = t.errors.goldPricePositive;
    if (!weight) newErrors.weight = t.errors.weightRequired;
    if (weight && weight <= 0) newErrors.weight = t.errors.weightPositive;
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
            : goldType === "20K"
              ? 0.833
              : goldType === "18K"
                ? 0.75
                : goldType === "16K"
                  ? 0.666
                  : 1;
    // const adjustedGoldPrice = (goldPrice as number) * goldTypeMultiplier;
    // const goldCost = adjustedGoldPrice * (weight as number);
    // const makingCharges = (makingChargeRate / 100) * goldCost;
    // const subtotal = goldCost + makingCharges;
    // const gst = (gstRate / 100) * subtotal;
    // setTotalPrice(subtotal + gst);

    const adjustedGoldPrice = (goldPrice as number) * goldTypeMultiplier;
    const goldCost = adjustedGoldPrice * (weight as number);
    const makingCharges = (makingChargeRate / 100) * goldCost;
    const subtotal = goldCost + makingCharges;
    const gst = (gstRate / 100) * subtotal;
    const total = subtotal + gst + otherPrice;

    setBreakdown({ goldCost, makingCharges, gst, otherPrice, total });
  };
  const handleReset = () => {
    setErrors({});
    setOtherPrice(0);
    setGoldPrice("");
    setWeight("");
    setMakingChargeRate(1);
    setGstRate(0);
    setGoldType("24K")
    setBreakdown(null);
    fetchGoldPrice();
    getGoldPrice();
  }
  const fetchGoldPrice = async () => {
    const url = 'https://www.goodreturns.in/gold-rates/delhi.html'; // Replace with the actual URL

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Error fetching the page');
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const goldPriceElement = doc.querySelectorAll('.gold-common-head');
      if (goldPriceElement.length > 0) {
        const element = goldPriceElement?.[3] as HTMLElement | null;
        if (element?.textContent) {
          const goldPrice = element?.textContent.trim();
          const numericString = goldPrice.replace(/[^0-9.]/g, '');
          const number = parseFloat(numericString);
          if (number) {
            localStorage.setItem("currentGoldPrice", String(number))
          }
        }
      } else {
        console.error('Gold price element not found on the page');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const getGoldPrice = useCallback(() => {
    if (typeof window !== "undefined" && localStorage.getItem("currentGoldPrice")) {
      const storedPrice = localStorage.getItem("currentGoldPrice");
      if (storedPrice) {
        const number = parseFloat(storedPrice); // Parse as a float
        if (!isNaN(number)) { // Ensure it's a valid number
          setCurrentGoldPrice(number);
          setGoldPrice(number);
        }
      }
    }
  }, []);
  useEffect(() => { fetchGoldPrice(); getGoldPrice(); }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        {/* Language Selection Dropdown */}
        <div className="flex justify-end mb-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as "en" | "hi")}
            className="text-black p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
          </select>
        </div>

        <h2 className="sm:text-2xl text-xl font-bold text-center mb-6 text-gray-800">
          {t.title}
        </h2>
        <form onSubmit={calculateTotal} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t.goldPriceLabel}
            </label>
            <input
              type="number"
              value={goldPrice}
              onChange={(e) => setGoldPrice(parseFloat(e.target.value) || "")}
              placeholder={t.goldPricePlaceholder}
              className="w-full mt-1 text-black p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-gray-500 text-sm mt-1">
              {t.goldPriceNote.replace("{price}", String(currentGoldPrice || "0"))}
            </p>
            {errors.goldPrice && (
              <p className="text-red-500 text-sm mt-1">{errors.goldPrice}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t.goldTypeLabel}
            </label>
            <select
              value={goldType}
              onChange={(e) => setGoldType(e.target.value)}
              className="w-full text-black mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="24K">24K</option>
              <option value="22K">22K</option>
              <option value="21K">21K</option>
              <option value="20K">20K</option>
              <option value="18K">18K</option>
              <option value="16K">16K</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t.weightLabel}
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(parseFloat(e.target.value) || "")}
              placeholder={t.weightPlaceholder}
              className="w-full text-black mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.weight && (
              <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
            )}
          </div>

          {/* Making Charges Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t.makingChargesLabel}
            </label>
            <select
              value={makingChargeRate}
              onChange={(e) => setMakingChargeRate(parseFloat(e.target.value))}
              className="w-full text-black mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                {t.choose} {t.makingChargesLabel}
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
              {t.gstLabel}
            </label>
            <select
              value={gstRate}
              onChange={(e) => setGstRate(parseFloat(e.target.value))}
              className="w-full text-black mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                {t.choose} {t.gstLabel}
              </option>
              {Array.from({ length: 29 }, (_, i) => i).map((value) => (
                <option key={value} value={value}>
                  {value}%
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t.otherPriceLabel}
            </label>
            <input
              type="number"
              value={otherPrice || ""}
              onChange={(e) => setOtherPrice(parseFloat(e.target.value) || 0)}
              placeholder={t.otherPricePlaceholder}
              className="w-full mt-1 text-black p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            {t.calculateButton}
          </button>

          {breakdown && (
            <>
              <button
                type="reset"
                onClick={handleReset}
                className="w-full bg-gray-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition"
              >
                {t.resetButton}
              </button>
              <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-bold text-gray-700">
                  {t.priceBreakdownTitle}
                </h3>
                <p className="text-sm text-gray-600">
                  <strong>{t.goldCost}:</strong> ₹{breakdown.goldCost.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>{t.makingCharges}:</strong> ₹{breakdown.makingCharges.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>{t.gst}:</strong> ₹{breakdown.gst.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>{t.otherPrice}:</strong> ₹{breakdown.otherPrice.toFixed(2)}
                </p>
                <p className="text-lg font-bold text-green-600">
                  <strong>{t.totalPrice}:</strong> ₹{breakdown.total.toFixed(2)}
                </p>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
