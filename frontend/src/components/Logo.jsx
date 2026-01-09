export default function Logo({ size = "text-6xl" }) {
  return (
    <h1 className={`${size} font-extrabold tracking-wide text-blue-500`}>
      IMP
      <span className="inline-block animate-bounce text-blue-400">
        Λ
      </span>
      YEE
    </h1>
  );
}