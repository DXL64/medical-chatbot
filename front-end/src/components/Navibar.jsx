import React from "react";
import DHIlab from "./DHIlab/DHIlab";

const Navibar = () => {
  let isArrayFunction = (inputArray) => {
    if (Array.isArray(inputArray) && inputArray.length !== 0) {
      return false;
    } else {
      return true;
    }
  };
  return (
    <div id="Navibar">
      <div class="usa-overlay"></div>
      <header class="usa-header usa-header--basic usa-header--megamenu padding-bottom-4 padding-top-6">
        <div class="usa-nav-container">
          <div class="usa-navbar">
            <div class="usa-logo margin-0" id="basic-mega-logo">
              <em class="usa-logo__text">
                <div className="flex align-middle items-center font-bold gap-4 my-10">
                  <DHIlab />
                  <h3 className="display-inline-block padding-left-1">Kiểm tra triệu chứng bệnh</h3>
                </div>
              </em>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Navibar;
