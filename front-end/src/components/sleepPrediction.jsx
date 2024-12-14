"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function SleepPrediction() {
  const [sleepLevel, setSleepLevel] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // State to store the form values
  const [formData, setFormData] = useState({
    gender: "Male",
    age: 30,
    job: "Software Engineer",
    sleepDuration: 7.0,
    sleepQuality: 7,
    physicalActivity: 50,
    weight: "Normal",
    heartRate: 70,
    stressLevelCondition: 0,
    dailySteps: 10000,
    bloodPressure: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSliderChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value[0],
    }));
  };

  const handlePrediction = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8080/sleep-predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch prediction");
      }

      const data = await response.json();
      setSleepLevel(data.prediction);
    } catch (err) {
      setError("Failed to fetch prediction. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <h1 className="text-3xl font-bold text-primary mb-4">
        Prediction Model Accuracy Metrics
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        A machine learning study was conducted, and as a result, the Linear
        Regression model was chosen as the main model. The accuracy of the model
        was evaluated using MAPE (Mean Absolute Percentage Error), RMSE (Root
        Mean Square Error), and R2 (R Squared) values. Based on the test
        results, the accuracy of the model was calculated as follows.
      </p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {["MAPE", "RMSE", "R2"].map((metric, index) => (
          <Card key={metric} className="bg-card">
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold text-center text-primary">
                {metric}
              </h2>
              <p className="text-2xl font-bold text-center text-card-foreground">
                {index === 0 ? "4.0%" : index === 1 ? "0.37" : "97.0%"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <form onSubmit={handlePrediction} className="grid grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-muted-foreground">
              Giới tính
            </label>
            <Select
              name="gender"
              onValueChange={(value) =>
                setFormData({ ...formData, gender: value })
              }>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Nam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Nam</SelectItem>
                <SelectItem value="Female">Nữ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-2 text-muted-foreground">Độ tuổi</label>
            <Slider
              value={[formData.age]}
              onValueChange={(value) => handleSliderChange("age", value)}
              max={65}
              min={18}
              setp={1}
            />
            <span className="ml-2"> Giá trị hiện tại {formData.age}</span>
          </div>

          <div>
            <label className="block mb-2 text-muted-foreground">
              Nghề nghiệp
            </label>
            <Select
              name="job"
              onValueChange={(value) =>
                setFormData({ ...formData, job: value })
              }>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Software Engineer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Software Engineer">
                  Software Engineer
                </SelectItem>
                <SelectItem value="Doctor">Doctor</SelectItem>
                <SelectItem value="Sales Representative">
                  Sales Representative
                </SelectItem>
                <SelectItem value="Teacher">Teacher</SelectItem>
                <SelectItem value="Nurse">Nurse</SelectItem>
                <SelectItem value="Engineer">Engineer</SelectItem>
                <SelectItem value="Accountant">Accountant</SelectItem>
                <SelectItem value="Scientist">Scientist</SelectItem>
                <SelectItem value="Lawyer">Lawyer</SelectItem>
                <SelectItem value="Salesperson">Salesperson</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block mb-2 text-muted-foreground">
              Thời gian ngủ (Giờ)
            </label>
            <Slider
              value={[formData.sleepDuration]}
              onValueChange={(value) =>
                handleSliderChange("sleepDuration", value)
              }
              max={8.5}
              min={5.8}
              step={0.1}
            />
            <span className="ml-2">
              {" "}
              Giá trị hiện tại {formData.sleepDuration}
            </span>
          </div>

          <div>
            <label className="block mb-2 text-muted-foreground">
              Chất lượng giấc ngủ (1-10)
            </label>
            <Slider
              value={[formData.sleepQuality]}
              onValueChange={(value) =>
                handleSliderChange("sleepQuality", value)
              }
              max={10}
              step={1}
            />
            <span className="ml-2">
              {" "}
              Giá trị hiện tại {formData.sleepQuality}
            </span>
          </div>

          <div>
            <label className="block mb-2 text-muted-foreground">
              Mức độ hoạt động thể chất (%)
            </label>
            <Slider
              value={[formData.physicalActivity]}
              onValueChange={(value) =>
                handleSliderChange("physicalActivity", value)
              }
              max={100}
              step={1}
            />
            <span className="ml-2">
              {" "}
              Giá trị hiện tại {formData.physicalActivity}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between h-full">
          <div className="space-y-6">
            <div>
              <label className="block mb-2 text-muted-foreground">
                Cân nặng
              </label>
              <Select
                name="weight"
                onValueChange={(value) =>
                  setFormData({ ...formData, weight: value })
                }>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Bình thường" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Normal">Bình thường</SelectItem>
                  <SelectItem value="Overweight">Thừa cân</SelectItem>
                  <SelectItem value="Obese">Béo phì</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block mb-2 text-muted-foreground">
                Nhịp tim
              </label>
              <Slider
                value={[formData.heartRate]}
                onValueChange={(value) =>
                  handleSliderChange("heartRate", value)
                }
                max={86}
                min={65}
                step={0.1}
              />
              <span className="ml-2">
                {" "}
                Giá trị hiện tại {formData.heartRate}
              </span>
            </div>

            <div>
              <label className="block mb-2 text-muted-foreground">
                Mức độ căng thẳng
              </label>
              <Slider
                value={[formData.stressLevelCondition]}
                onValueChange={(value) =>
                  handleSliderChange("stressLevelCondition", value)
                }
                max={10}
                step={0.1}
              />
              <span className="ml-2">
                {" "}
                Giá trị hiện tại {formData.stressLevelCondition}
              </span>
            </div>

            <div>
              <label className="block mb-2 text-muted-foreground">
                Số bước đi hằng ngày
              </label>
              <Slider
                value={[formData.dailySteps]}
                onValueChange={(value) =>
                  handleSliderChange("dailySteps", value)
                }
                max={10000}
                step={10}
              />
              <span className="ml-2">
                {" "}
                Giá trị hiện tại {formData.dailySteps}
              </span>
            </div>
            <div>
              <label className="block mb-2 text-muted-foreground">
                Huyết áp
              </label>
              <Select
                name="bloodPressure"
                onValueChange={(value) =>
                  setFormData({ ...formData, bloodPressure: value })
                }>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Bình thường" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Bình thường</SelectItem>
                  <SelectItem value="1">Không bình thường</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button type="submit" className="mt-4" disabled={isLoading}>
          {isLoading ? "Đang dự đoán..." : "Dự đoán"}
        </Button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}
      {sleepLevel && <p className="mt-4">Tình trạng giấc ngủ: {sleepLevel}</p>}
    </div>
  );
}
