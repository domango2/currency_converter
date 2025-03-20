export default function PageWrapper({ title, children }) {
  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">{title}</h1>
      {children}
    </div>
  );
}
