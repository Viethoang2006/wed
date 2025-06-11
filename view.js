document.addEventListener('DOMContentLoaded', function() {
    const questionListContainer = document.getElementById('question-list-container');
    const chapterTitleElem = document.getElementById('chapter-title');

    // Lấy mã chương từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const chapterId = urlParams.get('chapter');

    // Mảng tên các chương
    const chapterTitles = {
        2: "Từ trường", 3: "Cảm ứng điện từ", 4: "Từ trường xoáy & Dòng điện dịch",
        5: "Mạch dao động & Cộng hưởng", 6: "Sóng điện từ & Truyền thông",
        7: "Sóng cơ & Giao thoa ánh sáng", 8: "Lượng tử ánh sáng & Vật đen"
    };

    // Hàm để tải và hiển thị câu hỏi
    function loadAndDisplayQuestions() {
        // Kiểm tra xem dữ liệu có tồn tại không
        if (!chapterId || typeof allQuestions === 'undefined' || !allQuestions[chapterId]) {
            chapterTitleElem.textContent = "Lỗi";
            questionListContainer.innerHTML = '<p class="error-message">Không tìm thấy dữ liệu cho chương này. Vui lòng quay lại và thử lại.</p>';
            return;
        }

        // Cập nhật tiêu đề trang
        chapterTitleElem.textContent = `Danh sách câu hỏi - Chương ${chapterId}: ${chapterTitles[chapterId] || ''}`;

        // Lấy danh sách câu hỏi của chương
        const questions = allQuestions[chapterId];
        
        // Xóa vòng xoay tải
        questionListContainer.innerHTML = ''; 

        // Lặp qua từng câu hỏi và tạo HTML
        questions.forEach((item, index) => {
            const questionBlock = document.createElement('div');
            questionBlock.className = 'question-block view-mode';

            // Tạo tiêu đề câu hỏi
            const questionTitle = document.createElement('h3');
            questionTitle.innerHTML = `<strong>Câu ${index + 1}:</strong> ${item.question}`;
            questionBlock.appendChild(questionTitle);

            // Tạo danh sách các lựa chọn
            const optionsList = document.createElement('ul');
            item.options.forEach(option => {
                const listItem = document.createElement('li');
                listItem.innerHTML = option;
                // Nếu lựa chọn này là đáp án đúng, thêm class để tô màu
                if (option === item.answer) {
                    listItem.classList.add('correct-answer-display');
                }
                optionsList.appendChild(listItem);
            });
            questionBlock.appendChild(optionsList);

            // Tạo phần giải thích
            const explanationDiv = document.createElement('div');
            explanationDiv.className = 'explanation';
            explanationDiv.innerHTML = `<p><strong>Giải thích:</strong> ${item.explanation || 'Chưa có giải thích.'}</p>`;
            questionBlock.appendChild(explanationDiv);

            // Thêm khối câu hỏi vào container chính
            questionListContainer.appendChild(questionBlock);
        });

        // Yêu cầu MathJax render lại công thức toán
        if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
            MathJax.typesetPromise([questionListContainer]);
        }
    }

    loadAndDisplayQuestions();
});