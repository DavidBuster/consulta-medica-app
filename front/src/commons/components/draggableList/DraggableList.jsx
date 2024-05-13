import React, {
  // Component,
  useState,
} from "react";
// import "./App.css";
// import { RiDragMove2Line } from "react-icons/ri";
import "./DraggableList.scss";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

// class DraggableList extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       items: this.props.list,
//       draggingItem: null,
//       newItemName: "",
//       newItemImage: "",
//     };
//   }

//   handleDragStart = (e, item) => {
//     this.setState({ draggingItem: item });
//     e.dataTransfer.setData("text/plain", "");
//   };

//   handleDragEnd = () => {
//     this.setState({ draggingItem: null });
//   };

//   handleDragOver = (e) => {
//     e.preventDefault();
//   };

//   handleDrop = (e, targetItem) => {
//     const { draggingItem, items } = this.state;
//     if (!draggingItem) return;

//     const currentIndex = items.indexOf(draggingItem);
//     const targetIndex = items.indexOf(targetItem);

//     if (currentIndex !== -1 && targetIndex !== -1) {
//       items.splice(currentIndex, 1);
//       items.splice(targetIndex, 0, draggingItem);
//       this.setState({ items });
//     }
//   };

//   handleNameChange = (e) => {
//     this.setState({ newItemName: e.target.value });
//   };

//   handleImageChange = (e) => {
//     this.setState({ newItemImage: e.target.value });
//   };

//   addNewItem = () => {
//     // Generate a unique ID for the new item
//     const newItemId = Math.max(...this.state.items.map((item) => item.id)) + 1;
//     const newItem = {
//       id: newItemId,
//       name: this.state.newItemName,
//       image: this.state.newItemImage,
//     };

//     // Add the new item to the state
//     this.setState({
//       items: [...this.state.items, newItem],
//       newItemName: "", // Clear the input fields
//       newItemImage: "",
//     });
//   };

//   render() {
//     return (
//       <div className="sortable-list">
//         <div className="new-item">
//           <input
//             type="text"
//             placeholder="Name"
//             value={this.state.newItemName}
//             onChange={this.handleNameChange}
//             className="input-field"
//           />
//           <input
//             type="text"
//             placeholder="Image URL"
//             value={this.state.newItemImage}
//             onChange={this.handleImageChange}
//             className="input-field"
//           />
//           <button onClick={this.addNewItem} className="add-button">
//             Add New Item
//           </button>
//         </div>
//         {this.state.items.map((item, index) => (
//           <div
//             key={item.id}
//             className={`item ${
//               item === this.state.draggingItem ? "dragging" : ""
//             }`}
//             draggable="true"
//             onDragStart={(e) => this.handleDragStart(e, item)}
//             onDragEnd={this.handleDragEnd}
//             onDragOver={this.handleDragOver}
//             onDrop={(e) => this.handleDrop(e, item)}
//           >
//             <span>{index + 1}</span>
//             <img
//               src={item.image}
//               alt={item.name}
//               style={{ maxWidth: "200px" }}
//             />
//             <span>{item.name}</span>

//             {/* Use the React icon component */}
//             {/* <RiDragMove2Line /> */}
//           </div>
//         ))}
//       </div>
//     );
//   }
// }

// export { DraggableList };

// import React from "react";

export const DraggableList = ({ items, setItems }) => {
  // draggingItem: null,
  // newItemName: "",
  // newItemImage: "",

  const [draggingItem, setDraggingItem] = useState();
  const [newItemName, setNewItemName] = useState("");
  const [newItemImage, setNewItemImage] = useState("");

  const handleDragStart = (e, item) => {
    setDraggingItem(item);
    e.dataTransfer.setData("text/plain", "");
  };

  const handleDragEnd = () => {
    setDraggingItem();
    // this.setState({ draggingItem: null });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetItem) => {
    // const { draggingItem, items } = this.state;
    if (!draggingItem) return;

    const currentIndex = items.indexOf(draggingItem);
    const targetIndex = items.indexOf(targetItem);

    if (currentIndex !== -1 && targetIndex !== -1) {
      const newItems = [...items];
      newItems.splice(currentIndex, 1);
      newItems.splice(targetIndex, 0, draggingItem);
      //   this.setState({ items });
      setItems(newItems);
    }
  };

  const handleNameChange = (e) => {
    setNewItemName(e.target.value);
  };

  const handleImageChange = (e) => {
    setNewItemImage(e.target.value);
  };

  const addNewItem = () => {
    // Generate a unique ID for the new item
    const newItemId = Math.max(...this.state.items.map((item) => item.id)) + 1;
    const newItem = {
      id: newItemId,
      name: this.state.newItemName,
      image: this.state.newItemImage,
    };

    // Add the new item to the state
    this.setState({
      items: [...this.state.items, newItem],
      newItemName: "", // Clear the input fields
      newItemImage: "",
    });
  };

  return (
    <div className="sortable-list">
      {/* <div className="new-item">
        <input
          type="text"
          placeholder="Name"
          value={newItemName}
          onChange={handleNameChange}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newItemImage}
          onChange={handleImageChange}
          className="input-field"
        />
        <button onClick={addNewItem} className="add-button">
          Add New Item
        </button>
      </div> */}

      <table>
        <thead>
          <tr>
            <th />
            <th>INDEX</th>
            <th>FIRST NAME</th>
            <th>LAST NAME</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={item.id}
              //   className={`item ${item === draggingItem ? "dragging" : ""}`}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, item)}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, item)}
            >
              <td>
                <DragIndicatorIcon />
              </td>
              <td>{index + 1}</td>
              {/* <img src={item.image} alt={item.name} style={{ maxWidth: "200px" }} /> */}
              <td>{item.firstName}</td>
              <td>{item.lastName}</td>

              {/* Use the React icon component */}
              {/* <RiDragMove2Line /> */}
            </tr>
          ))}
        </tbody>
      </table>
      {/* {items.map((item, index) => (
        <div
          key={item.id}
          className={`item ${item === draggingItem ? "dragging" : ""}`}
          draggable="true"
          onDragStart={(e) => handleDragStart(e, item)}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, item)}
        >
          <DragIndicatorIcon />
          <span>{index + 1}</span>
          <img src={item.image} alt={item.name} style={{ maxWidth: "200px" }} />
          <span>{item.name}</span>

        </div>
      ))} */}
    </div>
  );
};
