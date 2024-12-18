"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import DiagnosisResults from "./DiagnosisResult";
import { Symptoms2 } from "@/data/Symptoms";

const symptoms = Symptoms2;

export default function SymptomChecker() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [filteredSymptoms, setFilteredSymptoms] = useState(symptoms);
  const [searchTerm, setSearchTerm] = useState("");
  const [diseases, setDiseases] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectSymptom = (symptom) => {
    if (!selectedSymptoms.find((s) => s.id === symptom.id)) {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const removeSymptom = (symptomId) => {
    setSelectedSymptoms(selectedSymptoms.filter((s) => s.id !== symptomId));
  };

  // Handle search input and filter symptoms list
  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = symptoms.filter(
      (symptom) =>
        symptom.name
          .toLowerCase() // Normalize case to lowercase for comparison
          .includes(value.trim().toLowerCase()) // Handle trim and case-insensitivity
    );
    setFilteredSymptoms(filtered);
  };

  const handleSubmit = async () => {
    if (selectedSymptoms.length === 0) return;
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          symptom_list: selectedSymptoms.map((s) => s.code),
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      if (data && Array.isArray(data)) {
        setDiseases(data);
        setShowResults(true);
      } else {
        console.error("Invalid response format");
        alert("Dữ liệu phản hồi không hợp lệ.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Đã xảy ra lỗi khi dự đoán. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setShowResults(false);
  };

  const handleTryAgain = () => {
    setSelectedSymptoms([]);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <DiagnosisResults
        diseases={diseases}
        onBack={handleBack}
        onTryAgain={handleTryAgain}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Sidebar */}
      <div className="w-64 border-r p-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-full" />
          <h1 className="text-blue-900 font-medium">
            Dự đoán tình trạng sức khoẻ
          </h1>
        </div>
        <nav className="space-y-2">
          <div className="text-blue-600 font-medium">Triệu chứng</div>
          <div className="text-gray-600">Dự đoán bệnh</div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Selected Symptoms */}
          <div className="flex flex-wrap gap-2">
            {selectedSymptoms.map((symptom) => (
              <div
                key={symptom.id}
                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm">
                {symptom.name}
                <button
                  onClick={() => removeSymptom(symptom.id)}
                  className="hover:bg-blue-700 rounded-full p-0.5">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Symptom Search */}
          <div className="border rounded-lg">
            <input
              type="text"
              className="h-12 w-full p-4 text-sm"
              placeholder="Tìm kiếm triệu chứng"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
            <ScrollArea className="h-[300px]">
              {filteredSymptoms.length > 0 ? (
                filteredSymptoms.map((symptom) => (
                  <div
                    key={symptom.id}
                    onClick={() => handleSelectSymptom(symptom)}
                    className="cursor-pointer hover:bg-blue-50 p-3">
                    {symptom.name}
                  </div>
                ))
              ) : (
                <div className="p-4 text-gray-500">
                  Không tìm thấy triệu chứng nào.
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={handleTryAgain}>
              TRỞ LẠI
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading || selectedSymptoms.length === 0}>
              {isLoading ? "ĐANG XỬ LÝ..." : "HOÀN THÀNH"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
