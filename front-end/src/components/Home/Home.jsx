import React from "react";

const Home = (props) => {
  return (
    <React.Fragment>
      <div id="Home" className="grid tablet:grid-cols-1 px-2 py-4">
        <p className="text-gray-600 leading-relaxed">
          Before using this symptom checker, please read carefully and accept
          our Terms and Services:
        </p>
        <ul className="list-disc pl-5 space-y-4 my-4 text-gray-600">
          <li>This checkup is not a diagnosis.</li>
          <li>
            This checkup is for informational purposes and is not a qualified
            medical opinion.
          </li>
          <li>
            Information that you provide is anonymous and not shared with
            anyone. We also do not store any information on our server.
          </li>
        </ul>
        <form className="text-base">
          <div className="flex items-center">
            <input
              checked={props.isChecked}
              onChange={props.checked}
              className="usa-checkbox__input"
              id="truth"
              type="checkbox"
              name="historical-figures-1"
              value="truth"
            />
            <label className="ml-2 text-gray-800" htmlFor="truth">
              I agree to the DHILab terms and conditions
            </label>
          </div>
        </form>
      </div>

      <div className="tablet:grid-col">
        {/* <img src="/images/TOS.png" /> */}
      </div>
    </React.Fragment>
  );
};

export default Home;
