import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [isVisible, setIsVisible] = useState(true);
  const [selected, setSelected] = useState(null);

  function visible() {
    console.log(isVisible);
    return setIsVisible((show) => !show);
  }

  function newFriend(newFr) {
    setFriends((friend) => [...friend, newFr]);
    setIsVisible(true);
  }
  function handleSelected(friend) {
    setSelected((cur) => (cur?.id === friend.id ? null : friend));
    setIsVisible(true);
  }

  function handleFriends(value) {
    setFriends((friend) =>
      friend.map((e) =>
        e.id === selected.id ? { ...e, balance: e.balance + value } : e
      )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selected={handleSelected}
          selectedFriend={selected}
        />

        <FormAddFriend
          bool={isVisible}
          onClick={visible}
          addFriend={newFriend}
        />

        <Button onClick={visible} text={isVisible ? "Add New" : "Close"} />
      </div>
      {selected && (
        <FormSplitBill selected={selected} splitBill={handleFriends} />
      )}
    </div>
  );
}

function FriendsList({ friends, selected, selectedFriend }) {
  return (
    <ul>
      {friends.map((e) => (
        <Friend
          friend={e}
          key={e.id}
          selected={selected}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, selected, selectedFriend }) {
  let isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected && selectedFriend ? "selected" : ""}>
      <img src={friend.image} alt="one of the friends"></img>
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {friend.balance}€
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}€
        </p>
      )}
      {friend.balance === 0 && (
        <p className="even">You and {friend.name} are even!</p>
      )}
      <Button
        text={isSelected ? "Close" : "Select"}
        onClick={() => selected(friend)}
      />
    </li>
  );
}

function Button({ text, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {text}
    </button>
  );
}

function FormAddFriend({ bool, onClick, addFriend }) {
  const [name, setName] = useState("");
  const [img, setImg] = useState("https://i.pravatar.cc/48");
  if (bool) return;

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !img) return;
    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      image: `${img}?=${id}`,
      balance: 0,
    };
    console.log(newFriend);
    setName("");
    setImg("https://i.pravatar.cc/48");

    addFriend(newFriend);
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👯Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>

      <label>📷Image URL</label>
      <input
        type="text"
        value={img}
        onChange={(e) => setImg(e.target.value)}
      ></input>

      <Button text="Add" />
    </form>
  );
}

function FormSplitBill({ selected, splitBill }) {
  const [bill, setBill] = useState("");
  const [expense, setExpense] = useState("");
  const friendExpense = bill ? bill - expense : "";
  const [paying, setPaying] = useState("user");

  function handleSplit(e) {
    e.preventDefault();

    if (!bill || !expense) return;

    splitBill(paying === "user" ? friendExpense : -expense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSplit}>
      <h2>Split a bill with {selected.name}</h2>
      <label>💵 Bill Value</label>
      <input
        value={bill}
        onChange={(e) => setBill(+e.target.value)}
        type="text"
      ></input>
      <label>💵 Your Expense</label>
      <input
        value={expense}
        onChange={(e) =>
          setExpense(
            Number(e.target.value) > bill ? expense : Number(e.target.value)
          )
        }
        type="text"
      ></input>
      <label>💵 {selected.name}'s Expense Value</label>
      <input type="text" disabled value={friendExpense}></input>

      <label>Who is Paying the bill?</label>
      <select value={paying} onChange={(e) => setPaying(e.target.value)}>
        <option value={"user"}>You</option>
        <option value={"friend"}>{selected.name}</option>
      </select>

      <Button text="Split Bill" />
    </form>
  );
}
