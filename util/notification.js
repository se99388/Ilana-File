const notifier = require('node-notifier');
// windows notification
const displayNotification = (title, message) => {
    notifier.notify({
        title,
        message,
    },(err)=> {
        err?console.log("displayNotification function error: ",err):null;
        
      });
};

module.exports = {
    displayNotification
};
