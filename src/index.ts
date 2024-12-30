
import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 7070 });

const Usermap = new Map<WebSocket, string>();

wss.on("connection", (socket) => {

    socket.on("message", (e) => {
        const parsedmessage = JSON.parse(e.toString());
        if (parsedmessage.type == "join") {
            const roomId = parsedmessage.payload.roomId;
            Usermap.set(socket, roomId);
        }

        if (parsedmessage.type == "chat") {
            const usermessage = parsedmessage.payload.message;
            const userRoom = Usermap.get(socket);

            if (userRoom) {
                for (const [client, room] of Usermap.entries()) {
                    if (userRoom === room) {
                        client.send(usermessage);
                    }
                }
            }
        }
    })
})