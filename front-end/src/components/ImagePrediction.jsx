import React, { useState } from "react";
import { ImageIcon, XCircleIcon, CheckCircle2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook

const ImagePrediction = () => {
  // State management
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // Hook to navigate

  // Handle image upload
  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    // Validate file type and size
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Bạn cần upload ảnh hợp lệ");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setError("Kích thước của ảnh phải nhỏ hơn 5MB");
        return;
      }

      // Clear previous errors
      setError(null);

      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage({
          file: file,
          preview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Prediction function (call to FastAPI for image classification)
  const predictPneumonia = async () => {
    if (!selectedImage) {
      setError("Hãy tải ảnh lên trước");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare the image file for upload
      const formData = new FormData();
      formData.append("file", selectedImage.file);

      // Send the image to FastAPI
      const response = await fetch("http://localhost:8080/image-predict/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Dự đoán lỗi");
      }

      const result = await response.json();

      console.log(result)

      // Set prediction result
      setPrediction(result.is_pneunomia === 1); // Assuming 1 means pneumonia detected
    } catch (err) {
      setError("Dự đoán lỗi. Hãy thử lại");
    } finally {
      setLoading(false);
    }
  };

  // Handle button click to navigate to /page with the query based on prediction
  const handleNavigate = () => {
    const question = prediction
      ? "Tôi bị viêm phổi, tôi cần làm gì?"
      : "Tôi cảm thấy không khỏe, tôi nên làm gì?";

    // Redirect to /chat and pass initialText as a prop
    navigate("/chat", { state: { initialText: question } });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-center mb-6">
          Mô hình dự đoán Viêm Phổi
        </h2> 

        {/* Image Upload Section */}
        <div className="flex items-center justify-center w-full mb-6">
          <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
            <div className="flex flex-col items-center justify-center pt-6 pb-8">
              {selectedImage ? (
                <img
                  src={selectedImage.preview}
                  alt="Preview"
                  className="max-h-64 object-contain"
                />
              ) : (
                <>
                  <ImageIcon className="w-14 h-14 text-gray-500" />
                  <p className="mb-2 text-lg text-gray-500">
                    Click to upload chest X-ray image
                  </p>
                </>
              )}
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        </div>

        {/* Error Handling */}
        {error && (
          <div
            className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded relative mb-6"
            role="alert">
            <XCircleIcon className="h-6 w-6 inline mr-2" />
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Prediction Result */}
        {prediction !== null && (
          <div className="mb-6">
            {prediction ? (
              <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded relative">
                <XCircleIcon className="h-6 w-6 inline mr-2" />
                <span className="font-bold">Phát hiện viêm phổi</span>
                <p className="text-sm">
                  Hình ảnh X-ray của bạn có vẻ đang thể hiện bệnh viêm phổi. Hãy liên lạc với bác sĩ để có thêm thông tin chi tiết. Hoặc bạn có thể sử dụng dữ liệu y tế từ chatbot của chúng tôi
                  để có thêm thông tin tham khảo
                </p>
                <button
                  onClick={handleNavigate}
                  className="mt-4 w-full px-6 py-3 text-white bg-blue-500 rounded hover:bg-blue-600">
                  Sử dụng chatbot
                </button>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded relative">
                <CheckCircle2Icon className="h-6 w-6 inline mr-2 text-green-500" />
                <span className="font-bold">No Pneumonia Detected</span>
                <p className="text-sm">
                  Hình ảnh X-Ray bình thường. Hãy thường xuyên cập nhật tình trạng sức khoẻ. Hoặc bạn có thể sử dụng chatbot y tế của chúng tôi để kiểm tra thêm
                  thông tin và chắc chắn với tình trạng sức khoẻ hơn nhé.
                </p>
                <button
                  onClick={handleNavigate}
                  className="mt-4 w-full px-6 py-3 text-white bg-blue-500 rounded hover:bg-blue-600">
                  Sử dụng chatbot
                </button>
              </div>
            )}
          </div>
        )}

        {/* Predict Button */}
        <button
          onClick={predictPneumonia}
          disabled={!selectedImage || loading}
          className="w-full px-6 py-3 text-white bg-blue-500 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg font-medium">
          {loading ? "Đang phân tích..." : "Dự đoán viêm phổi "}
        </button>
      </div>
    </div>
  );
};

export default ImagePrediction;
