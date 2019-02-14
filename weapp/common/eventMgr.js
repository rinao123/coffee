var eventNames = {
    ON_LOGIN_SUCCESS: "ON_LOGIN_SUCCESS",
    ON_ADDRESS_SELECT: "ON_ADDRESS_SELECT",
    ON_ADDRESS_ADD: "ON_ADDRESS_ADD",
    ON_VIDEO_PLAY: "ON_VIDEO_PLAY",
    ON_STOP_ALL_VIDEO: "ON_STOP_ALL_VIDEO",
    ON_LAYOUT_REFRESH: "ON_LAYOUT_REFRESH"
};

var events = {};

var registerEvent = function (eventName, context, handler) {
    var item = {context: context, handler: handler};
    if (events.hasOwnProperty(eventName)) {
        var exist = false;
        for (var i in events[eventName]) {
            if (events[eventName][i].context == context && events[eventName][i].handler == handler) {
                exist = true;
                break;
            }
        }
        if(!exist){
            events[eventName].push(item);
        }
    } else {
        events[eventName] = [item];
    }
    console.log("registerEvent:", events);
}

var unregisterEvent = function (eventName, context, handler) {
    if (!events.hasOwnProperty(eventName)) {
        return;
    }
    if (events[eventName].length > 1) {
        for (var i in events[eventName]) {
            if (events[eventName][i].context == context && events[eventName][i].handler == handler) {
                events[eventName].splice(i, 1);
                break;
            }
        }
    } else {
        delete events[eventName];
    }
    console.log("unregisterEvent:", events);
}

var triggerEvent = function (eventName, args = []) {
    if (!events.hasOwnProperty(eventName)) {
        return;
    }
    for(var item of events[eventName]){
        item.handler.call(item.context, ...args);
    }
}

module.exports = {
    eventNames,
    events,
    registerEvent,
    unregisterEvent,
    triggerEvent
}