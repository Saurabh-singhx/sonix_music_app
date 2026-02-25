

export const formattedDate= (data:string):string => {

    return new Date(data).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
  });
}

export const formatFileSize = (bytes: number):string=> {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  }
