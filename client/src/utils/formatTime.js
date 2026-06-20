export const formatTime = (date) => {
  const now = new Date();
  const created = new Date(date);

  const diff = Math.floor((now - created) / 1000);

  if (diff < 60)
    return "Just now";

  if (diff < 3600)
    return `${Math.floor(diff / 60)} min ago`;

  if (diff < 86400)
    return `${Math.floor(diff / 3600)} hr ago`;

  if (diff < 172800)
    return "Yesterday";

  if (diff < 604800) {
    return created.toLocaleDateString("en-US", {
      weekday: "long",
    });
  }

  return created.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};