import React, { Component } from "react";

class Disease extends Component {
  // State
  state = {
    patientInfo: this.props.patientInfo,
    disease_with_possibility: this.props.disease_with_possibility,
  };

  get_current_html = () => {
    const filtered_list = this.state.disease_with_possibility.filter((e) => {
      return e.possibility > 0;
    });
    filtered_list.sort((a, b) => -a.possibility.localeCompare(b.possibility, undefined, { numeric: true }) || a.name.localeCompare(b.name));
    return filtered_list.length !== 0 ? (
      <div className="w-full p-4 text-black">
        <div className="w-full tablet:grid tablet:grid-cols-12 patientInfo">
          <h3 className="text-blue-800">Giới tính: {this.props.gender}</h3>
          <h3 className="text-blue-800">Độ tuổi: {this.props.age}</h3>
        </div>
        <div className="w-full tablet:grid tablet:grid-cols-12 patientQuestions">
          {this.state.patientInfo.map((key, id) => (
            <div className="singleQuestion" key={id}>
              <p>{key.question}</p>
              <p className="text-blue-800">{key.answer}</p>
            </div>
          ))}
        </div>
        <div className="w-full tablet:grid tablet:grid-cols-12 DiagnosisReport">
          <h2 className="font-bold text-2xl">Kết quả chẩn đoán</h2>
          {filtered_list.map((key, id) => (
            <div className="reportDiv mb-6" key={id}>
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex items-center titleReport">
                  <h4 className="text-lg">{key.name}</h4>
                  <a
                    href={`https://en.wikipedia.org/wiki/${key.name}`}
                    title={"wikipedia"}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="ml-4 bg-blue-800 text-white py-1 px-3 rounded-full text-sm"
                  >
                    i
                  </a>
                </div>
                <div className="flex items-center Possibility">
                  <p className="text-sm">
                    Xác suất <span className="font-semibold text-blue-800">{key.possibility}%</span>
                  </p>
                  <div className="bg-gray-300 w-24 h-1 rounded-full ml-2">
                    <div style={{ width: `${key.possibility}%` }} className="h-full bg-blue-800 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="diseaseSymptoms mt-4">
                <h4 className="font-medium text-lg"> Triệu chứng bệnh </h4>
                <ul className="list-none">
                  {key.disease_symptom.sort().map((item, index) => {
                    return key.symptom_user_has.includes(item) ? (
                      <li key={index} className="inline-block p-2 m-2 border border-blue-800 text-blue-800 rounded-lg">
                        {item}
                      </li>
                    ) : (
                      <li key={index} className="inline-block p-2 m-2 rounded-lg">
                        {item}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center text-sm">
          Hãy đến gặp bác sĩ nếu bạn có bất kỳ triệu chứng nào của bệnh hoặc gọi cho bệnh viện để nhận được sự hỗ trợ.
        </div>
      </div>
    ) : (
      <div className="w-full p-4 text-black">
        <div className="w-full tablet:grid tablet:grid-cols-12 patientInfo">
          <h3 className="text-blue-800">Giới tính: Nam</h3>
          <h3 className="text-blue-800">Độ tuổi: 40</h3>
        </div>
        <p className="mt-4 text-center text-sm">
          Không thể xác định các bệnh có thể xảy ra do thiếu triệu chứng. Vui lòng thử lại phân tích với các triệu chứng thực tế hoặc gọi cho bệnh viện địa phương của bạn nếu đó là trường hợp khẩn cấp.
        </p>
      </div>
    );
  };

  render() {
    return <React.Fragment>{this.get_current_html()}</React.Fragment>;
  }
}

export default Disease;
