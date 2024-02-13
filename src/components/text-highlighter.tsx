export const TextHighlighter: React.FC<{
  text: string;
  searchText: string;
}> = ({ text, searchText }) => {
  const index = text.toLowerCase().indexOf(searchText.toLowerCase());
  if (index === -1) return <>{text}</>;

  return (
    <>
      {text.substring(0, index)}
      <span style={{ fontWeight: "bold" }}>
        {text.substring(index, index + searchText.length)}
      </span>
      {text.substring(index + searchText.length)}
    </>
  );
};
