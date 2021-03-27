var webPush = require('web-push');
 
const vapidKeys = {
   "publicKey": "BHBYLeKPtuCUfWk4NZVLJusBrXyrY-m-8nd1icOzY-8cjNz5z963mJ_TjWYsDBwMbcWNsesJ0viTTTCH9Jmu67E",
   "privateKey": "sRHsR4qysqKbKSAdh_2YIWxOUFA_nSSxaQM1ew_dN4M"
};
 
webPush.setVapidDetails(
   'mailto:example@yourdomain.org',
   vapidKeys.publicKey,
   vapidKeys.privateKey
)
var pushSubscription = {
   "endpoint": "https://fcm.googleapis.com/fcm/send/eLF_pIwK0C0:APA91bHkNOTLiSMakDaRPzaSVTFi3r2fPK8MnWsZbc9v55pFTPpBo5CmeCBgOItz5hfF0XMDMQPQXAJ1g0A-KuLgQE3yLYpV9IhX-Ob_3ALpUFx3gvjNtFD2s3mV49yXjhjqzZEvUm8T",
   "keys": {
       "p256dh": "BLS6me89zCsGrh+D52mZGUEih2PF8nqjzfuntc/QAV1Vu1zDu0V5x/XulyEA4r/Wxjwb9veL52XIQ1m9t/j1BC0=",
       "auth": "0d+ziimhVSIBzbKQBO4DaA=="
   }
};
var payload = 'Selamat! Aplikasi Anda sudah dapat menerima push notifikasi!';
 
var options = {
   gcmAPIKey: '843441772877', // FCM Sender ID
   TTL: 60
};
webPush.sendNotification(
   pushSubscription,
   payload,
   options
);