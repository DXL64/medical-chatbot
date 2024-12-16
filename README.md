# Chatbot - A medical chatbot using LLM + Document Retriever (RAG) in Vietnamese
Medical Chatbot - A medical chatbot using LLM + Document Retriever (RAG) in Vietnamese

Đầu tiên, tạo file .env trong thư mục source/configs (tham khảo các biến trong .env.example)
1. Khởi tạo Backend

Di chuyển vào thư mục backend
``` bash
cd medical_chatbot-backend
```

Sử dụng `conda`
Tạo mội trường trong conda (thay thế myenv bằng tên bạn muốn)
``` bash
conda create --name myenv python=3.10
```

Kích hoạt môi trường 
``` bash
conda activate myenv
```

Cài đặt các thư viện
``` bash
pip install -r requirements.txt
```

Chạy webserver
```
python main.py
```

Vào http://0.0.0.0:8080/docs để xem các đầu API.

---


2. Khởi tạo Frontend

Di chuyển vào thư mục frontend
``` bash
cd frontend
```

Cài đặt các thư mục frontend
``` bash
npm i
```

Khởi chạy giao diện
``` bash
npm run dev
```

3. Thư mục pneumonia (Thư mục chứa notebook xây dựng mô hình dự đoán viêm phổi sử dụng Resnet và CNN)

Download dữ liệu từ: https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia/data

Lưu 3 folder train-val-test vào thư mục data/chest_xray

Sử dụng notebook để huấn luyện mô hình

Lưu mô hình vào folder models/ để sử dụng

4. Thư mục healthcare (Thư mục chứa notebook để huấn luyện mô hình dự đoán sức khỏe)

Nguồn dữ liệu: https://people.dbmi.columbia.edu/~friedma/Projects/DiseaseSymptomKB/index.html

Sử dụng notebook để tiền xử lý dữ liệu và huấn luyện mô hình



Enjoy!!!
