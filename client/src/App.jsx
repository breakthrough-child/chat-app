import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import logo from "./assets/logo.png";

const socket = io(import.meta.env.VITE_API_URL);

function App() {
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] =
  useState("");
  const [messages, setMessages] = useState([]);
  const [roomMessages, setRoomMessages] =
  useState({});
  const [room, setRoom] = useState("general");
  const [channels, setChannels] =
  useState([]);
  const [newChannel, setNewChannel] =
    useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] =
    useState("");
  const [description, setDescription] =
    useState("");
  const [profilePic, setProfilePic] =
    useState("");
  const [showProfile, setShowProfile] =
    useState(false);
  const [darkMode, setDarkMode] =
    useState(true);
  const [showSearch, setShowSearch] =
    useState(false);

  useEffect(() => {
    socket.emit("join_room", "general");

    socket.on("receive_message", (data) => {
      setRoomMessages((prev) => ({
        ...prev,
        [data.room]: [
          ...(prev[data.room] || []),
          data
        ]
      }));
    });

    socket.on("all_channels", (data) => {
      setChannels(data);
    });

    return () => {
      socket.off("receive_message");
      socket.off("all_channels");
    };
  }, []);

  const handleAuth = async (e) => {
  e.preventDefault();

  const endpoint = isLogin
    ? "login"
    : "register";

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      }
    );

    const data = await response.json();

    alert(data.message);

    if (endpoint === "login" && response.ok) {
      setUser({
        ...data.user
      });

      setDisplayName(data.user.displayName || "");
      setDescription(data.user.description || "");
      setProfilePic(data.user.profilePic || "");
    }

  } catch (error) {
    console.log(error);
  }
};

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setProfilePic(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/update-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: user.id,
            displayName,
            description,
            profilePic
          })
        }
      );

      const data = await response.json();

      alert(data.message);

      setUser({
        ...data.user,
        profilePic,
        displayName,
        description
      });

    } catch (error) {
      console.log(error);
    }
  };

  const createChannel = () => {
    const trimmedChannel =
      newChannel.trim().toLowerCase();

    if (!trimmedChannel) return;

    socket.emit(
      "create_channel",
      trimmedChannel
    );

    joinRoom(trimmedChannel);

    setNewChannel("");
  };

const joinRoom = (roomName) => {
  setRoom(roomName);

  socket.emit("join_room", roomName);
};

  const filteredMessages =
    (roomMessages[room] || []).filter(
    (msg) =>
      msg.text
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      (msg.displayName || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const sendMessage = () => {
    if (message.trim() === "") return;

    const messageData = {
      room,
      text: message,
      time: new Date().toLocaleTimeString(),
      username: user.username,
      displayName,
      profilePic
    };

    socket.emit("send_message", messageData);

    setMessage("");
  };

if (!user) {
  return (
    <div
      style={{
        height: "100dvh",
        background: darkMode
          ? "#020617"
          : "#e2e8f0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily:
          "'Inter', Arial, sans-serif"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: darkMode
            ? "#0f172a"
            : "white",
          padding: "40px",
          borderRadius: "28px",
          boxShadow: darkMode
            ? "0 10px 40px rgba(0,0,0,0.45)"
            : "0 10px 40px rgba(0,0,0,0.08)",
          border: darkMode
            ? "1px solid #1e293b"
            : "1px solid #ddd"
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
            color: darkMode
              ? "white"
              : "#0f172a"
          }}
        >
          Chater <img
              src={logo}
              alt="Chatter Logo"
              width="42"
              height="42"
              style={{
                objectFit: "contain"
              }}
            />
        </h1>

        

        <p
          style={{
            textAlign: "center",
            opacity: 0.7,
            marginBottom: "30px",
            color: darkMode
              ? "white"
              : "#0f172a"
          }}
        >
          {isLogin
            ? "Welcome back"
            : "Create your account"}
        </p>

        <form
          onSubmit={handleAuth}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
            style={{
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              outline: "none",
              background: darkMode
                ? "#1e293b"
                : "#f1f5f9",
              color: darkMode
                ? "white"
                : "black"
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={{
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              outline: "none",
              background: darkMode
                ? "#1e293b"
                : "#f1f5f9",
              color: darkMode
                ? "white"
                : "black"
            }}
          />

          <button
            type="submit"
            style={{
              padding: "14px",
              borderRadius: "16px",
              border: "none",
              background:
                "linear-gradient(135deg,#3b82f6,#2563eb)",
              color: "white",
              fontWeight: "bold",
              fontSize: "15px",
              cursor: "pointer",
              boxShadow:
                "0 8px 20px rgba(59,130,246,0.4)"
            }}
          >
            {isLogin
              ? "Login"
              : "Register"}
          </button>
        </form>

        <button
          onClick={() =>
            setIsLogin(!isLogin)
          }
          style={{
            marginTop: "18px",
            width: "100%",
            padding: "12px",
            borderRadius: "14px",
            border: "none",
            background: darkMode
              ? "#1e293b"
              : "#f1f5f9",
            color: darkMode
              ? "white"
              : "#0f172a",
            cursor: "pointer"
          }}
        >
          Switch to{" "}
          {isLogin
            ? "Register"
            : "Login"}
        </button>
      </div>
    </div>
  );
}

  return (
    <div
      style={{
        height: "100dvh",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "1400px",
        background: darkMode
          ? "#020617"
          : "#e2e8f0",
        color: darkMode
          ? "white"
          : "#0f172a",
        padding: "15px",
        display: "flex",
        flexDirection: "column",
        transition: "0.3s",
        fontFamily:
          "'Inter', Arial, sans-serif"
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 18px",
          borderRadius: "18px",
          background: darkMode
            ? "#0f172a"
            : "white",
          boxShadow: darkMode
            ? "0 4px 20px rgba(0,0,0,0.3)"
            : "0 4px 20px rgba(0,0,0,0.08)",
          marginBottom: "15px",
          flexWrap: "wrap",
          gap: "12px",
          border: darkMode
            ? "1px solid #1e293b"
            : "1px solid #ddd"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <img
            src={
              profilePic ||
              "https://via.placeholder.com/50"
            }
            alt="profile"
            width="50"
            height="50"
            style={{
              borderRadius: "50%",
              objectFit: "cover",
              border:
                "3px solid #3b82f6"
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}
          >
            

            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "1.5rem",
                  color: darkMode
                    ? "white"
                    : "#0f172a"
                }}
              >
                Chater
              </h1>

              <small
                style={{
                  opacity: 0.7
                }}
              >
                {displayName || username}
              </small>
            </div>

            <img
              src={logo}
              alt="Chater Logo"
              width="42"
              height="42"
              style={{
                objectFit: "contain"
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap"
          }}
        >
          <button
            onClick={() =>
              setShowSearch(!showSearch)
            }
            style={{
              padding: "10px 14px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer"
            }}
          >
            🔍
          </button>

          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            style={{
              padding: "10px 14px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer"
            }}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button
            onClick={() =>
              setShowProfile(true)
            }
            style={{
              padding: "10px 14px",
              borderRadius: "12px",
              border: "none",
              background: "#3b82f6",
              color: "white",
              cursor: "pointer"
            }}
          >
            Profile
          </button>

          <button
            onClick={logout}
            style={{
              padding: "10px 14px",
              borderRadius: "12px",
              border: "none",
              background: "#ef4444",
              color: "white",
              cursor: "pointer"
            }}
          >
            Logout
          </button>
        </div>
      </div>


      {showProfile && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 1000
            }}
          >
            <div
              style={{
                background: darkMode
                  ? "#0f172a"
                  : "white",
                padding: "35px",
                borderRadius: "28px",
                width: "92%",
                maxWidth: "420px",
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.45)",
                border: darkMode
                  ? "1px solid #1e293b"
                  : "1px solid #ddd",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "14px"
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    color: darkMode
                      ? "white"
                      : "#0f172a"
                  }}
                >
                  Edit Profile
                </h2>

                <button
                  onClick={() =>
                    setShowProfile(false)
                  }
                  style={{
                    border: "none",
                    background: "transparent",
                    fontSize: "22px",
                    cursor: "pointer",
                    color: darkMode
                      ? "white"
                      : "#0f172a"
                  }}
                >
                  ×
                </button>
              </div>

              <img
                src={
                  profilePic ||
                  "https://via.placeholder.com/120"
                }
                alt="profile"
                width="120"
                height="120"
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                  border:
                    "4px solid #3b82f6",
                  boxShadow:
                    "0 8px 25px rgba(59,130,246,0.4)"
                }}
              />

              <input
                type="text"
                placeholder="Display Name"
                value={displayName}
                onChange={(e) =>
                  setDisplayName(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "14px",
                  border: "none",
                  outline: "none",
                  background: darkMode
                    ? "#1e293b"
                    : "#f1f5f9",
                  color: darkMode
                    ? "white"
                    : "black"
                }}
              />

              <textarea
                placeholder="Bio / Description"
                value={description}
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                rows={3}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "14px",
                  border: "none",
                  outline: "none",
                  resize: "none",
                  background: darkMode
                    ? "#1e293b"
                    : "#f1f5f9",
                  color: darkMode
                    ? "white"
                    : "black"
                }}
              />

              <div
                style={{
                  width: "100%"
                }}
              >
                <label
                  style={{
                    fontSize: "14px",
                    opacity: 0.7
                  }}
                >
                  Upload Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{
                    marginTop: "8px",
                    width: "100%"
                  }}
                />
              </div>

              <input
                type="text"
                placeholder="Or paste image URL"
                value={profilePic}
                onChange={(e) =>
                  setProfilePic(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "14px",
                  border: "none",
                  outline: "none",
                  background: darkMode
                    ? "#1e293b"
                    : "#f1f5f9",
                  color: darkMode
                    ? "white"
                    : "black"
                }}
              />

              <button
                onClick={() => {
                  updateProfile();
                  setShowProfile(false);
                }}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "16px",
                  border: "none",
                  background:
                    "linear-gradient(135deg,#3b82f6,#2563eb)",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "15px",
                  cursor: "pointer",
                  boxShadow:
                    "0 8px 20px rgba(59,130,246,0.4)"
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}


      <h2
        style={{
          color: darkMode
            ? "white"
            : "#0f172a",
          marginBottom: "12px"
        }}
      >
         #{room}
      </h2>

<div
    style={{
      background: darkMode
        ? "#0f172a"
        : "white",
      padding: window.innerWidth < 768
        ? "10px"
        : "16px",
      borderRadius: "18px",
      marginBottom: "10px",
      border: darkMode
        ? "1px solid #1e293b"
        : "1px solid #ddd",
      flexShrink: 0
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px"
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize:
            window.innerWidth < 768
              ? "14px"
              : "18px",
          color: darkMode
            ? "white"
            : "#0f172a"
        }}
      >
        Channels
      </h3>
    </div>

    <div
      style={{
        display: "flex",
        gap: "8px",
        overflowX: "auto",
        paddingBottom: "6px",
        scrollbarWidth: "none",
        msOverflowStyle: "none"
      }}
    >
      {channels.map((channel) => (
        <button
          key={channel}
          onClick={() => joinRoom(channel)}
          style={{
            padding:
              window.innerWidth < 768
                ? "8px 12px"
                : "10px 14px",
            borderRadius: "999px",
            border: "none",
            background:
              room === channel
                ? "#3b82f6"
                : darkMode
                ? "#1e293b"
                : "#e2e8f0",
            color:
              darkMode
                ? "white"
                : "#0f172a",
            cursor: "pointer",
            whiteSpace: "nowrap",
            fontSize:
              window.innerWidth < 768
                ? "13px"
                : "14px",
            flexShrink: 0,
            transition: "0.2s"
          }}
        >
          #{channel}
        </button>
      ))}
    </div>

    <div
      style={{
        display: "flex",
        gap: "8px",
        marginTop: "10px"
      }}
    >
      <input
        type="text"
        placeholder="New channel"
        value={newChannel}
        onChange={(e) =>
          setNewChannel(e.target.value)
        }
        style={{
          flex: 1,
          padding:
            window.innerWidth < 768
              ? "10px"
              : "12px",
          borderRadius: "12px",
          border: "none",
          outline: "none",
          background: darkMode
            ? "#1e293b"
            : "#f1f5f9",
          color: darkMode
            ? "white"
            : "black",
          fontSize:
            window.innerWidth < 768
              ? "13px"
              : "14px"
        }}
      />

      <button
        onClick={createChannel}
        style={{
          padding:
            window.innerWidth < 768
              ? "10px 14px"
              : "12px 18px",
          borderRadius: "12px",
          border: "none",
          background:
            "linear-gradient(135deg,#3b82f6,#2563eb)",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
          flexShrink: 0
        }}
      >
        +
      </button>
    </div>
</div>

      {showSearch && (
        <div
          style={{
            marginBottom: "10px",
            display: "flex",
            justifyContent: "flex-end"
          }}
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            style={{
              width: "220px",
              padding: "10px",
              borderRadius: "12px",
              border: "none",
              outline: "none",
              background: darkMode
                ? "#1e293b"
                : "white",
              color: darkMode
                ? "white"
                : "black"
            }}
          />
        </div>
      )}

      <div
        style={{
          border: "1px solid gray",
          flex: 1,
          minHeight: "300px",
          background: darkMode
            ? "#1e293b"
            : "white",
          borderRadius: "12px",
          padding: "18px",
          overflowY: "scroll",
          marginBottom: "90px",
          scrollbarWidth: "thin",
          scrollbarColor: darkMode
            ? "#3b82f6 #1e293b"
            : "#3b82f6 #cbd5e1",
        }}
      >
        {filteredMessages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              marginBottom: "15px"
            }}
          >
            <img
              src={
                msg.profilePic ||
                "https://via.placeholder.com/40"
              }
              alt="profile"
              width="40"
              height="40"
              style={{
                borderRadius: "50%",
                objectFit: "cover"
              }}
            />

            <div>
              <p style={{ margin: 0 }}>
                <strong>
                  {msg.displayName ||
                    msg.username}
                </strong>

                {" • "}

                <small>{msg.time}</small>
              </p>

              <p style={{ marginTop: "5px" }}>
                {msg.text}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          position: "sticky",
          bottom: "0",
          paddingTop: "15px",
          paddingBottom: "10px",
          background: darkMode
            ? "#0f172a"
            : "#f1f5f9",
          zIndex: 100
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: darkMode
              ? "#1e293b"
              : "white",
            padding: "12px",
            borderRadius: "18px",
            boxShadow: darkMode
              ? "0 0 15px rgba(0,0,0,0.4)"
              : "0 0 15px rgba(0,0,0,0.1)",
            border: darkMode
              ? "1px solid #334155"
              : "1px solid #ddd"
          }}
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            style={{
              flex: 1,
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              outline: "none",
              background: darkMode
                ? "#0f172a"
                : "#f8fafc",
              color: darkMode
                ? "white"
                : "black",
              fontSize: "15px"
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              padding: "14px 20px",
              borderRadius: "14px",
              border: "none",
              background:
                "linear-gradient(135deg, #3b82f6, #2563eb)",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "0.2s",
              whiteSpace: "nowrap",
              boxShadow:
                "0 4px 10px rgba(59,130,246,0.4)"
            }}
          >
            Send 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
