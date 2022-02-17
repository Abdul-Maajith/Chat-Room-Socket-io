import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useRouter } from "next/router";
import { usernameState, roomNo } from "../Atoms/userAtom";
import {
  useRecoilValue,
} from "recoil";

const socket = io.connect("http://localhost:3001");

function Chat() {
  const username = useRecoilValue(usernameState);
  const room = useRecoilValue(roomNo);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      // Emit Socket with the message information.
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  // Event to show the sended message to other user in that room.
  useEffect(() => {
    socket.on("receive_message", (data) => {
      console.log(data)
    });
  }, [socket]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="bg-black h-[500px] w-[350px] flex flex-col items-center text-green-400 rounded">
        <div className="flex-[0.1] bg-green-500 text-white border-none w-full items-center justify-start mx-0.5 rounded-t">
          <p className="p-3">Live Chat</p>
        </div>

        <div className="flex-grow overflow-scroll scrollbar-hide">
          <div>
            {messageList.map((message, index) => (
              <p key={index}>{message.message}</p>
            ))}
          </div>
        </div>

        <div className="flex mt-1 w-full items-center justify-end border-black rounded border-1 mb-2">
          <div className="flex w-full px-2">
            <input
              className="-2 shadow appearance-none w-full py-2 px-3 text-gray-700 test-xs focus:outline-none rounded border-black flex-[0.95]"
              type="text"
              placeholder="Hey.."
              onChange={(e) => {
                setCurrentMessage(e.target.value);
              }}
            />

            <button
              className="text-white bg-green-500 flex items-center flex-[0.1] p-1 ml-1 h-10 w-3 rounded hover:bg-green-400"
              onClick={sendMessage}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className=""
              >
                <path
                  fillRule="evenodd"
                  d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;