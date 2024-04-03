
const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const dotnenv = require('dotenv')
const { Server } = require('socket.io');
const { default: mongoose } = require('mongoose');
const { Message } = require('./models/message')

const addMessageDb = require('./lib/insertDb')
const leaveRoom = require('./lib/leave-room'); // Add this

dotnenv.config()
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log(`MongoDbga ulanish xoisl qildim.`)
}).catch(err => {
    console.log('Ulanishda xato boldi ' + err)
})




// xonadagi oxirgi 100 ta xabarn olish metodi
async function getLast100Messages(room) {
    const messages = await Message.find({ room: room }).sort({ createDateTime: 1 }).limit(100)
    return messages
}


app.get('/', (req, res) => {
    res.send("Hello world")
})

const server = http.createServer(app);
const io = new Server(server,{
    cors:'http://localhost:5173',
    methods:['GET','POST']

})
const PORT = process.env.PORT || 4000;

const CHAT_BOT = 'Chat admin'
let chatRoom = ''; // E.g. javascript, node,...
let allUsers = []; // All users in current chat room


// ummumiy socketga bog'lanish xosil qilamiz
io.on('connection', (socket) => {
    console.log(`${socket.id} user connected`)

    // foydalanuvchilarni interfeysda emit('nom',{data}) qilgan chaqirgan xodisasi bo'yicha ushlab ushlab olamiz
    socket.on('xonaga_qoshilayapman', async ({ room, username }) => {
        console.log(`${username} foydalanuvchi ${room} nomli xonaga qo'shildi`)
        //foydalanuvchini tegishli xonaga qo'shamiz
        socket.join(room)

        // foydalanuvchi xonaga qo'shilgandan keyin xonadagi oxirgi 100 ta xabarni ko'rsatamiz.\
        socket.emit('oxirgi_100_xabar', await getLast100Messages(room))

        let createDateTime = Date.now() //aniq vaqtni olamiz

        // aniq kiritilgan xonadagi barcha foydalanuvchilarga xabar yuboramiz
        socket.to(room).emit('kelgan_xabar', {
            message: `${username} foydalanuvchi xonamizga qo'shildi :).`,
            username: CHAT_BOT,
            createDateTime
        })

        // yangi qo'shilgan foydalanuvchiga xush kelibsiz deymiz :) bunda ko'radigan bo'lsak yuqoridagi room ichidagi barchaga ikkinchi emit esa alohida xonaga_qoshilayapman xodisasini chaqirgan foydalanuvchiga mazzami
        socket.emit('kelgan_xabar', {
            message: `${username} xush keldilar :)`,
            username: CHAT_BOT,
            createDateTime
        })
        chatRoom = room
        allUsers.push({ id: socket.id, username, room })
        chatRoomUsers = allUsers.filter((user) => user.room === room)
        socket.to(room).emit('xona_odamlari', chatRoomUsers)
        socket.emit('xona_odamlari', chatRoomUsers)


        // yoziladigan xabararni ilib olamiz
        socket.on('xabar_yubor', async (data) => {
            const { username, room, message, createDateTime } = data
            io.in(room).emit('kelgan_xabar', data)
            addMessageDb(data)
            // const newMsg = new Message(data)
            // await newMsg.save()
            // console.log(await Message.find())

        })

        // xondan chiqishni rejalashtiramiz

        socket.on('xonadan_chiqish', (data) => {
            socket.leave(data.room)
            const createDateTime = Date.now()
            allUsers = leaveRoom(socket.id, allUsers)
            socket.to(data.room).emit('xona_odamlari', allUsers)
            socket.to(data.room).emit('kelgan_xabar', {
                username: CHAT_BOT,
                message: `${data.username} chatdan chiqib ketdi. :(`,
                createDateTime
            })
            console.log(`${username} has left the chat`);
        })


    })
})


server.listen(PORT,"0.0.0.0",() => `Server is running on port ${PORT}`);