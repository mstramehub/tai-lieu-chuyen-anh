# Tài liệu Chuyên Anh | Ms Trâm English Hub

Kho đề, đáp án, file nghe và tài liệu luyện thi chuyên Anh của **Ms Trâm English Hub**.
Học sinh vào web bằng **mã truy cập**. Giáo viên đăng nhập để đăng tài liệu và đổi mã.

Hotline/Zalo: 079 29 51 529 · 0898 123 696 — 12 Lê Đình Chinh, Quy Nhơn Nam · [Facebook](https://www.facebook.com/msTram.EClass/)

---

## Cài đặt (làm một lần, khoảng 10 phút)

Web dùng chung project Supabase với web IELTS Writing (file `config.js` đã điền sẵn địa chỉ và khoá của project đó).
Mọi bảng của web này có tiền tố `ca_`, nên không ảnh hưởng dữ liệu IELTS Writing.

### 1. Tạo bảng và kho file trong Supabase
1. Vào https://supabase.com → mở project đang dùng cho web IELTS Writing.
2. Mở **SQL Editor → New query**. Dán toàn bộ nội dung file `supabase/schema.sql` rồi bấm **Run**.
3. Thêm email giáo viên (thay email của bạn vào, dùng đúng email đăng nhập web IELTS Writing), chạy:
   ```sql
   insert into public.ca_teachers (email) values ('email_cua_ban@gmail.com') on conflict do nothing;
   ```
   Thêm giáo viên khác thì chạy lại câu trên với email người đó (người đó cần có tài khoản trong **Authentication → Users**).

### 2. Bật GitHub Pages
Vào **Settings → Pages** của repo. Ở mục **Source**, chọn **Deploy from a branch**, branch `main`, thư mục `/ (root)`, rồi bấm **Save**.
Sau khoảng 1 phút web chạy ở `https://mstramehub.github.io/<ten-repo>/`.

### 3. Đặt mã lần đầu
Mở web → bấm **Giáo viên đăng nhập** → đăng nhập bằng email và mật khẩu của bạn → web hỏi mã truy cập đầu tiên cho học sinh (4–24 ký tự: chữ không dấu, số, dấu gạch ngang).

---

## Cách dùng

**Giáo viên**
- **+ Đăng tài liệu / + Đăng bài nghe**: điền tiêu đề, chọn phần thi, dạng bài, cấp độ; gắn **Tệp đề**, **Tệp đáp án**, **File nghe** (mỗi file tối đa 50 MB).
  - Đề và đáp án: PDF, Word (.docx), ảnh. PDF và ảnh mở xem ngay; Word thì học sinh tải về.
  - File nghe: MP3, M4A, WAV. Phát ngay trong mục **Listening**.
- Bỏ chọn **Cho học sinh xem đáp án ngay** để giấu đáp án. Khi muốn mở, bấm **Mở đáp án cho HS** ở tài liệu đó.
- **Quản lý mã → Đổi mã**: khi có học sinh nghỉ. Mã cũ hết hiệu lực ngay và đường dẫn tới mọi tệp cũng được đổi, nên link cũ học sinh đã lưu không mở được nữa. Gửi mã mới cho các em còn học.

**Học sinh**
- Mở web, nhập mã cô gửi. Máy sẽ nhớ mã; khi cô đổi mã, các em được đưa về màn hình nhập mã.

## Giới hạn cần biết
- Gói miễn phí của Supabase cho tổng dung lượng file khoảng **1 GB** (dùng chung với web IELTS Writing). Nên xuất MP3 ở 64–96 kbps (khoảng 1 MB/phút).
- Tệp học sinh đã tải về máy thì vẫn còn trên máy các em sau khi đổi mã.

## Các file
| File | Nội dung |
|---|---|
| `index.html` | Giao diện web |
| `app.js` | Xử lý: nhập mã, đăng tài liệu, đổi mã, kho Listening, luyện đề |
| `config.js` | Địa chỉ và khoá công khai của Supabase |
| `logo-mark.png`, `zalo-qr.png` | Logo và mã QR Zalo |
| `supabase/schema.sql` | Bảng dữ liệu, quyền truy cập, kho file |
