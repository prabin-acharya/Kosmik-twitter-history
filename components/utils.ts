function formatDate(date: any) {
  date = new Date(date);
  const currentDate: any = new Date();

  const differenceInHours: any =
    Math.abs(currentDate - date) / (60 * 60 * 1000);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  if (differenceInHours < 1)
    return `${Math.floor(differenceInHours * 60)} minutes ago`;
  else if (differenceInHours > 1 && differenceInHours < 12)
    return `${Math.floor(differenceInHours)} hours ago`;
  else if (differenceInHours > 12 && differenceInHours < 24) return "1 day ago";
  else if (differenceInHours > 24 && differenceInHours < 24 * 7)
    return `${Math.floor(differenceInHours / 24)} days ago`;
  else if (differenceInHours > 24 * 7 && differenceInHours < 24 * 365)
    return `${date.getDate()} ${monthNames[date.getMonth()]}`;
  else
    return `${date.getDate()} ${
      monthNames[date.getMonth()]
    }  ${date.getFullYear()}`;
}

export { formatDate };
