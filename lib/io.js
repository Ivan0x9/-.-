module.exports = function(io) {

io.sockets.on('connection', function(socket){
    console.log('a user connected');

//console.log(clients);
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });

    socket.on('send:message', function (data) {
        console.log('RADI');
    });

    socket.on('send:login', function (data) {
        //baza

        if(data.username == username && data.password == password) {


            console.log('RADI');

        }
    });


});
};