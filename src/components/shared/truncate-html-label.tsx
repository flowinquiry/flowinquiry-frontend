"use client";

const TruncatedHtmlLabel = ({
  htmlContent,
  wordLimit,
}: {
  htmlContent: string;
  wordLimit: number;
}) => {
  if (htmlContent.length <= wordLimit) {
    return <div dangerouslySetInnerHTML={{ __html: htmlContent }} />;
  }

  const truncatedContent = htmlContent.substring(0, wordLimit) + " ...";

  return (
    <div
      className="prose"
      dangerouslySetInnerHTML={{ __html: truncatedContent }}
    />
  );
};
export default TruncatedHtmlLabel;
