import { useState, useEffect } from "react";

const initialFriends = [
	{
		id: 118836,
		name: "Umer",
		image: "https://i.pravatar.cc/48?u=118836",
		balance: -7,
	},
	{
		id: 933372,
		name: "Alisa",
		image: "https://i.pravatar.cc/48?u=933372",
		balance: 20,
	},
	{
		id: 499476,
		name: "Daud",
		image: "https://i.pravatar.cc/48?u=499476",
		balance: 0,
	},
];

export default function App() {
	const [showAddFriend, setShowAddFriend] = useState(false);
	const [friends, setFriends] = useState(initialFriends);
	const [selectedFriend, setSelectedFriend] = useState(null);

	const addFriend = (friend) => {
		setFriends((friends) => [...friends, friend]);
		setShowAddFriend(false);
	};

	const selectFriend = (friend) => {
		setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
		setShowAddFriend(false);
	};

	const splitBill = (value) => {
		setFriends((friends) =>
			friends.map((friend) => {
				if (friend.id !== selectedFriend.id) {
					return friend;
				}
				return {
					...friend,
					balance: friend.balance + value,
				};
			})
		);
	};

	return (
		<div className="app">
			<div className="sidebar">
				<FriendsList
					friends={friends}
					selectFriend={selectFriend}
					selectedFriend={selectedFriend}
				/>

				{showAddFriend && <FormAddFriend addFriend={addFriend} />}

				<Button onClick={() => setShowAddFriend((s) => !s)}>
					{showAddFriend ? "Close" : "Add Friend"}
				</Button>
			</div>

			{selectedFriend && (
				<FormSplitBill
					selectedFriend={selectedFriend}
					splitBill={splitBill}
					key={selectedFriend.id}
				/>
			)}
		</div>
	);
}

function FriendsList({ friends, selectFriend, selectedFriend }) {
	return (
		<ul>
			{friends.map((friend) => (
				<Friend
					key={friend.id}
					friend={friend}
					selectFriend={selectFriend}
					selectedFriend={selectedFriend}
				/>
			))}
		</ul>
	);
}

function Friend({ friend, selectFriend, selectedFriend }) {
	const isSelected = selectedFriend?.id === friend.id;

	return (
		<li className={isSelected ? "selected" : ""}>
			<img src={friend.image} alt={friend.name} />

			<h3>{friend.name}</h3>

			{friend.balance < 0 && (
				<p className="red">
					You owe {friend.name} {Math.abs(friend.balance)}$
				</p>
			)}
			{friend.balance > 0 && (
				<p className="red">
					{friend.name} owes you {friend.balance}$
				</p>
			)}
			{friend.balance == 0 && <p>You and {friend.name} are even</p>}

			<Button onClick={() => selectFriend(friend)}>
				{isSelected ? "Close" : "Select"}
			</Button>
		</li>
	);
}

function Button({ children, onClick }) {
	return (
		<button onClick={onClick} className="button">
			{children}
		</button>
	);
}

function FormAddFriend({ addFriend }) {
	const [name, setName] = useState("");
	const [image, setImage] = useState("https://i.pravatar.cc/48");

	const handleSubmit = (e) => {
		// preventing page reloading
		e.preventDefault();
		// validation
		if (!name || !image) return;
		// create new friend object
		const id = crypto.randomUUID();
		const newFriend = {
			id,
			name,
			image: `${image}?=${id}`,
			balance: 0,
		};
		// add newly created friend to the friends array
		addFriend(newFriend);
		// reset the addFriendForm
		setName("");
		setImage("https://i.pravatar.cc/48");
	};

	return (
		<form className="form-add-friend" onSubmit={handleSubmit}>
			<label>👬Friend name</label>
			<input
				value={name}
				onChange={(e) => setName(e.target.value)}
				type="text"
			/>

			<label>📷Image URL</label>
			<input
				value={image}
				onChange={(e) => setImage(e.target.value)}
				type="text"
			/>

			<Button>Add</Button>
		</form>
	);
}

function FormSplitBill({ selectedFriend, splitBill }) {
	const [bill, setBill] = useState("");
	const [paidByUser, setPaidByUser] = useState("");
	const paidByFriend = bill ? bill - paidByUser : "";
	const [whoIsPaying, setWhoIsPaying] = useState("user");

	const handlePaidByUser = (e) => {
		const amount = Number(e.target.value);
		setPaidByUser(amount > bill ? paidByUser : amount);
	};

	const handleSubmit = (e) => {
		e.preventDefault();

		if (!bill || !paidByUser) return;

		splitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
	};

	return (
		<form className="form-split-bill" onSubmit={handleSubmit}>
			<h2>Split a bill with {selectedFriend.name}</h2>

			<label>💰Bill value</label>
			<input
				type="text"
				value={bill}
				onChange={(e) => setBill(+e.target.value)}
			/>

			<label>🕺🏻Your expense</label>
			<input type="text" value={paidByUser} onChange={handlePaidByUser} />

			<label>👬{selectedFriend.name}'s expense</label>
			<input type="text" disabled value={paidByFriend} />

			<label>🤑Who is paying the bill</label>
			<select
				value={whoIsPaying}
				onChange={(e) => setWhoIsPaying(e.target.value)}
			>
				<option value="user">You</option>
				<option value="friend">{selectedFriend.name}</option>
			</select>

			<Button>Add</Button>
		</form>
	);
}
