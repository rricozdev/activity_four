import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";

// Importamos la imagen de fondo
import background from "/bg.png";

// Importamos los estilos de la barra de desplazamiento
import "./ScrollBar.css";

const socket = io("/");

/**
 * Componente Chat
 * 
 * Este componente representa la interfaz de chat en tiempo real.
 * Permite a los usuarios enviar mensajes y recibir actualizaciones en tiempo real.
 */
export default function Chat() {
    const [message, setMessage] = useState(""); // Estado para el mensaje actual.
    const [messages, setMessages] = useState([]); // Estado para almacenar los mensajes.
    const messagesEndRef = useRef(null); // Referencia al final de la lista de mensajes.
  
    // Manejador para el envío de mensajes.
    const handleSubmit = (event) => {
      event.preventDefault();
      const newMessage = {
        body: message,
        from: "Yo ",
      };
      setMessages([...messages, newMessage]); // Agregamos un nuevo mensaje a la lista
      socket.emit("message", message); // Enviamos mensaje al servidor.
      setMessage(""); // Limpiamos el campo de entrada después de enviar el mensaje
    };
  
    // Configuración para escuchar y recibir mensajes entrantes del servidor a través de una conexión de socket.
    useEffect(() => {
      socket.on("message", receivedMessages);
  
      return () => socket.off("message", receivedMessages);
    }, []);
  
    // Procesasamos mensajes recibidos del servidor.
    const receivedMessages = (message) =>
      setMessages((state) => [...state, message]);

    // Desplazamos automáticamente hacia abajo al recibir un nuevo mensaje
    useEffect(() => {
      scrollToBottom();
    }, [messages]);
  

    // Función para desplazar automáticamente hacia abajo en la lista de mensajes. 
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
  
    return (
      <div className="min-h-screen flex flex-col justify-between bg-gray-900 text-white">
        {/* Fondo con imagen */}
        <div
          className="flex-grow w-[400px] max-w-sm mx-auto bg-cover bg-center rounded-lg overflow-hidden relative"
          style={{ backgroundImage: `url(${background})` }}
        >
          <div className="absolute top-0 left-0 right-0 bottom-0 overflow-y-auto">
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
              <div ref={messagesEndRef} />
            </ul>
          </div>
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
