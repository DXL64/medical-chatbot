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
          question: "Patient is overweight or obese",
          answer: this.state.question_1,
        },
        {
          question: "Patient smokes cigarettes",
          answer: this.state.question_2,
        },
        {
          question: "Patient has been recently injured",
          answer: this.state.question_3,
        },
        {
          question: "Patient has high cholesterol",
          answer: this.state.question_4,
        },
        { question: "Patient has hypertension", answer: this.state.question_5 },
        { question: "Patient has diabetes", answer: this.state.question_6 },
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
            Please check all the statement below that applies to you
          </h2>
          <p className="mb-8">Select one answer in each row</p>
        </div>

        {/* Question 1 */}
        <div className="radioButtonDiv mb-6">
          <h3 className="mb-2 text-md font-medium">I am overweight</h3>
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
                Yes
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
                No
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
                I don't know
              </label>
            </div>
          </form>
        </div>

        {/* Question 2 */}
        <div className="radioButtonDiv mb-6">
          <h3 className="mb-2 text-md font-medium">I smoke cigarettes</h3>
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
                Yes
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
                No
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
                I don't know
              </label>
            </div>
          </form>
        </div>

        {/* Question 3 */}
        <div className="radioButtonDiv mb-6">
          <h3 className="mb-2 text-md font-medium">
            I have been recently injured
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
                Yes
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
                No
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
                I don't know
              </label>
            </div>
          </form>
        </div>

        {/* Question 4 */}
        <div className="radioButtonDiv mb-6">
          <h3 className="mb-2 text-md font-medium">I have high cholesterol</h3>
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
                Yes
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
                No
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
                I don't know
              </label>
            </div>
          </form>
        </div>

        {/* Question 5 */}
        <div className="radioButtonDiv mb-6">
          <h3 className="mb-2 text-md font-medium">I have hypertension</h3>
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
                Yes
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
                No
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
                I don't know
              </label>
            </div>
          </form>
        </div>

        {/* Question 6 */}
        <div className="radioButtonDiv mb-6">
          <h3 className="mb-2 text-md font-medium">I have diabetes</h3>
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
                Yes
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
                No
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
                I don't know
              </label>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default Patient2;
