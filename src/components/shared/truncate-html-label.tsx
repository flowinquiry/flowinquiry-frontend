"use client";

const TruncatedHtmlLabel = ({
  htmlContent,
  wordLimit,
}: {
  htmlContent: string;
  wordLimit: number;
}) => {
  if (htmlContent.length <= wordLimit) {
    return (
      <div className="px-4">
        <div
          className="prose prose-blue dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    );
  }

  const truncatedContent = htmlContent.substring(0, wordLimit) + " ...";

  return (
    <div className="px-4">
      <div
        className="prose prose-blue dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: truncatedContent }}
      />
    </div>
  );
};

export default TruncatedHtmlLabel;
