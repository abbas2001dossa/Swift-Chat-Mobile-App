import { Image, View, Pressable, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { SelectUserId } from '../Redux/UserSlice';

const User = ({ item }) => {
  const userId = useSelector(SelectUserId);
  const [RequestSent, setRequestSent] = useState(false);
  const [FriendRequests, setFriendRequests] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await fetch(`http://192.168.100.9:8000/friendsRequests/sent/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setFriendRequests(data);
        } else {
          console.log("error", response.status);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchFriendRequests();
  }, []);

  useEffect(() => {
    const fetchUserFriends = async () => {
      try {
        const response = await fetch(`http://192.168.100.9:8000/friends/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setUserFriends(data);
        } else {
          console.log("error retrieving user friends ", response.status);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserFriends();
  }, []);

  const SendFriendRequest = async (currentUserId, selectedUserId) => {
    try {
      const response = await fetch("http://192.168.100.9:8000/friendRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentUserId, selectedUserId }),
      });

      if (response.ok) {
        // Update the state to reflect that the request has been sent
        setRequestSent(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Pressable style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
      <View>
        <Image source={{ uri: "https://t4.ftcdn.net/jpg/03/32/59/65/240_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg" }} style={{ width: 50, height: 50, borderRadius: 25, resizeMode: "cover" }}></Image>
      </View>

      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
        <Text style={{ marginTop: 4, color: "gray" }}>{item.email} </Text>
      </View>

      {userFriends.includes(item._id) ? (
        <Pressable
          style={{ backgroundColor: "#82CD47", padding: 10, borderRadius: 8, width: 105 }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}> Friends </Text>
        </Pressable>
      ) : RequestSent || FriendRequests.some((friend) => friend._id === item._id) ? (
        <Pressable
          style={{ backgroundColor: "gray", padding: 10, borderRadius: 8, width: 105 }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}> Request Sent </Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => {
            SendFriendRequest(userId, item._id);
            // Update the button text and background immediately
            setRequestSent(true);
          }}
          style={{ backgroundColor: "#567189", padding: 10, borderRadius: 8, width: 105 }}
        >
          <Text style={{ textAlign: "center", color: "white", fontSize: 13 }}>
            {RequestSent ? "Request Sent" : "Add Friend"}
          </Text>
        </Pressable>
      )}
    </Pressable>
  );
}

export default User;
