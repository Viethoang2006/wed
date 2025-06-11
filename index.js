document.addEventListener('DOMContentLoaded', function() {
    
    // --- PHẦN 1: LOGIC HIỂN THỊ NGÀY GIỜ ---
    const dateDisplay = document.getElementById('date-display');
    const timeDisplay = document.getElementById('time-display');

    function updateDateTime() {
        const now = new Date();
        
        // Định dạng ngày theo tiếng Việt (Thứ, ngày tháng năm)
        const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        if (dateDisplay) {
            dateDisplay.innerHTML = `<i class="fa-solid fa-calendar-days"></i> ${now.toLocaleDateString('vi-VN', dateOptions)}`;
        }

        // Định dạng giờ (Giờ:Phút:Giây)
        if (timeDisplay) {
            timeDisplay.innerHTML = `<i class="fa-solid fa-clock"></i> ${now.toLocaleTimeString('vi-VN')}`;
        }
    }

    // Cập nhật ngày giờ ngay khi tải trang và sau đó mỗi giây
    updateDateTime();
    setInterval(updateDateTime, 1000);

    
    // --- PHẦN 2: LOGIC TẠO CÁC THẺ CHỌN CHƯƠNG ---
    const chapterContainer = document.getElementById('chapter-selection-container');
    
    // Dữ liệu các chương kèm theo icon tương ứng từ Font Awesome
    const chapters = {
        1: { title: "Điện tích - Điện trường", icon: "fa-solid fa-bolt" },
        2: { title: "Từ trường", icon: "fa-solid fa-magnet" },
        3: { title: "Cảm ứng điện từ", icon: "fa-solid fa-bolt-lightning" },
        4: { title: "Trường điện từ & Dòng điện dịch", icon: "fa-solid fa-wifi" },
        5: { title: "Mạch dao động", icon: "fa-solid fa-wave-square" },
        6: { title: "Sóng điện từ & Truyền thông", icon: "fa-solid fa-tower-broadcast" },
        7: { title: "Sóng cơ & Giao thoa ánh sáng", icon: "fa-solid fa-lightbulb" },
        8: { title: "Lượng tử ánh sáng & Vật đen", icon: "fa-solid fa-atom" },
        9: { title: "Tổng hợp bài lý thuyết và bài tập Vật Lý đại cương", icon: "fa-solid fa-lightbulb"}
    };

    // Chỉ thực hiện nếu tìm thấy container
    if(chapterContainer){
        let chapterHTML = '';
        // Lặp qua dữ liệu và tạo HTML cho mỗi thẻ chương
        for (const key in chapters) {
            const chapter = chapters[key];
            chapterHTML += `
                <a href="quiz.html?chapter=${key}" class="chapter-card">
                    <div class="chapter-icon">
                        <i class="${chapter.icon}"></i>
                    </div>
                    <div class="chapter-info">
                        <h2>Chương ${key}</h2>
                        <p>${chapter.title}</p>
                    </div>
                </a>
            `;
        }
        
        // Đưa HTML đã tạo vào trang
        chapterContainer.innerHTML = chapterHTML;
    }

});
