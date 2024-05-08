import Highlighter from "react-highlight-words";

export const highlightedRender = (text, filteredValue) =>
  filteredValue !== "" ? (
    <Highlighter
      highlightStyle={{
        backgroundColor: "#ffc069",
        padding: 0,
      }}
      searchWords={[filteredValue]}
      autoEscape
      textToHighlight={text ? text.toString() : ""}
    />
  ) : (
    text
  );
