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
    
    let currentQuizData = []; // Dữ liệu 60 câu hỏi của bài thi
    let timerInterval; 
    let secondsElapsed = 0;

    // --- Bắt đầu Đồng hồ đếm giờ ---
    function startTimer() {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            secondsElapsed++;
            const hours = Math.floor(secondsElapsed / 3600);
            const minutes = Math.floor((secondsElapsed % 3600) / 60);
            const seconds = secondsElapsed % 60;

            timerElem.textContent = 
                `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }, 1000);
    }

    // --- Hàm xáo trộn mảng ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // --- Cập nhật trạng thái Panel ---
    function updateProgress() {
        const totalQuestions = currentQuizData.length;
        const answeredCount = quizForm.querySelectorAll('input[type="radio"]:checked').length;
        
        answeredCountElem.textContent = `${answeredCount}/${totalQuestions}`;

        currentQuizData.forEach((_, index) => {
            const navCircle = document.querySelector(`.nav-circle[data-index="${index}"]`);
            if (!navCircle) return;
            
            const questionBlock = document.getElementById(`question-${index}`);
            const isAnswered = quizForm.querySelector(`input[name="question${index}"]:checked`);

            navCircle.classList.toggle('answered', !!isAnswered);
            navCircle.classList.toggle('unanswered', !isAnswered);
            navCircle.classList.toggle('flagged', questionBlock.classList.contains('flagged'));
        });
    }

    // --- Tải câu hỏi và khởi tạo ---
    function loadFinalExamQuestions() {
        if (typeof allQuestions === 'undefined') {
            quizContainer.innerHTML = '<p class="error-message">Lỗi: Không tải được ngân hàng câu hỏi.</p>';
            return;
        }

        // ======================================================================
        // === LOGIC MỚI: Lấy câu hỏi chia đều từ các chương ===
        // ======================================================================
        const TOTAL_QUESTIONS = 60;
        const chapterKeys = Object.keys(allQuestions);
        const numChapters = chapterKeys.length;
        
        let questionsPerChapter = Math.floor(TOTAL_QUESTIONS / numChapters); // Số câu cơ bản mỗi chương
        let extraQuestions = TOTAL_QUESTIONS % numChapters; // Số câu dư ra
        
        let selectedQuestions = [];

        chapterKeys.forEach((key, index) => {
            let numToSelect = questionsPerChapter;
            // Phân bổ các câu hỏi dư cho các chương đầu tiên
            if (index < extraQuestions) {
                numToSelect++;
            }

            // Lấy câu hỏi từ chương hiện tại
            const chapterQuestions = [...allQuestions[key]];
            
            // Xáo trộn câu hỏi trong chương đó
            const shuffledChapterQuestions = shuffleArray(chapterQuestions);

            // Lấy ra số lượng câu hỏi cần thiết và thêm vào danh sách đã chọn
            selectedQuestions = selectedQuestions.concat(shuffledChapterQuestions.slice(0, numToSelect));
        });

        // Xáo trộn lần cuối toàn bộ 60 câu hỏi đã chọn
        currentQuizData = shuffleArray(selectedQuestions);
        // ======================================================================

        
        answeredCountElem.textContent = `0/${currentQuizData.length}`;

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

    loadFinalExamQuestions();
});
