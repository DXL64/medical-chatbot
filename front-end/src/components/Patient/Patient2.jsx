import React, { Component } from "react";

class Patient2 extends Component {
  state = {
    question_1: "",
    question_2: "",
    question_3: "",
    question_4: "",
    question_5: "",
    question_6: "",
    next_button_available: "",
    all_answer: [],
  };

  handleOnChange = (e) => {
    let state = this.state;
    let nextButton = () => {
      return state.question_1 !== "" &&
        state.question_2 !== "" &&
        state.question_3 !== "" &&
        state.question_4 !== "" &&
        state.question_5 !== "" &&
        state.question_6 !== ""
        ? "Available"
        : "Not available";
    };

    console.log(e);

    let setObject = () => {
      return [
        {
          question: "Bạn có thừa cân hoặc béo phì?",
          answer: this.state.question_1,
        },
        {
          question: "Bạn có hút thuốc?",
          answer: this.state.question_2,
        },
        {
          question: "Bạn có vừa bị thương",
          answer: this.state.question_3,
        },
        {
          question: "Bạn có cholesterol cao?",
          answer: this.state.question_4,
        },
        { question: "Bạn có bị huyết áp cao?", answer: this.state.question_5 },
        { question: "Bạn cóm mắc bệnh tiêu đường?", answer: this.state.question_6 },
      ];
    };

    switch (e.target.className) {
      case "usa-radio__input I_am_overweight_or_obese":
        this.setState({ question_1: e.target.value }, () => {
          this.props.callback(setObject());
        });
        return this.setState({ all_answer: setObject() });
      case "usa-radio__input I smoke cigarettes":
        this.setState({ question_2: e.target.value }, () => {
          this.props.callback(setObject(), nextButton());
        });
        return this.setState({ all_answer: setObject() });
      case "usa-radio__input I have been recently injured":
        this.setState({ question_3: e.target.value }, () => {
          this.props.callback(setObject(), nextButton());
        });
        return this.setState({ all_answer: setObject() });
      case "usa-radio__input I have high cholesterol":
        this.setState({ question_4: e.target.value }, () => {
          this.props.callback(setObject(), nextButton());
        });
        return this.setState({ all_answer: setObject() });
      case "usa-radio__input I have hypertension":
        this.setState({ question_5: e.target.value }, () => {
          this.props.callback(setObject(), nextButton());
        });
        return this.setState({ all_answer: setObject() });
      case "usa-radio__input I have diabetes":
        this.setState({ question_6: e.target.value }, () => {
          this.props.callback(setObject(), nextButton());
        });
        return this.setState({ all_answer: setObject() });
      default:
        return;
    }
  };

  render() {
    return (
      <div id="Patient2" className="tablet:grid-cols-1 px-4">
        <div className="w-full flex flex-col items-center">
          <h2 className="mb-4 text-lg font-semibold">
            Vui lòng kiểm tra tất cả các trạng thái bạn đã điền dưới đây
          </h2>
          <p className="mb-8">Chọn một câu trả lời ở mỗi hàng</p>
        </div>

        {/* Question 1 */}
        <div className="radioButtonDiv mb-6">
          <h3 className="mb-2 text-md font-medium">Thừa cân</h3>
          <form className="usa-form flex items-center space-x-6">
            <div className="usa-radio">
              <input
                className="usa-radio__input I_am_overweight_or_obese"
                onChange={this.handleOnChange}
                id="overweight_Yes"
                type="radio"
                checked={this.state.question_1 === "Yes"}
                value={"Yes"}
                name="overweight"
              />
              <label className="usa-radio__label ml-2" htmlFor="overweight_Yes">
                Có
              </label>
            </div>
            <div className="usa-radio">
              <input
                className="usa-radio__input I_am_overweight_or_obese"
                onChange={this.handleOnChange}
                id="overweight_No"
                type="radio"
                checked={this.state.question_1 === "No"}
                value={"No"}
                name="overweight"
              />
              <label className="usa-radio__label ml-2" htmlFor="overweight_No">
              Không
              </label>
            </div>
            <div className="usa-radio">
              <input
                className="usa-radio__input I_am_overweight_or_obese"
                onChange={this.handleOnChange}
                id="overweight_doesno"
                type="radio"
                checked={this.state.question_1 === "Patient doesn't know"}
                value={"Patient doesn't know"}
                name="overweight"
              />
              <label
                className="usa-radio__label ml-2"
                htmlFor="overweight_doesno">
                Tôi không biết
              </label>
            </div>
          </form>
        </div>

        {/* Question 2 */}
        <div className="radioButtonDiv mb-6">
          <h3 className="mb-2 text-md font-medium">Hút thuốc lá</h3>
          <form className="usa-form flex items-center space-x-6">
            <div className="usa-radio">
              <input
                className="usa-radio__input I smoke cigarettes"
                onChange={this.handleOnChange}
                id="cigarettes_yes"
                type="radio"
                checked={this.state.question_2 === "Yes"}
                value={"Yes"}
                name="cigarettes"
              />
              <label className="usa-radio__label ml-2" htmlFor="cigarettes_yes">
              Có
              </label>
            </div>
            <div className="usa-radio">
              <input
                className="usa-radio__input I smoke cigarettes"
                onChange={this.handleOnChange}
                id="cigarettes_no"
                type="radio"
                checked={this.state.question_2 === "No"}
                value={"No"}
                name="cigarettes"
              />
              <label className="usa-radio__label ml-2" htmlFor="cigarettes_no">
              Không
              </label>
            </div>
            <div className="usa-radio">
              <input
                className="usa-radio__input I smoke cigarettes"
                onChange={this.handleOnChange}
                id="cigarettes_doesno"
                type="radio"
                checked={this.state.question_2 === "Patient doesn't know"}
                value={"Patient doesn't know"}
                name="cigarettes"
              />
              <label
                className="usa-radio__label ml-2"
                htmlFor="cigarettes_doesno">
                Tôi không biết
              </label>
            </div>
          </form>
        </div>

        {/* Question 3 */}
        <div className="radioButtonDiv mb-6">
          <h3 className="mb-2 text-md font-medium">
            Gần đây bị thương
          </h3>
          <form className="usa-form flex items-center space-x-6">
            <div className="usa-radio">
              <input
                className="usa-radio__input I have been recently injured"
                onChange={this.handleOnChange}
                id="injury_yes"
                type="radio"
                checked={this.state.question_3 === "Yes"}
                value={"Yes"}
                name="injury"
              />
              <label className="usa-radio__label ml-2" htmlFor="injury_yes">
              Có
              </label>
            </div>
            <div className="usa-radio">
              <input
                className="usa-radio__input I have been recently injured"
                onChange={this.handleOnChange}
                id="injury_no"
                type="radio"
                checked={this.state.question_3 === "No"}
                value={"No"}
                name="injury"
              />
              <label className="usa-radio__label ml-2" htmlFor="injury_no">
              Không
              </label>
            </div>
            <div className="usa-radio">
              <input
                className="usa-radio__input I have been recently injured"
                onChange={this.handleOnChange}
                id="injury_doesno"
                type="radio"
                checked={this.state.question_3 === "Patient doesn't know"}
                value={"Patient doesn't know"}
                name="injury"
              />
              <label className="usa-radio__label ml-2" htmlFor="injury_doesno">
               Tôi không biết
              </label>
            </div>
          </form>
        </div>

        {/* Question 4 */}
        <div className="radioButtonDiv mb-6">
          <h3 className="mb-2 text-md font-medium">Nồng độ cholesterol cao</h3>
          <form className="usa-form flex items-center space-x-6">
            <div className="usa-radio">
              <input
                className="usa-radio__input I have high cholesterol"
                onChange={this.handleOnChange}
                id="cholesterol_yes"
                type="radio"
                checked={this.state.question_4 === "Yes"}
                value={"Yes"}
                name="cholesterol"
              />
              <label
                className="usa-radio__label ml-2"
                htmlFor="cholesterol_yes">
                Có
              </label>
            </div>
            <div className="usa-radio">
              <input
                className="usa-radio__input I have high cholesterol"
                onChange={this.handleOnChange}
                id="cholesterol_no"
                type="radio"
                checked={this.state.question_4 === "No"}
                value={"No"}
                name="cholesterol"
              />
              <label className="usa-radio__label ml-2" htmlFor="cholesterol_no">
              Không
              </label>
            </div>
            <div className="usa-radio">
              <input
                className="usa-radio__input I have high cholesterol"
                onChange={this.handleOnChange}
                id="cholesterol_doesno"
                type="radio"
                checked={this.state.question_4 === "Patient doesn't know"}
                value={"Patient doesn't know"}
                name="cholesterol"
              />
              <label
                className="usa-radio__label ml-2"
                htmlFor="cholesterol_doesno">
                Tôi không biết
              </label>
            </div>
          </form>
        </div>

        {/* Question 5 */}
        <div className="radioButtonDiv mb-6">
          <h3 className="mb-2 text-md font-medium">Bị tăng huyết áp</h3>
          <form className="usa-form flex items-center space-x-6">
            <div className="usa-radio">
              <input
                className="usa-radio__input I have hypertension"
                onChange={this.handleOnChange}
                id="hypertension_yes"
                type="radio"
                checked={this.state.question_5 === "Yes"}
                value={"Yes"}
                name="hypertension"
              />
              <label
                className="usa-radio__label ml-2"
                htmlFor="hypertension_yes">
                Có
              </label>
            </div>
            <div className="usa-radio">
              <input
                className="usa-radio__input I have hypertension"
                onChange={this.handleOnChange}
                id="hypertension_no"
                type="radio"
                checked={this.state.question_5 === "No"}
                value={"No"}
                name="hypertension"
              />
              <label
                className="usa-radio__label ml-2"
                htmlFor="hypertension_no">
                Không
              </label>
            </div>
            <div className="usa-radio">
              <input
                className="usa-radio__input I have hypertension"
                onChange={this.handleOnChange}
                id="hypertension_doesno"
                type="radio"
                checked={this.state.question_5 === "Patient doesn't know"}
                value={"Patient doesn't know"}
                name="hypertension"
              />
              <label
                className="usa-radio__label ml-2"
                htmlFor="hypertension_doesno">
                Tôi không biết
              </label>
            </div>
          </form>
        </div>

        {/* Question 6 */}
        <div className="radioButtonDiv mb-6">
          <h3 className="mb-2 text-md font-medium">Bị tiểu đường</h3>
          <form className="usa-form flex items-center space-x-6">
            <div className="usa-radio">
              <input
                className="usa-radio__input I have diabetes"
                onChange={this.handleOnChange}
                id="diabetes_yes"
                type="radio"
                checked={this.state.question_6 === "Yes"}
                value={"Yes"}
                name="diabetes"
              />
              <label className="usa-radio__label ml-2" htmlFor="diabetes_yes">
              Có
              </label>
            </div>
            <div className="usa-radio">
              <input
                className="usa-radio__input I have diabetes"
                onChange={this.handleOnChange}
                id="diabetes_no"
                type="radio"
                checked={this.state.question_6 === "No"}
                value={"No"}
                name="diabetes"
              />
              <label className="usa-radio__label ml-2" htmlFor="diabetes_no">
              Không
              </label>
            </div>
            <div className="usa-radio">
              <input
                className="usa-radio__input I have diabetes"
                onChange={this.handleOnChange}
                id="diabetes_doesno"
                type="radio"
                checked={this.state.question_6 === "Patient doesn't know"}
                value={"Patient doesn't know"}
                name="diabetes"
              />
              <label
                className="usa-radio__label ml-2"
                htmlFor="diabetes_doesno">
                Tôi không biết
              </label>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Patient2;
