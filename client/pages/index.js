import Head from 'next/head';
import io from "socket.io-client";
import { useRouter } from "next/router";
import {
  useRecoilState,
} from "recoil";
import { usernameState, roomNo } from "../Atoms/userAtom";


const socket = io.connect("http://localhost:3001");

export default function Home() {
  const [username, setUsername] = useRecoilState(usernameState);
  const [room, setRoom] = useRecoilState(roomNo);
  const router = useRouter();

  const joinRoom = () => {
    if (username !== "" & room !== "") {
      socket.emit("join_room", room)
      router.push("/chat");
    }
  }

  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <Head>
          <title>Socket-App</title>
          <meta name="description" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="m-4 flex flex-col items-center justify-center bg-black text-green-400 shadow-md rounded-lg pt-4">
          <h3>Join a Chat</h3>
          <div className="flex flex-col items-center justify-center mx-10 my-5">
            <label className="text-green-400 text-sm -ml-40">Username:</label>
            <input
              type="text"
              className="m-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Maajee.."
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />

            <label className="text-green-400 text-sm mr-40">Room.No:</label>
            <input
              type="text"
              className="m-2 shadow appearance-none w-full py-2 px-3 text-gray-700 border rounded test-xs focus:outline-none"
              placeholder="Room ID:"
              onChange={(e) => {
                setRoom(e.target.value);
              }}
            />

            <button
              className="bg-green-400 hover:bg-green-500 rounded text-white p-1 px-5 mt-1.5 focus:outline-none focus:shadow-outline outline-none"
              onClick={joinRoom}
            >
              Join Room
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
