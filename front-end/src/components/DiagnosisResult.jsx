import { Button } from "@/components/ui/button";
import { diseases2Translations } from "@/data/Diseases";
import { useNavigate } from "react-router-dom";

export default function DiagnosisResults({
  diseases = [],
  onBack,
  onTryAgain,
}) {
  const navigate = useNavigate();
  // Handle navigation to chat
  const navigateToChat = (message) => {
    navigate("/chat", { state: { initialText: message } });
  };
  return (
    <div className="flex-1 p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <h2 className="text-2xl font-semibold">Kết quả chẩn đoán</h2>

        {diseases.length > 0 ? (
          diseases.map((disease, index) => (
            <div key={index} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-medium">
                    {diseases2Translations[disease.disease]}
                  </h3>
                  <a
                    href={`https://en.wikipedia.org/wiki/${disease.disease}`}
                    title={"wikipedia"}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="ml-4 bg-blue-800 text-white py-1 px-3 rounded-full text-sm">
                    i
                  </a>
                  <button
                    onClick={() =>
                      navigateToChat(
                        `Tôi cần thêm thông tin về bệnh ${
                          diseases2Translations[disease.disease]
                        }`
                      )
                    }
                    className="ml-2 bg-green-600 text-white py-1 px-3 rounded-full text-sm">
                    Tư vấn
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span>Xác suất</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {(disease.probability * 100).toFixed(2)}%
                    </span>
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${disease.probability * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Mô tả bệnh</h4>
                <p>{disease.description}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Biện pháp phòng ngừa</h4>
                <div className="flex flex-wrap gap-2">
                  {disease.precautions.map((precaution, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm">
                      {precaution}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Không có kết quả chẩn đoán.</p>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            TRỞ LẠI
          </Button>
          <Button onClick={onTryAgain}>THỬ LẠI</Button>
        </div>
      </div>
    </div>
  );
}
