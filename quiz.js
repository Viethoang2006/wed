document.addEventListener('DOMContentLoaded', function() {
    // Các phần tử giao diện chính
    const quizContainer = document.getElementById('quiz-container');
    const quizForm = document.getElementById('quiz-form');
    const quizTitle = document.getElementById('quiz-title');

    // Các phần tử của Panel điều khiển
    const answeredCountElem = document.getElementById('answered-count');
    const timerElem = document.getElementById('timer');
    const navPanel = document.getElementById('nav-panel');
    const submitBtnPanel = document.getElementById('submit-btn-panel');

    // Lấy thông tin chương từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const chapterId = urlParams.get('chapter');
    
    let currentQuizData = []; // Dữ liệu câu hỏi sau khi xáo trộn
    let timerInterval; // Biến để lưu trữ tiến trình của đồng hồ
    let secondsElapsed = 0; // Biến đếm giây

    // --- Bắt đầu Đồng hồ đếm giờ ---
    function startTimer() {
        // Dừng bất kỳ đồng hồ nào đang chạy trước đó
        clearInterval(timerInterval);
        // Bắt đầu một đồng hồ mới
        timerInterval = setInterval(() => {
            secondsElapsed++;
            // Format thời gian sang dạng HH:MM:SS
            const hours = Math.floor(secondsElapsed / 3600);
            const minutes = Math.floor((secondsElapsed % 3600) / 60);
            const seconds = secondsElapsed % 60;

            timerElem.textContent = 
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
    }

    // --- Hàm xáo trộn mảng câu hỏi ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // --- Cập nhật trạng thái Panel (số câu, màu sắc nút) ---
    function updateProgress() {
        const totalQuestions = currentQuizData.length;
        let answeredCount = 0;
        
        currentQuizData.forEach((_, index) => {
            const navCircle = document.querySelector(`.nav-circle[data-index="${index}"]`);
            const questionBlock = document.getElementById(`question-${index}`);
            const isAnswered = quizForm.querySelector(`input[name="question${index}"]:checked`);
            
            // Cập nhật trạng thái "đã trả lời"
            if (isAnswered) {
                answeredCount++;
                navCircle.classList.add('answered');
                navCircle.classList.remove('unanswered');
            } else {
                navCircle.classList.remove('answered');
                navCircle.classList.add('unanswered');
            }

            // Cập nhật trạng thái "đánh dấu xem lại"
            if (questionBlock.classList.contains('flagged')) {
                navCircle.classList.add('flagged');
            } else {
                navCircle.classList.remove('flagged');
            }
        });

        answeredCountElem.textContent = `${answeredCount}/${totalQuestions}`;
    }

    // --- Tải câu hỏi và khởi tạo Panel ---
    function loadQuestions() {
        if (typeof allQuestions === 'undefined' || !allQuestions[chapterId]) {
            quizContainer.innerHTML = '<p class="error-message">Lỗi: Không tải được dữ liệu câu hỏi.</p>';
            return;
        }

        const chapterTitles = {
            2: "Từ trường", 3: "Cảm ứng điện từ", 4: "Trường điện từ & Dòng điện dịch",
            5: "Mạch dao động", 6: "Sóng điện từ & Truyền thông", 7: "Sóng cơ & Giao thoa ánh sáng", 8: "Lượng tử ánh sáng & Vật đen"
        };
        quizTitle.textContent = `Bài kiểm tra - Chương ${chapterId}: ${chapterTitles[chapterId] || ''}`;

        let questionsForChapter = [...allQuestions[chapterId]];
        currentQuizData = shuffleArray(questionsForChapter);
        
        quizContainer.innerHTML = '';
        navPanel.innerHTML = ''; 

        currentQuizData.forEach((quizItem, index) => {
            const questionBlock = document.createElement('div');
            questionBlock.className = 'question-block';
            questionBlock.id = `question-${index}`;

            const flagButton = document.createElement('button');
            flagButton.type = 'button';
            flagButton.className = 'flag-button';
            flagButton.innerHTML = `<i class="fa-regular fa-flag"></i> Đánh dấu`;
            flagButton.onclick = () => {
                const isFlagged = questionBlock.classList.toggle('flagged');
                flagButton.innerHTML = isFlagged ? `<i class="fa-solid fa-flag"></i> Bỏ đánh dấu` : `<i class="fa-regular fa-flag"></i> Đánh dấu`;
                updateProgress();
            };

            const questionTitleElem = document.createElement('h3');
            questionTitleElem.innerHTML = `Câu ${index + 1}: ${quizItem.question}`;
            
            const titleContainer = document.createElement('div');
            titleContainer.className = 'question-title-container';
            titleContainer.appendChild(questionTitleElem);
            titleContainer.appendChild(flagButton);
            questionBlock.appendChild(titleContainer);

            const optionsList = document.createElement('ul');
            quizItem.options.forEach((option, optionIndex) => {
                const listItem = document.createElement('li');
                const radioId = `q${index}-option-${optionIndex}`;
                
                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.id = radioId;
                radioInput.name = `question${index}`;
                radioInput.value = option;
                
                const label = document.createElement('label');
                label.htmlFor = radioId;
                label.innerHTML = option;
                
                listItem.appendChild(radioInput);
                listItem.appendChild(label);
                optionsList.appendChild(listItem);
            });
            
            questionBlock.appendChild(optionsList);
            quizContainer.appendChild(questionBlock);

            const navCircle = document.createElement('div');
            navCircle.className = 'nav-circle unanswered';
            navCircle.textContent = index + 1;
            navCircle.dataset.index = index;
            navCircle.onclick = () => {
                document.getElementById(`question-${index}`).scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            };
            navPanel.appendChild(navCircle);
        });
        
        updateProgress();
        startTimer();

        if (window.MathJax) {
            MathJax.typesetPromise();
        }
    }
    
    quizContainer.addEventListener('change', (event) => {
        if (event.target.type === 'radio') {
            updateProgress();
        }
    });

    const submitQuiz = () => {
        const answeredCount = quizForm.querySelectorAll('input[type="radio"]:checked').length;
        const totalQuestions = currentQuizData.length;
        let confirmationMessage = `Bạn có chắc chắn muốn nộp bài không?`;
        if (answeredCount < totalQuestions) {
            confirmationMessage += `\n\nBạn vẫn còn ${totalQuestions - answeredCount} câu chưa trả lời.`;
        }

        if (confirm(confirmationMessage)) {
            clearInterval(timerInterval);
            const userAnswers = {};
            currentQuizData.forEach((_, index) => {
                const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
                userAnswers[index] = selectedOption ? selectedOption.value : null;
            });
            localStorage.setItem('userAnswers', JSON.stringify(userAnswers));
            localStorage.setItem('quizData', JSON.stringify(currentQuizData));
            window.location.href = 'results.html';
        }
    };

    quizForm.addEventListener('submit', (event) => {
        event.preventDefault();
        submitQuiz();
    });
    
    submitBtnPanel.addEventListener('click', submitQuiz);

    loadQuestions();
});
