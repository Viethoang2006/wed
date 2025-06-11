document.addEventListener('DOMContentLoaded', () => {
    const userAnswers = JSON.parse(localStorage.getItem('userAnswers'));
    const quizData = JSON.parse(localStorage.getItem('quizData'));
    const scoreContainer = document.getElementById('score-container');
    const resultsContainer = document.getElementById('results-container');

    if (!userAnswers || !quizData) {
        scoreContainer.innerHTML = 'Không tìm thấy dữ liệu bài làm. Vui lòng thử lại.';
        return;
    }

    let score = 0;
    resultsContainer.innerHTML = '';

    quizData.forEach((quizItem, index) => {
        const userAnswer = userAnswers[index];
        const correctAnswer = quizItem.answer;
        const isCorrect = userAnswer === correctAnswer;
        if (isCorrect) {
            score++;
        }

        const resultBlock = document.createElement('div');
        resultBlock.className = `question-block result-block ${isCorrect ? 'correct' : 'incorrect'}`;

        const questionTitle = document.createElement('h3');
        questionTitle.innerHTML = `Câu ${index + 1}: ${quizItem.question}`;
        resultBlock.appendChild(questionTitle);

        const optionsList = document.createElement('ul');
        quizItem.options.forEach(option => {
            const listItem = document.createElement('li');
            let liClass = '';
            if (option === correctAnswer) {
                liClass = 'correct-answer';
            } else if (option === userAnswer) {
                liClass = 'user-incorrect';
            }
            listItem.className = liClass;
            listItem.innerHTML = option;
            optionsList.appendChild(listItem);
        });
        resultBlock.appendChild(optionsList);

        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'explanation';
        explanationDiv.innerHTML = `
            <p><strong>Bạn đã chọn:</strong> ${userAnswer || 'Không trả lời'}</p>
            ${!isCorrect ? `<p><strong>Đáp án đúng:</strong> ${correctAnswer}</p>` : ''}
            <p class="explanation-text"><strong>Giải thích:</strong> ${quizItem.explanation || 'Chưa có giải thích.'}</p>
        `;
        resultBlock.appendChild(explanationDiv);

        resultsContainer.appendChild(resultBlock);
    });

    scoreContainer.textContent = `Điểm của bạn: ${score} / ${quizData.length}`;

    if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
        MathJax.typesetPromise([resultsContainer]);
    }

    localStorage.removeItem('userAnswers');
    localStorage.removeItem('quizData');
});