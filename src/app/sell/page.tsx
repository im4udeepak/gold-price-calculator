"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useCallback } from "react";

export default function SellGold() {
    const router = useRouter();
    const [goldPrice, setGoldPrice] = useState<number | "">("");
    const [weight, setWeight] = useState<number | "">("");
    const [goldType, setGoldType] = useState<string>("24K");
    const [meltingLossRate, setMeltingLossRate] = useState<number>(2); // default 2%
    const [dealerMarginRate, setDealerMarginRate] = useState<number>(1); // default 1%
    const [currentGoldPrice, setCurrentGoldPrice] = useState<number | null>(null);
    const [errors, setErrors] = useState<{ goldPrice?: string; weight?: string }>({});
    const [language, setLanguage] = useState<"en" | "hi">("en");
    const [otherPrice, setOtherPrice] = useState<number>(0);
    const [breakdown, setBreakdown] = useState<{
        goldCost: number;
        deductions: number;
        total: number;
        meltingLoss: number;
        dealerMargin: number;
        otherPrice: number;
    } | null>(null);

    const translations = {
        en: {
            title: "Sell Old Gold",
            buyButton: "Buy Gold",
            sellButton: "Sell Gold",
            goldPriceLabel: "Gold Price per Gram (₹)",
            goldPriceNote: `The current gold price is set to ₹{price} per gram by default. You can update it to your preferred price if needed.`,
            goldTypeLabel: "Gold Type (Karat)",
            weightLabel: "Weight (grams)",
            meltingLossLabel: "Melting/Refining Loss (%)",
            dealerMarginLabel: "Dealer Margin (%)",
            calculateButton: "Calculate Payout",
            otherPriceLabel: "Other Price (₹) (Optional)",
            otherPricePlaceholder: "Other Price (₹) (Optional)",
            otherPrice: "Other Price",
            resetButton: "Reset",
            errors: {
                goldPriceRequired: "Gold Price is required",
                goldPricePositive: "Gold Price must be greater than 0",
                weightRequired: "Weight is required",
                weightPositive: "Weight must be greater than 0",
            },
            breakdownTitle: "Payout Breakdown",
            goldCost: "Gross Gold Value",
            meltingLoss: "Melting Loss",
            dealerMargin: "Dealer Margin",
            deductions: "Total Deductions",
            total: "Final Amount",
        },
        hi: {
            title: "पुराना सोना बेचें",
            buyButton: "सोना खरीदें",
            sellButton: "सोना बेचें",
            goldPriceLabel: "प्रति ग्राम सोने की कीमत (₹)",
            goldPriceNote: `वर्तमान में प्रति ग्राम सोने की कीमत ₹{price} है। आप इसे अपनी पसंदीदा कीमत पर अपडेट कर सकते हैं।`,
            goldTypeLabel: "सोने का प्रकार (कैरेट)",
            weightLabel: "वजन (ग्राम)",
            meltingLossLabel: "मेल्टिंग/शुद्धिकरण हानि (%)",
            dealerMarginLabel: "डीलर मार्जिन (%)",
            calculateButton: "भुगतान गणना करें",
            otherPriceLabel: "अन्य कीमत (₹) (वैकल्पिक)",
            otherPricePlaceholder: "अन्य कीमत (₹) (वैकल्पिक)",
            otherPrice: "अन्य कीमत",
            resetButton: "रीसेट करें",
            errors: {
                goldPriceRequired: "सोने की कीमत आवश्यक है",
                goldPricePositive: "सोने की कीमत 0 से अधिक होनी चाहिए",
                weightRequired: "वजन आवश्यक है",
                weightPositive: "वजन 0 से अधिक होना चाहिए",
            },
            breakdownTitle: "भुगतान विवरण",
            goldCost: "कुल सोने का मूल्य",
            meltingLoss: "मेल्टिंग हानि",
            dealerMargin: "डीलर मार्जिन",
            deductions: "कुल कटौती",
            total: "अंतिम राशि",
        },
    };

    const t = translations[language];

    const validateForm = () => {
        const newErrors: { goldPrice?: string; weight?: string } = {};
        if (!goldPrice) newErrors.goldPrice = "Gold Price is required";
        if (goldPrice && goldPrice <= 0) newErrors.goldPrice = "Gold Price must be greater than 0";
        if (!weight) newErrors.weight = "Weight is required";
        if (weight && weight <= 0) newErrors.weight = "Weight must be greater than 0";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const calculateSellPrice = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const goldTypeMultiplier =
            goldType === "24K" ? 1 :
                goldType === "22K" ? 0.916 :
                    goldType === "21K" ? 0.875 :
                        goldType === "20K" ? 0.833 :
                            goldType === "18K" ? 0.75 :
                                goldType === "16K" ? 0.666 : 1;

        const adjustedGoldPrice = (goldPrice as number) * goldTypeMultiplier;
        const goldCost = adjustedGoldPrice * (weight as number);

        const meltingLoss = (meltingLossRate / 100) * goldCost;
        const dealerMargin = (dealerMarginRate / 100) * goldCost;

        const deductions = meltingLoss + dealerMargin + otherPrice;
        const total = goldCost - deductions - otherPrice;

        setBreakdown({ goldCost, meltingLoss, dealerMargin, deductions, total, otherPrice });
    };

    const fetchGoldPrice = async () => {
        const url = 'https://www.goodreturns.in/gold-rates/delhi.html';
        try {
            const response = await fetch(url);
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const element = doc.querySelectorAll('.gold-common-head')[3] as HTMLElement | null;
            if (element?.textContent) {
                const goldPrice = element.textContent.trim().replace(/[^0-9.]/g, '');
                const number = parseFloat(goldPrice);
                if (number) {
                    localStorage.setItem("currentGoldPrice", String(number));
                }
            }
        } catch (error) {
            console.error("Failed to fetch gold price", error);
        }
    };

    const handleReset = () => {
        setErrors({});
        setOtherPrice(0);
        setGoldPrice("");
        setWeight("");
        setMeltingLossRate(2);
        setDealerMarginRate(1);
        setGoldType("24K")
        setBreakdown(null);
        fetchGoldPrice();
        getGoldPrice();
    }

    const getGoldPrice = useCallback(() => {
        if (typeof window !== "undefined") {
            const storedPrice = localStorage.getItem("currentGoldPrice");
            if (storedPrice) {
                const number = parseFloat(storedPrice);
                if (!isNaN(number)) {
                    setCurrentGoldPrice(number);
                    setGoldPrice(number);
                }
            }
        }
    }, []);

    useEffect(() => {
        fetchGoldPrice();
        getGoldPrice();
    }, []);
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedLanguage = localStorage.getItem("language");
            if (storedLanguage) {
                setLanguage(storedLanguage as "en" | "hi")
            }
        }
    }, [])
    return (
        <div className="min-h-screen flex items-center justify-center bg-black-100 md:p-4 py-4">
            <div>
                <div className="flex justify-center gap-4 mb-6">
                    <button
                        onClick={() => router.push("/")}
                        className={`px-4 py-2 rounded-lg font-bold bg-gray-200 text-black`}
                    >
                        {t.buyButton}
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg font-bold bg-gold text-white`}
                    >
                        {t.sellButton}
                    </button>
                </div>
                <div className="w-full md:max-w-md bg-black shadow-[0px_0px_20px] shadow-gold md:rounded-lg p-6">
                    {/* Language Switch */}
                    <div className="flex justify-end mb-4">
                        <select
                            value={language}
                            onChange={(e) => {
                                setLanguage(e.target.value as "en" | "hi");
                                localStorage.setItem("language", String(e.target.value as "en" | "hi"))
                            }}
                            className="text-black p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="en">English</option>
                            <option value="hi">हिंदी</option>
                        </select>
                    </div>

                    <h2 className="sm:text-2xl text-xl font-bold text-center mb-6 text-gold">
                        {t.title}
                    </h2>
                    <form onSubmit={calculateSellPrice} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-white">{t.goldPriceLabel}</label>
                            <input
                                type="number"
                                value={goldPrice}
                                onChange={(e) => setGoldPrice(parseFloat(e.target.value) || "")}
                                placeholder={t.goldPriceLabel}
                                className="w-full mt-1 text-black p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-gold text-sm mt-1">{t.goldPriceNote.replace("{price}", String(currentGoldPrice ?? "0"))}</p>
                            {errors.goldPrice && <p className="text-red-500 text-sm">{errors.goldPrice}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white">{t.goldTypeLabel}</label>
                            <select
                                value={goldType}
                                onChange={(e) => setGoldType(e.target.value)}
                                className="w-full text-black mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {["24K", "22K", "21K", "20K", "18K", "16K"].map((type) => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white">{t.weightLabel}</label>
                            <input
                                type="number"
                                value={weight}
                                onChange={(e) => setWeight(parseFloat(e.target.value) || "")}
                                placeholder={t.weightLabel}
                                className="w-full text-black mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white">{t.meltingLossLabel}</label>
                            <select
                                value={meltingLossRate}
                                onChange={(e) => setMeltingLossRate(parseInt(e.target.value))}
                                className="w-full text-black mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {[...Array(11).keys()].map(i => (
                                    <option key={i} value={i}>{i}%</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white">{t.dealerMarginLabel}</label>
                            <select
                                value={dealerMarginRate}
                                onChange={(e) => setDealerMarginRate(parseInt(e.target.value))}
                                className="w-full text-black mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {[...Array(6).keys()].map(i => (
                                    <option key={i} value={i}>{i}%</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-white">
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
                            className="w-full bg-gold hover:bg-gold text-white font-semibold py-2 rounded-lg transition duration-200"
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
                                <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
                                    <h3 className="text-xl font-semibold mb-4 text-gray-700">{t.breakdownTitle}</h3>
                                    <p className="text-sm text-gray-600">
                                        <strong>{t.goldCost}:</strong> ₹{breakdown.goldCost.toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>{t.meltingLoss}:</strong> ₹{breakdown.meltingLoss.toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>{t.dealerMargin}:</strong> ₹{breakdown.dealerMargin.toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>{t.otherPrice}:</strong> ₹{breakdown.otherPrice.toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        <strong>{t.deductions}:</strong> ₹{breakdown.deductions.toFixed(2)}
                                    </p>

                                    <p className="text-lg font-bold text-gold">
                                        <strong>{t.total}:</strong> ₹{breakdown.total.toFixed(2)}
                                    </p>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};