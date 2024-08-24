import { useEffect, useState } from "react";
import "./App.css";
// import * as signalR from "@microsoft/signalr";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";

function App() {
  let [connection, setConnection] = useState<HubConnection | undefined>(
    undefined
  );

  useEffect(() => {
    // Cancel everything if this component unmounts
    let canceled = false;

    fetch("/ping")
      .then((response) => console.log(response.text()))

    // Build a connection to the signalR server. Automatically reconnect if the connection is lost.
    const connection = new HubConnectionBuilder()
      .withUrl("/serverHub")
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Debug)
      .build();

    // Try to start the connection
    connection
      .start()
      .then(() => {
        if (!canceled) {
          setConnection(connection);
        }
      })
      .catch((error) => {
        console.log("signal error", error);
      });

    // Handle the connection closing
    connection.onclose((error) => {
      if (canceled) {
        return;
      }
      console.log("signal closed");
      setConnection(undefined);
    });

    // If the connection is lost, it won't close. Instead it will try to reconnect.
    // So we need to treat this is a lost connection until `onreconnected` is called.
    connection.onreconnecting((error) => {
      if (canceled) {
        return;
      }
      console.log("signal reconnecting");
      setConnection(undefined);
    });

    // Connection is back, yay
    connection.onreconnected((error) => {
      if (canceled) {
        return;
      }
      console.log("signal reconnected");
      setConnection(connection);
    });

    // Clean up the connection when the component unmounts
    return () => {
      canceled = true;
      connection.stop();
    };
  }, []);

  return (
    <div className="App">
      <h1>SignalR Chat</h1>
      <p>{connection ? "Connected" : "Not connected"}</p>
    </div>
  );
  // // Builds the SignalR connection, mapping it to /chat
  // const hubConnection = new signalR.HubConnectionBuilder()
  //   .withUrl("/serverHub")
  //   .configureLogging(signalR.LogLevel.Debug)
  //   .build();

  // // Starts the SignalR connection
  // hubConnection.start().then((_) => {
  //   // Once started, invokes the sendConnectionId
  //   if (hubConnection.connectionId) {
  //     hubConnection.invoke("sendConnectionId", hubConnection.connectionId);
  //   }
  // });
  // console.log(hubConnection.state);

  // return (
  //   <>
  //     <SignalRTime hubConnection={hubConnection} />
  //     <SignalRClient hubConnection={hubConnection} />
  //   </>
  // );
}

// function SignalRTime(props: { hubConnection: signalR.HubConnection }) {
//   // Sets the time from the server
//   const [time, setTime] = useState<string | null>(null);

//   useEffect(() => {
//     props.hubConnection.on("setTime", (message) => {
//       setTime(message);
//     });
//   });

//   return <p>The time is {time}</p>;
// }

// function SignalRClient(props: { hubConnection: signalR.HubConnection }) {
//   // Sets a client message, sent from the server
//   const [clientMessage, setClientMessage] = useState<string | null>(null);

//   useEffect(() => {
//     props.hubConnection.on("setClientMessage", (message) => {
//       setClientMessage(message);
//     });
//   });

//   return <p>{clientMessage}</p>;
// }

export default App;
