import Heading from "@/components/Heading";
import RoomCard from "@/components/RoomCard";
import getRooms from "./actions/getRooms";

export default async function Home() {
  const rooms = await getRooms();
  
  return (
    <>
      <Heading title="Available Rooms" />
      {rooms.length > 0 ? (
        rooms.map((room) => <RoomCard room={room} key={room.$id}/>)
      ) : (
        <p>No rooms available at the moment</p>
      )}
    </>
  );
}
