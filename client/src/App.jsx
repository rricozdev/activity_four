import io from "socket.io-client";
import { useState, useEffect } from "react";

// Importamos la imagen de fondo
import background from "../public/bg.jpg";

const socket = io("/");

export default function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newMessage = {
      body: message,
      from: "Yo ",
    };
    setMessages([...messages, newMessage]);
    socket.emit("message", message);
    setMessage(""); // Limpiamos el campo de entrada después de enviar el mensaje
  };

  useEffect(() => {
    socket.on("message", receivedMessages);

    return () => socket.off("message", receivedMessages);
  }, []);

  const receivedMessages = (message) =>
    setMessages((state) => [...state, message]);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-900 text-white">
      {/* Fondo con imagen */}
      <div
        className="flex-grow w-[400px] max-w-sm mx-auto bg-cover bg-center rounded-lg overflow-hidden"
        style={{ backgroundImage: `url(${background})` }}
      >
        <ul className="p-4">
          {messages.map((message, index) => (
            <li
              key={index}
              className={`my-2 p-2 table text-sm rounded-md bg-sky-800 ${
                message.from === "Yo " ? "bg-sky-900 ml-auto" : "bg-gray-700"
              }`}
            >
              <span
                className={`font-bold ${
                  message.from === "Yo " ? "text-gray-200" : "text-gray-400"
                } mr-2`}
              >
                {message.from}
              </span>
              <span className="mr-2">:</span>
              {message.body}
            </li>
          ))}
        </ul>
      </div>
      {/* Formulario de envío de mensajes */}
      <form className="p-4 flex max-w-[400px] mx-auto" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ingresa tu mensaje..."
          className="flex-grow p-2 mr-2 rounded-lg bg-gray-800 text-white"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button className="p-2 bg-blue-500 text-white rounded-lg">
          Enviar
        </button>
      </form>
    </div>
  );
}


