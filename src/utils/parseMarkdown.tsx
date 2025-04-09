export const parseMarkdown = (markdown: string) => {
  const lines = markdown?.split("\n");
  const parsedLines = lines?.map((line, index) => {
    if (line.startsWith("##")) {
      return (
        <h2 key={index} className="text-xl font-semibold mt-4 mb-2">
          {line.replace("##", "").trim()}
        </h2>
      );
    } else if (line.startsWith("-")) {
      return (
        <li key={index} className="ml-6 list-disc">
          {line.replace("-", "").trim()}
        </li>
      );
    }
    return (
      <p key={index} className="mb-2">
        {line}
      </p>
    );
  });

  return parsedLines;
};
