import React from "react";

const Home = (props) => {
  return (
    <React.Fragment>
      <div id="Home" className="grid tablet:grid-cols-1 px-2 py-4">
        <p className="text-gray-600 leading-relaxed">
          Trước khi sử dụng mô hình kiểm tra triệu chứng bệnh, vui lòng đọc kỹ và chấp nhận Điều khoản và Dịch vụ của chúng tôi:
        </p>
        <ul className="list-disc pl-5 space-y-4 my-4 text-gray-600">
          <li>Việc kiểm tra này không phải là một chẩn đoán chính xác.</li>
          <li>
            Việc kiểm tra này nhằm mục đích cung cấp thông tin và không đủ điều kiện ​​y tế.
          </li>
          <li>
            Thông tin bạn cung cấp là ẩn danh và không được chia sẻ với
            bất cứ ai. Chúng tôi cũng không lưu trữ bất kỳ thông tin nào trên máy chủ của chúng tôi.
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
              Tôi đồng ý với các điều khoản và điều kiện trên
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
