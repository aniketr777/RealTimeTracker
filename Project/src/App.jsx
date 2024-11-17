// App.js
import { useState } from "react";
import Username from "./Username";
import MapComponents from "./MapComponents";
function App() {
  const [username, setUsername] = useState("");

  return (
    <div>
      <div className="w-[100%] h-[20%]">
        <Username setUsername={setUsername} />
      </div>
      <div>Username: {username}</div>
      <div className="w-[100%] h-[80%] border border-black-1px">
        <MapComponents username={username}></MapComponents>
      </div>
    </div>
  );
}

export default App;
