const socket = require("socket.io");
const { createAdapter } = require("@socket.io/postgres-adapter");
const EventEmitter = require('events');

console.log("Socket Script started");

// Socket.io code
const socketStart = (server, pool, instructorModel) => {
    const io = socket(server);
    const userActionQueue = [];
    const bus = new EventEmitter();
    let lock = false;
    io.adapter(createAdapter(pool));

    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('itemChanged', (item, itemInfo) => {
            // Update posgresql database with the changed item
            //console.log(itemInfo);
            instructorModel.putCourse(itemInfo.username, itemInfo.courseNum, itemInfo.start, itemInfo.end)
            .then(response => {
                console.log("Update Success");
                //console.log("Response: " + JSON.stringify(response));
                // Broadcast to everyone except sender
                console.log(itemInfo);
                console.log(item);
                socket.broadcast.emit('itemChanged', item);
            })
            .catch(error => {
                console.log(error);
                socket.emit('error', error);
            })
        });

        socket.on('courseDeleted', (course, i) => {
            // Update posgresql database with the changed item
            //console.log(itemInfo);
            instructorModel.deleteCourse(course.courseNum, course.userId)
            .then(response => {
                console.log("Update Success");
                //console.log("Response: " + JSON.stringify(response));
                // Broadcast to everyone except sender
                console.log(course);
                socket.broadcast.emit('courseDeleted', i);
            })
            .catch(error => {
                console.log(error);
                socket.emit('error', error);
            })
        });

        socket.on('userAdded', (user, rownum) => {
            // Update posgresql database
            console.log(user);
            instructorModel.postUser(user, rownum)
            .then(response => {
                console.log("Add Success");
                //console.log("Response: " + JSON.stringify(response));
                // Broadcast to everyone except sender
                //console.log(item);
                socket.broadcast.emit('userAdded', user);
            })
            .catch(error => {
                console.log(error);
                socket.emit('error', error);
            })
        });

        socket.on('userDeleted', (key, x) => {
            // Update posgresql database
            console.log(key);
            instructorModel.deleteUser(key)
            .then(response => {
                console.log("Delete Success");
                //console.log("Response: " + JSON.stringify(response));
                // Broadcast to everyone except sender
                //console.log(item);
                socket.broadcast.emit('userDeleted', key, x);
            })
            .catch(error => {
                console.log(error);
                socket.emit('error', error);
            })
        });

        socket.on('courseAdded', (course) => {
            // Update posgresql database
            console.log(course);
            instructorModel.postCourse(course)
            .then(response => {
                console.log("Course Post Success");
                //console.log("Response: " + JSON.stringify(response));
                
                // Broadcast to everyone except sender
                //socket.broadcast.emit('courseAdded', course);

                // Broadcast to everyone
                socket.emit('courseAdded', course);
                socket.broadcast.emit('courseAdded', course);
            })
            .catch(error => {
                console.log(error);
                // console.log("error");

                // Error code
                let msg;
                switch(error.code) {
                    case('23505'):
                        msg = "Course number already exists for another course! Please choose another.";
                        break;
                    default:
                        msg = "Error in inserting course. Please check your course input.";
                        break;
                }

                console.log(msg);

                socket.emit('error', msg);
            })
        });
    });
}

module.exports = {
    socketStart
}