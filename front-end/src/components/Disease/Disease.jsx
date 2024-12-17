import React from "react";
import { useNavigate } from "react-router-dom";
import { symptomTranslations } from "../../data/Symptoms";
import { diseasesTranslations } from "../../data/Diseases";

const Disease = ({ patientInfo, disease_with_possibility, gender, age }) => {
  const navigate = useNavigate();

  // Handle navigation to chat
  const navigateToChat = (message) => {
    navigate("/chat", { state: { initialText: message } });
  };

  // Generate the HTML for the current state
  const getCurrentHtml = () => {
    const filteredList = disease_with_possibility.filter(
      (e) => e.possibility > 0
    );

    filteredList.sort(
      (a, b) =>
        -a.possibility.localeCompare(b.possibility, undefined, {
          numeric: true,
        }) || a.name.localeCompare(b.name)
    );

    if (filteredList.length === 0) {
      return (
        <div className="w-full p-4 text-black">
          <div className="w-full tablet:grid tablet:grid-cols-12 patientInfo">
            <h3 className="text-blue-800">Giới tính: {gender}</h3>
            <h3 className="text-blue-800">Độ tuổi: {age}</h3>
          </div>
          <p className="mt-4 text-center text-sm">
            Không thể xác định các bệnh có thể xảy ra do thiếu triệu chứng. Vui
            lòng thử lại phân tích với các triệu chứng thực tế hoặc gọi cho bệnh
            viện địa phương của bạn nếu đó là trường hợp khẩn cấp.
          </p>
        </div>
      );
    }

    return (
      <div className="w-full p-4 text-black">
        <div className="w-full tablet:grid tablet:grid-cols-12 patientInfo">
          <h3 className="text-blue-800">Giới tính: {gender}</h3>
          <h3 className="text-blue-800">Độ tuổi: {age}</h3>
        </div>
        <div className="w-full tablet:grid tablet:grid-cols-12 patientQuestions">
          {patientInfo.map((key, id) => (
            <div className="singleQuestion" key={id}>
              <p>{key.question}</p>
              <p className="text-blue-800">{key.answer}</p>
            </div>
          ))}
        </div>
        <div className="w-full tablet:grid tablet:grid-cols-12 DiagnosisReport">
          <h2 className="font-bold text-2xl">Kết quả chẩn đoán</h2>
          {filteredList.map((key, id) => (
            <div className="reportDiv mb-6" key={id}>
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex items-center titleReport">
                  <h4 className="text-lg">{diseasesTranslations[key.name]}</h4>
                  <a
                    href={`https://en.wikipedia.org/wiki/${key.name}`}
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
                          diseasesTranslations[key.name]
                        }`
                      )
                    }
                    className="ml-2 bg-green-600 text-white py-1 px-3 rounded-full text-sm">
                    Tư vấn
                  </button>
                </div>
                <div className="flex items-center Possibility">
                  <p className="text-sm">
                    Xác suất{" "}
                    <span className="font-semibold text-blue-800">
                      {key.possibility}%
                    </span>
                  </p>
                  <div className="bg-gray-300 w-24 h-1 rounded-full ml-2">
                    <div
                      style={{ width: `${key.possibility}%` }}
                      className="h-full bg-blue-800 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="diseaseSymptoms mt-4">
                <h4 className="font-medium text-lg">Triệu chứng bệnh</h4>
                <ul className="list">
                  {key.disease_symptom.sort().map((item, index) => (
                    <li
                      key={index}
                      className={`inline-block p-2 m-2 ${
                        key.symptom_user_has.includes(item)
                          ? "border border-blue-800 text-blue-800 rounded-lg"
                          : "rounded-lg"
                      }`}>
                      {symptomTranslations[item] || item}{" "}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-sm">
          Hãy đến gặp bác sĩ nếu bạn có bất kỳ triệu chứng nào của bệnh hoặc gọi
          cho bệnh viện để nhận được sự hỗ trợ.
        </div>
      </div>
    );
  };

  return <React.Fragment>{getCurrentHtml()}</React.Fragment>;
};

export default Disease;
