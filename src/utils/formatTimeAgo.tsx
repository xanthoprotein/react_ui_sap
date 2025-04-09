export const formatTimeAgo = (timestamp: number) => {
  const now = new Date();
  const diff = now.getTime() - timestamp;
  const diffInMinutes = Math.floor(diff / (1000 * 60));
  const diffInSeconds = Math.floor(diff / 1000);

  if (diffInMinutes >= 1) {
    return `${diffInMinutes} min ago`;
  } else if (diffInSeconds >= 1) {
    return `${diffInSeconds} sec ago`;
  }
  return "Just now";
};
