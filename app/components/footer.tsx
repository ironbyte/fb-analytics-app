export function Footer() {
  const date = new Date().getFullYear();
  const copyrightText = `Copyright © ${date} Moncy's FB Analytics App`;

  return (
    <footer>
      <div className="container flex justify-center text-sm font-semibold text-violet-800">
        {copyrightText}
      </div>
      <div className="h-5" />
    </footer>
  );
}
