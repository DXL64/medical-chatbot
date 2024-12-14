Đầu tiên, tạo file .env trong thư mục source/configs (tham khảo các biến trong .env.example)
1. Sử dụng `conda`
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

2. Sử dụng `uv`

Tiếp theo, cài `uv` (giống như conda)
Lệnh cài `uv`
``` bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

Cài các thư viện đi kèm
```bash
uv sync
```
Tạo file .env và thêm OpenAI key vào file .env
``` bash
cp source/configs/.env.example source/configs/.env
```

Bắt đầu chạy thử chương trình
``` bash
uv run -m source.medical_agent
```

Chạy với UI của Streamlit
``` bash
uv run -m streamlit run demo/app.py
```

Chạy webserver
```
python main.py
```
Vào http://0.0.0.0:8080/docs để xem các đầu API.

Enjoy!!!