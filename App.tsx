import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text } from "react-native";
import { StreamChat } from "stream-chat";
import { OverlayProvider, Chat, ChannelList } from "stream-chat-expo";

const streamApi = "YOUR_API_KEY";

const client = StreamChat.getInstance(streamApi);

export default function App() {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const onChannelPressed = (channel: any) => {
    setSelectedChannel(channel);
  };

  useEffect(() => {
    const connectUser = async () => {
      await client.connectUser(
        {
          id: "user",
          name: "User Name",
          image: "https://i.imgur.com/fR9Jz14.png",
        },
        client.devToken("user")
      );

      const channel = client.channel("messaging", "test_channel", {
        name: "Test Channel",
      });

      await channel.watch();
      setIsReady(true);
    };

    connectUser();

    return () => {
      client.disconnectUser();
    };
  }, []);

  if (!isReady) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <OverlayProvider>
        <Chat client={client}>
          {selectedChannel ? (
            <Text>Channel Page</Text>
          ) : (
            <ChannelList onSelect={onChannelPressed} />
          )}
        </Chat>
      </OverlayProvider>
    </SafeAreaProvider>
  );
}
