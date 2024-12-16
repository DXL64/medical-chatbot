import React from "react";

const Patient = ({ age, ageChange, male, female, gender }) => {
  // props > age, gender, male, female

  return (
    <React.Fragment>
      <div id="Home" className="tablet:grid-cols-1 px-4 py-2">
        <form className="space-y-4">
          <label
            className="block text-gray-800 text-lg font-semibold"
            htmlFor="range-slider">
            Độ tuổi của bạn là?
            <h2 className="text-blue-600 transition duration-200 ease-in-out">
              {age}
            </h2>
          </label>
          <input
            id="range-slider"
            className="w-full h-2 bg-gray-300 rounded-lg cursor-pointer focus:outline-none"
            type="range"
            min="0"
            max="100"
            value={age}
            onChange={ageChange}
          />
        </form>
      </div>

      <div id="Home" className="tablet:grid-cols-1 px-4 py-2">
        <p className="text-gray-800">Giới tính của bạn?</p>
        <form className="space-y-4">
          <div className="flex items-center">
            <input
              className="usa-radio__input outline-0"
              id="male"
              type="radio"
              checked={male}
              onChange={gender}
              name="gender"
              value="male"
            />
            <label className="ml-2 text-gray-700" htmlFor="male">
              Nam
            </label>
          </div>
          <div className="flex items-center">
            <input
              className="usa-radio__input outline-0"
              id="female"
              type="radio"
              checked={female}
              onChange={gender}
              name="gender"
              value="female"
            />
            <label className="ml-2 text-gray-700" htmlFor="female">
              Nữ
            </label>
          </div>
        </form>
      </div>
    </React.Fragment>
  );
};

export default Patient;
