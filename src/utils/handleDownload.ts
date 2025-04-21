export const handleDownload = (
  name: string,
  content: Blob | string,
  type: string = 'text/plain',
) => {
  const blob = new Blob([content], { type });

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();

  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};
