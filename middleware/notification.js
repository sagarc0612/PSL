module.exports = (sender ,lastMessage, firebaseToken) => {

    const payload = {
        notification: {
          title: sender.fullname,
          body: lastMessage.message,
          image:sender.profileImage
        }
      };
      const options = {
        priority: 'high',
        //timeToLive: 60 
      };    
      firebase.messaging().sendToDevice(firebaseToken,payload,options).then(function (response) {
      console.log(response);
      })
    }